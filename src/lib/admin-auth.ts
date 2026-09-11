import "server-only"

import { getSupabase, AdminSettingsRow } from "./supabase"
import { hashPassword, safeEqual, verifyPassword } from "./password"

/**
 * Admin credential store.
 *
 * Seeded once from environment variables, then kept in Supabase so the
 * password, pattern and gate colour can be changed from the panel without a
 * redeploy. Environment values act only as the initial seed.
 */

const LOCKOUT_WINDOW_MINUTES = 15
const LOCKOUT_THRESHOLD = 5

export async function getAdminSettings(): Promise<AdminSettingsRow> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("admin_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle()

  if (error) throw new Error(`Failed to read admin settings: ${error.message}`)
  if (data) return data as AdminSettingsRow

  // First run: seed from the environment.
  // Every value must come from the environment. No fallbacks: a default here
  // would hardcode the real answer into source that is committed publicly.
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD
  const gateColor = process.env.ADMIN_GATE_COLOR
  const pattern = process.env.ADMIN_PATTERN

  if (!username || !password || !gateColor || !pattern) {
    throw new Error(
      "Admin gate is not configured — set ADMIN_USERNAME, ADMIN_PASSWORD, " +
        "ADMIN_GATE_COLOR and ADMIN_PATTERN in the environment"
    )
  }

  const seeded = {
    id: 1,
    username,
    password_hash: await hashPassword(password),
    gate_color: gateColor.trim().toLowerCase(),
    pattern: pattern.replace(/\s/g, ""),
  }

  const { data: inserted, error: insertError } = await supabase
    .from("admin_settings")
    .insert(seeded)
    .select()
    .single()

  if (insertError) {
    throw new Error(`Failed to seed admin settings: ${insertError.message}`)
  }

  return inserted as AdminSettingsRow
}

export async function updateAdminPassword(newPassword: string): Promise<void> {
  await getAdminSettings() // ensure the row exists
  const supabase = getSupabase()

  const { error } = await supabase
    .from("admin_settings")
    .update({ password_hash: await hashPassword(newPassword), updated_at: new Date().toISOString() })
    .eq("id", 1)

  if (error) throw new Error(`Failed to update admin password: ${error.message}`)
}

// --------------------------------------------------------- step verification

export async function checkGateColor(color: string): Promise<boolean> {
  const settings = await getAdminSettings()
  return safeEqual(color.trim().toLowerCase(), settings.gate_color.toLowerCase())
}

export async function checkAdminUsername(username: string): Promise<boolean> {
  const settings = await getAdminSettings()
  return safeEqual(username.trim().toLowerCase(), settings.username.trim().toLowerCase())
}

export async function checkAdminPassword(password: string): Promise<boolean> {
  const settings = await getAdminSettings()
  return verifyPassword(password, settings.password_hash)
}

export async function checkAdminPattern(pattern: number[]): Promise<boolean> {
  const settings = await getAdminSettings()
  return safeEqual(pattern.join(","), settings.pattern.replace(/\s/g, ""))
}

// --------------------------------------------------------------- lockout

/**
 * Failed attempts are counted in Postgres rather than in memory: serverless
 * instances do not share state, so an in-memory counter would reset itself
 * constantly and a script could brute-force a 9-dot pattern in seconds.
 */
export async function isLockedOut(ip: string): Promise<boolean> {
  const supabase = getSupabase()
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MINUTES * 60 * 1000).toISOString()

  const { count, error } = await supabase
    .from("gate_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", since)

  if (error) {
    // Fail closed: if we cannot count attempts, do not open the door.
    console.error("Failed to read gate attempts:", error.message)
    return true
  }

  return (count ?? 0) >= LOCKOUT_THRESHOLD
}

export async function recordFailedAttempt(ip: string, step: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from("gate_attempts").insert({ ip, step })
  await logAdminEvent("gate_fail", `step=${step}`, ip)
}

export async function clearAttempts(ip: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from("gate_attempts").delete().eq("ip", ip)
}

export async function logAdminEvent(
  event: string,
  detail?: string,
  ip?: string
): Promise<void> {
  try {
    const supabase = getSupabase()
    await supabase.from("admin_audit").insert({ event, detail: detail ?? null, ip: ip ?? null })
  } catch (error) {
    // Never let audit logging break a request.
    console.error("Audit log failed:", error)
  }
}
