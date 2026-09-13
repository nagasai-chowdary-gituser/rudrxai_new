"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PROJECT_FILES_BUCKET, getSupabase } from "@/lib/supabase"
import { generatePassword, hashPassword } from "@/lib/password"
import { clearAdminSession, getAdminSession } from "@/lib/session"
import { logAdminEvent, updateAdminPassword } from "@/lib/admin-auth"
import { getProject } from "@/lib/data"
import { DEFAULT_STAGES, MAX_STAGES, MAX_STAGE_LABEL } from "@/lib/stages"
import {
  deleteStages,
  newStageId,
  readStages,
  writeStages,
  type ProjectStage,
} from "@/lib/stages-store"
import { MAX_DELIVERABLES, MAX_DELIVERABLE_TEXT } from "@/lib/deliverables"
import {
  deleteDeliverables,
  newDeliverableId,
  writeDeliverables,
  type Deliverable,
} from "@/lib/deliverables-store"

/**
 * Admin mutations.
 *
 * Every action re-checks the admin session itself. Middleware already guards
 * the pages, but server actions are POST endpoints in their own right — they
 * must never rely on the caller having come from a protected page.
 */

export type ActionState = {
  error?: string
  success?: string
  /** Returned once after a create or reset so the pair can be copied. */
  username?: string
  password?: string
}

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
  return { success: `Client "${displayName}" created.`, username, password }
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
  const { data: client } = await supabase
    .from("clients")
    .select("username")
    .eq("id", clientId)
    .maybeSingle()

  const { error } = await supabase
    .from("clients")
    .update({ password_hash: await hashPassword(password) })
    .eq("id", clientId)

  if (error) return { error: `Could not reset password: ${error.message}` }

  await logAdminEvent("client_password_reset", clientId)
  revalidatePath(`/king/clients/${clientId}`)

  return {
    success: "New password set. The old one no longer works.",
    username: client?.username,
    password,
  }
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
    .select("id, pdf_path")
    .eq("client_id", clientId)

  const projectIds = (projects ?? []).map((project) => project.id)
  await deleteStages(projectIds)
  await deleteDeliverables(projectIds)

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

    // Give every new project the default flow. It is editable afterwards, so
    // this is a starting point rather than a fixed set.
    await writeStages(
      targetProjectId,
      DEFAULT_STAGES.map((label) => ({
        id: newStageId(),
        label,
        completed: false,
        completed_at: null,
      }))
    )
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

  await deleteStages([projectId])
  await deleteDeliverables([projectId])

  const { error } = await supabase.from("projects").delete().eq("id", projectId)
  if (error) return { error: `Could not delete project: ${error.message}` }

  revalidatePath(`/king/clients/${project.client_id}`)
  return { success: "Project deleted." }
}

// ------------------------------------------------------------------- stages

type IncomingStage = { id?: string; label: string; completed: boolean }

/**
 * Replace a project's stage list in one go.
 *
 * The editor holds the list in the browser — adding, renaming, reordering,
 * ticking — and submits it whole. Rows keep their id, so a completed_at stamp
 * survives a rename or a move; anything missing from the submission is dropped.
 */
export async function saveStages(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const projectId = text(formData, "project_id", 40)
  const project = await getProject(projectId)
  if (!project) return { error: "Project not found." }

  let incoming: IncomingStage[]
  try {
    const raw = formData.get("stages")
    incoming = typeof raw === "string" ? JSON.parse(raw) : []
  } catch {
    return { error: "Could not read the stage list." }
  }

  if (!Array.isArray(incoming)) return { error: "Could not read the stage list." }
  if (incoming.length > MAX_STAGES) {
    return { error: `A project can have at most ${MAX_STAGES} stages.` }
  }

  const existing = (await readStages(projectId)) ?? []
  const existingById = new Map(existing.map((stage) => [stage.id, stage]))
  const now = new Date().toISOString()

  const next: ProjectStage[] = incoming
    .map((stage) => ({
      id: typeof stage.id === "string" && stage.id ? stage.id : undefined,
      label: String(stage.label ?? "").trim().slice(0, MAX_STAGE_LABEL),
      completed: Boolean(stage.completed),
    }))
    .filter((stage) => stage.label.length > 0)
    .map((stage) => {
      const previous = stage.id ? existingById.get(stage.id) : undefined

      // Stamp the moment a stage is first ticked; clear it if it is unticked.
      const completedAt = !stage.completed
        ? null
        : previous?.completed && previous.completed_at
          ? previous.completed_at
          : now

      return {
        id: stage.id ?? newStageId(),
        label: stage.label,
        completed: stage.completed,
        completed_at: completedAt,
      }
    })

  const result = await writeStages(projectId, next)
  if (result.error) return { error: result.error }

  await logAdminEvent("stages_saved", `${projectId}:${next.length}`)
  revalidatePath(`/king/clients/${project.client_id}`)

  return { success: "Progress saved." }
}

// ------------------------------------------------------------- deliverables

/**
 * Replace a project's deliverables in one go.
 *
 * A plain ordered list — the number the client sees is just the position, so
 * reordering renumbers without touching anything stored.
 */
export async function saveDeliverables(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const projectId = text(formData, "project_id", 40)
  const project = await getProject(projectId)
  if (!project) return { error: "Project not found." }

  let incoming: { id?: string; text: string }[]
  try {
    const raw = formData.get("deliverables")
    incoming = typeof raw === "string" ? JSON.parse(raw) : []
  } catch {
    return { error: "Could not read the deliverables list." }
  }

  if (!Array.isArray(incoming)) return { error: "Could not read the deliverables list." }
  if (incoming.length > MAX_DELIVERABLES) {
    return { error: `A project can have at most ${MAX_DELIVERABLES} deliverables.` }
  }

  const next: Deliverable[] = incoming
    .map((item) => ({
      id: typeof item.id === "string" && item.id ? item.id : newDeliverableId(),
      text: String(item.text ?? "").trim().slice(0, MAX_DELIVERABLE_TEXT),
    }))
    .filter((item) => item.text.length > 0)

  const result = await writeDeliverables(projectId, next)
  if (result.error) return { error: result.error }

  await logAdminEvent("deliverables_saved", `${projectId}:${next.length}`)
  revalidatePath(`/king/clients/${project.client_id}`)

  return { success: next.length === 0 ? "Deliverables cleared." : "Deliverables saved." }
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
