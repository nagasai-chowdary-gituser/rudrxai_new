import "server-only"

import {
  ClientRow,
  PROJECT_FILES_BUCKET,
  ProjectRow,
  ReviewRow,
  getSupabase,
} from "./supabase"

/**
 * All database access lives here so the pages and actions stay readable and
 * every query is in one auditable place.
 */

/**
 * Postgres throws on a malformed uuid rather than returning no rows, which
 * turns a bad id in the URL into a 500 — and a 500 tells a prober the route
 * exists. Check the shape first and treat anything else as "not found".
 */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value)
}

// ------------------------------------------------------------------ clients

export async function listClients(): Promise<
  (ClientRow & { project_count: number; review_status: string | null })[]
> {
  const supabase = getSupabase()

  const [{ data: clients, error }, { data: projects }, { data: reviews }] =
    await Promise.all([
      supabase.from("clients").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("client_id"),
      supabase.from("reviews").select("client_id, status"),
    ])

  if (error) throw new Error(`Failed to load clients: ${error.message}`)

  const projectCounts = new Map<string, number>()
  for (const project of projects ?? []) {
    projectCounts.set(project.client_id, (projectCounts.get(project.client_id) ?? 0) + 1)
  }

  const reviewStatus = new Map<string, string>()
  for (const review of reviews ?? []) {
    reviewStatus.set(review.client_id, review.status)
  }

  return (clients ?? []).map((client) => ({
    ...(client as ClientRow),
    project_count: projectCounts.get(client.id) ?? 0,
    review_status: reviewStatus.get(client.id) ?? null,
  }))
}

export async function getClientById(id: string): Promise<ClientRow | null> {
  if (!isUuid(id)) return null
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw new Error(`Failed to load client: ${error.message}`)
  return (data as ClientRow) ?? null
}

export async function getClientByUsername(username: string): Promise<ClientRow | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .ilike("username", username.trim())
    .maybeSingle()

  if (error) throw new Error(`Failed to look up client: ${error.message}`)
  return (data as ClientRow) ?? null
}

// ----------------------------------------------------------------- projects

export async function listProjectsForClient(clientId: string): Promise<ProjectRow[]> {
  if (!isUuid(clientId)) return []
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to load projects: ${error.message}`)
  return (data ?? []) as ProjectRow[]
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  if (!isUuid(id)) return null
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw new Error(`Failed to load project: ${error.message}`)
  return (data as ProjectRow) ?? null
}

/**
 * Short-lived signed URL for a project PDF. The bucket is private, so this is
 * the only way to read a file — and the link stops working after 5 minutes.
 */
export async function getSignedPdfUrl(path: string): Promise<string | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase.storage
    .from(PROJECT_FILES_BUCKET)
    .createSignedUrl(path, 300)

  if (error) {
    console.error("Failed to sign PDF URL:", error.message)
    return null
  }

  return data?.signedUrl ?? null
}

// ------------------------------------------------------------------ reviews

export async function getReviewForClient(clientId: string): Promise<ReviewRow | null> {
  if (!isUuid(clientId)) return null
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("client_id", clientId)
    .maybeSingle()

  if (error) throw new Error(`Failed to load review: ${error.message}`)
  return (data as ReviewRow) ?? null
}

export type PublishedReview = {
  id: string
  rating: number
  body: string
  submitted_at: string
  display_name: string
  company: string | null
}

export async function listPublishedReviews(): Promise<PublishedReview[]> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, body, submitted_at, clients(display_name, company)")
    .eq("status", "published")
    .order("submitted_at", { ascending: false })

  if (error) throw new Error(`Failed to load reviews: ${error.message}`)

  return (data ?? []).map((row) => {
    // Supabase types an embedded relation as an array; it is one row here.
    const client = Array.isArray(row.clients) ? row.clients[0] : row.clients
    return {
      id: row.id as string,
      rating: row.rating as number,
      body: row.body as string,
      submitted_at: row.submitted_at as string,
      display_name: (client?.display_name as string) ?? "Client",
      company: (client?.company as string) ?? null,
    }
  })
}

export async function listAllReviews(): Promise<
  (ReviewRow & { display_name: string; company: string | null })[]
> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("reviews")
    .select("*, clients(display_name, company)")
    .order("submitted_at", { ascending: false })

  if (error) throw new Error(`Failed to load reviews: ${error.message}`)

  return (data ?? []).map((row) => {
    const client = Array.isArray(row.clients) ? row.clients[0] : row.clients
    return {
      ...(row as ReviewRow),
      display_name: (client?.display_name as string) ?? "Client",
      company: (client?.company as string) ?? null,
    }
  })
}

// ------------------------------------------------------------------ helpers

export function formatMoney(amount: number, currency: "INR" | "USD"): string {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
