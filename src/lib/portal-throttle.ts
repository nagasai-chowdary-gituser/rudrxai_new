import "server-only"

import { getSupabase } from "./supabase"

/**
 * Brute-force protection for the client portal login.
 *
 * Counted in Postgres rather than in memory: serverless instances share no
 * state, so an in-memory counter resets itself on every cold start and can be
 * defeated simply by spreading guesses out. Reuses the gate_attempts table the
 * admin gate already has, tagged so the two counters never interfere.
 */

const PORTAL_STEP = "portal"
const WINDOW_MINUTES = 15
const THRESHOLD = 10

export async function isPortalLockedOut(ip: string): Promise<boolean> {
  const supabase = getSupabase()
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString()

  const { count, error } = await supabase
    .from("gate_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .eq("step", PORTAL_STEP)
    .gte("created_at", since)

  if (error) {
    // Fail open here, unlike the admin gate: a database hiccup must not lock
    // every client out of their own portal. The password check still applies.
    console.error("Failed to read portal attempts:", error.message)
    return false
  }

  return (count ?? 0) >= THRESHOLD
}

export async function recordPortalFailure(ip: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from("gate_attempts").insert({ ip, step: PORTAL_STEP })
}

export async function clearPortalAttempts(ip: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from("gate_attempts").delete().eq("ip", ip).eq("step", PORTAL_STEP)
}
