"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PROJECT_FILES_BUCKET, getSupabase } from "@/lib/supabase"
import { generatePassword, hashPassword } from "@/lib/password"
import { clearAdminSession, getAdminSession } from "@/lib/session"
import { logAdminEvent, updateAdminPassword } from "@/lib/admin-auth"
import { getProject } from "@/lib/data"

/**
 * Admin mutations.
 *
 * Every action re-checks the admin session itself. Middleware already guards
 * the pages, but server actions are POST endpoints in their own right — they
 * must never rely on the caller having come from a protected page.
 */

export type ActionState = { error?: string; success?: string; password?: string }

async function requireAdmin() {
  if (!(await getAdminSession())) {
    throw new Error("Not authorised")
  }
}

const MAX_PDF_BYTES = 8 * 1024 * 1024 // 8 MB — comfortable on Vercel's free tier

function text(formData: FormData, key: string, max = 200): string {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function number(formData: FormData, key: string): number {
  const value = Number(formData.get(key))
  return Number.isFinite(value) && value >= 0 ? value : 0
}

// ------------------------------------------------------------------ clients

export async function createClient(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const username = text(formData, "username", 60)
  const displayName = text(formData, "display_name", 120)
  const company = text(formData, "company", 120)
  const providedPassword = text(formData, "password", 100)

  if (!username || !displayName) {
    return { error: "Username and client name are required." }
  }

  if (username.length < 3) {
    return { error: "Username must be at least 3 characters." }
  }

  if (providedPassword && providedPassword.length < 8) {
    return { error: "Password must be at least 8 characters." }
  }

  const supabase = getSupabase()

  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .ilike("username", username)
    .maybeSingle()

  if (existing) return { error: "That username is already taken." }

  const password = providedPassword || generatePassword()

  const { error } = await supabase.from("clients").insert({
    username,
    display_name: displayName,
    company: company || null,
    password_hash: await hashPassword(password),
  })

  if (error) return { error: `Could not create client: ${error.message}` }

  await logAdminEvent("client_created", username)
  revalidatePath("/king")

  // Returned once so it can be copied — it is never recoverable afterwards.
  return { success: `Client "${displayName}" created.`, password }
}

export async function resetClientPassword(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const clientId = text(formData, "client_id", 40)
  if (!clientId) return { error: "Missing client." }

  const password = text(formData, "password", 100) || generatePassword()
  if (password.length < 8) return { error: "Password must be at least 8 characters." }

  const supabase = getSupabase()
  const { error } = await supabase
    .from("clients")
    .update({ password_hash: await hashPassword(password) })
    .eq("id", clientId)

  if (error) return { error: `Could not reset password: ${error.message}` }

  await logAdminEvent("client_password_reset", clientId)
  revalidatePath(`/king/clients/${clientId}`)

  return { success: "Password reset.", password }
}

export async function updateClient(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const clientId = text(formData, "client_id", 40)
  const displayName = text(formData, "display_name", 120)
  const company = text(formData, "company", 120)

  if (!clientId || !displayName) return { error: "Client name is required." }

  const supabase = getSupabase()
  const { error } = await supabase
    .from("clients")
    .update({ display_name: displayName, company: company || null })
    .eq("id", clientId)

  if (error) return { error: `Could not update client: ${error.message}` }

  revalidatePath(`/king/clients/${clientId}`)
  revalidatePath("/king")
  return { success: "Client details saved." }
}

export async function toggleReviews(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const clientId = text(formData, "client_id", 40)
  const enabled = formData.get("enabled") === "true"

  const supabase = getSupabase()
  const { error } = await supabase
    .from("clients")
    .update({ reviews_enabled: enabled })
    .eq("id", clientId)

  if (error) return { error: `Could not update: ${error.message}` }

  await logAdminEvent(enabled ? "reviews_enabled" : "reviews_disabled", clientId)
  revalidatePath(`/king/clients/${clientId}`)
  revalidatePath("/king")

  return { success: enabled ? "Review form unlocked for this client." : "Review form locked." }
}

export async function deleteClient(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const clientId = text(formData, "client_id", 40)
  const confirmation = text(formData, "confirm", 60)

  if (confirmation !== "DELETE") {
    return { error: 'Type DELETE to confirm.' }
  }

  const supabase = getSupabase()

  // Remove stored PDFs first — deleting the row cascades, but storage does not.
  const { data: projects } = await supabase
    .from("projects")
    .select("pdf_path")
    .eq("client_id", clientId)

  const paths = (projects ?? [])
    .map((project) => project.pdf_path)
    .filter((path): path is string => Boolean(path))

  if (paths.length > 0) {
    await supabase.storage.from(PROJECT_FILES_BUCKET).remove(paths)
  }

  const { error } = await supabase.from("clients").delete().eq("id", clientId)
  if (error) return { error: `Could not delete client: ${error.message}` }

  await logAdminEvent("client_deleted", clientId)
  revalidatePath("/king")
  redirect("/king")
}

// ----------------------------------------------------------------- projects

export async function saveProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const projectId = text(formData, "project_id", 40)
  const clientId = text(formData, "client_id", 40)
  const name = text(formData, "name", 160)

  if (!name) return { error: "Project name is required." }
  if (!projectId && !clientId) return { error: "Missing client." }

  const currency = formData.get("currency") === "USD" ? "USD" : "INR"
  const revisionsUsed = number(formData, "revisions_used")
  const revisionsTotal = number(formData, "revisions_total")
  const advancePaid = number(formData, "advance_paid")
  const totalCharge = number(formData, "total_charge")

  if (revisionsUsed > revisionsTotal) {
    return { error: "Revisions used cannot exceed the total." }
  }

  if (advancePaid > totalCharge) {
    return { error: "Advance paid cannot exceed the total charge." }
  }

  const supabase = getSupabase()

  const payload = {
    name,
    currency,
    revisions_used: Math.round(revisionsUsed),
    revisions_total: Math.round(revisionsTotal),
    advance_paid: advancePaid,
    total_charge: totalCharge,
    updated_at: new Date().toISOString(),
  }

  let targetProjectId = projectId
  let targetClientId = clientId

  if (projectId) {
    const existing = await getProject(projectId)
    if (!existing) return { error: "Project not found." }
    targetClientId = existing.client_id

    const { error } = await supabase.from("projects").update(payload).eq("id", projectId)
    if (error) return { error: `Could not save project: ${error.message}` }
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert({ ...payload, client_id: clientId })
      .select("id")
      .single()

    if (error) return { error: `Could not create project: ${error.message}` }
    targetProjectId = data.id
  }

  // Optional PDF upload.
  const file = formData.get("pdf")
  if (file instanceof File && file.size > 0) {
    if (file.type !== "application/pdf") {
      return { error: "Only PDF files can be uploaded." }
    }
    if (file.size > MAX_PDF_BYTES) {
      return { error: "PDF must be 8 MB or smaller." }
    }

    const path = `${targetClientId}/${targetProjectId}.pdf`
    const { error: uploadError } = await supabase.storage
      .from(PROJECT_FILES_BUCKET)
      .upload(path, file, { upsert: true, contentType: "application/pdf" })

    if (uploadError) {
      return { error: `Project saved, but the upload failed: ${uploadError.message}` }
    }

    await supabase
      .from("projects")
      .update({ pdf_path: path, pdf_name: file.name.slice(0, 160) })
      .eq("id", targetProjectId)
  }

  revalidatePath(`/king/clients/${targetClientId}`)
  revalidatePath("/king")

  return { success: projectId ? "Project updated." : "Project created." }
}

