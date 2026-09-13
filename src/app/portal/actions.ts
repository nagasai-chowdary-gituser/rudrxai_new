"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import { verifyPassword } from "@/lib/password"
import { getClientIp } from "@/lib/rate-limit"
import {
  clearPortalAttempts,
  isPortalLockedOut,
  recordPortalFailure,
} from "@/lib/portal-throttle"
import { headers } from "next/headers"
import {
  clearClientSession,
  createClientSession,
  getClientSession,
} from "@/lib/session"
import { getClientById, getClientByUsername, getReviewForClient } from "@/lib/data"

export type PortalState = { error?: string; success?: string }

export async function login(
  _prev: PortalState,
  formData: FormData
): Promise<PortalState> {
  const username = String(formData.get("username") ?? "").trim().slice(0, 60)
  const password = String(formData.get("password") ?? "").slice(0, 200)

  if (!username || !password) {
    return { error: "Enter your username and password." }
  }

  // Throttle credential stuffing. Server actions have no request object, so the
  // IP comes from the incoming headers. Counted in the database so the limit
  // survives across serverless instances.
  const headerList = await headers()
  const ip = getClientIp(new Request("https://local", { headers: headerList }))

  if (await isPortalLockedOut(ip)) {
    return {
      error: "Too many sign-in attempts. Please try again in 15 minutes.",
    }
  }

  let client
  try {
    client = await getClientByUsername(username)
  } catch (error) {
    console.error("Portal login lookup failed:", error)
    return { error: "Sign-in is unavailable right now. Please try again shortly." }
  }

  // Same message whether the username or the password was wrong, so the form
  // cannot be used to discover which usernames exist.
  const invalid = { error: "Incorrect username or password." }

  if (!client || !client.is_active) {
    await recordPortalFailure(ip)
    return invalid
  }

  if (!(await verifyPassword(password, client.password_hash))) {
    await recordPortalFailure(ip)
    return invalid
  }

  await clearPortalAttempts(ip)
  await createClientSession(client.id)
  // Greet them by name before dropping them into the portal.
  redirect("/portal/welcome")
}

export async function logout(): Promise<void> {
  await clearClientSession()
  redirect("/portal")
}

export async function submitReview(
  _prev: PortalState,
  formData: FormData
): Promise<PortalState> {
  const clientId = await getClientSession()
  if (!clientId) return { error: "Your session expired. Please sign in again." }

  const client = await getClientById(clientId)
  if (!client) return { error: "Account not found." }

  // The switch in the admin panel is the authority — never trust the form.
  if (!client.reviews_enabled) {
    return { error: "The review form is not open for your account." }
  }

  const existing = await getReviewForClient(clientId)
  if (existing) return { error: "You have already submitted your review." }

  const rating = Number(formData.get("rating"))
  const body = String(formData.get("body") ?? "").trim().slice(0, 2000)

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Please choose a rating from 1 to 5 stars." }
  }

  if (body.length < 20) {
    return { error: "Please write at least 20 characters." }
  }

  const supabase = getSupabase()
  const { error } = await supabase.from("reviews").insert({
    client_id: clientId,
    rating,
    body,
    status: "pending",
  })

  if (error) {
    // The unique index is the real guard against a double submit.
    if (error.code === "23505") {
      return { error: "You have already submitted your review." }
    }
    return { error: `Could not submit your review: ${error.message}` }
  }

  revalidatePath("/portal/review")
  return { success: "Thank you — your review has been sent for approval." }
}
