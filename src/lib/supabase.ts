import "server-only"

import { createClient, SupabaseClient } from "@supabase/supabase-js"

/**
 * Server-side Supabase client.
 *
 * Uses the service role key, so it bypasses RLS — which is why this module is
 * marked server-only and must never be imported from a client component. The
 * browser never receives a Supabase key of any kind.
 */

let cached: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (cached) return cached

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
    )
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return cached
}

/** True when both Supabase variables are present, used to render setup notices. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export const PROJECT_FILES_BUCKET = "project-files"

// ---------------------------------------------------------------- row types

export type ClientRow = {
  id: string
  username: string
  password_hash: string
  display_name: string
  company: string | null
  reviews_enabled: boolean
  is_active: boolean
  created_at: string
}

export type ProjectRow = {
  id: string
  client_id: string
  name: string
  pdf_path: string | null
  pdf_name: string | null
  currency: "INR" | "USD"
  revisions_used: number
  revisions_total: number
  advance_paid: number
  total_charge: number
  created_at: string
  updated_at: string
}

export type ReviewRow = {
  id: string
  client_id: string
  rating: number
  body: string
  status: "pending" | "published" | "hidden"
  submitted_at: string
  reviewed_at: string | null
}

export type AdminSettingsRow = {
  id: number
  username: string
  password_hash: string
  gate_color: string
  pattern: string
  updated_at: string
}