export async function deleteProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const projectId = text(formData, "project_id", 40)
  const project = await getProject(projectId)
  if (!project) return { error: "Project not found." }

  const supabase = getSupabase()

  if (project.pdf_path) {
    await supabase.storage.from(PROJECT_FILES_BUCKET).remove([project.pdf_path])
  }

  const { error } = await supabase.from("projects").delete().eq("id", projectId)
  if (error) return { error: `Could not delete project: ${error.message}` }

  revalidatePath(`/king/clients/${project.client_id}`)
  return { success: "Project deleted." }
}

// ------------------------------------------------------------------ reviews

export async function setReviewStatus(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const reviewId = text(formData, "review_id", 40)
  const status = text(formData, "status", 20)

  if (!["pending", "published", "hidden"].includes(status)) {
    return { error: "Unknown status." }
  }

  const supabase = getSupabase()
  const { error } = await supabase
    .from("reviews")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", reviewId)

  if (error) return { error: `Could not update review: ${error.message}` }

  await logAdminEvent("review_status", `${reviewId}:${status}`)
  revalidatePath("/king/reviews")
  revalidatePath("/reviews")

  return { success: `Review ${status}.` }
}

// ------------------------------------------------------------------- admin

export async function changeAdminPassword(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const password = text(formData, "new_password", 100)
  const confirm = text(formData, "confirm_password", 100)

  if (password.length < 10) {
    return { error: "Admin password must be at least 10 characters." }
  }

  if (password !== confirm) return { error: "Passwords do not match." }

  await updateAdminPassword(password)
  await logAdminEvent("admin_password_changed")

  return { success: "Admin password changed. The old one no longer works." }
}

export async function signOut(): Promise<void> {
  await clearAdminSession()
  redirect("/")
}
