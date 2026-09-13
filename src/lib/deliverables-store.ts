import "server-only"

import { PROJECT_FILES_BUCKET, getSupabase } from "./supabase"
import { MAX_DELIVERABLES, MAX_DELIVERABLE_TEXT } from "./deliverables"

/**
 * A project's deliverables: a plain numbered list of what the client is
 * getting.
 *
 * Stored the same way as the stages — one small JSON file per project in the
 * private bucket — so the feature needs no schema change. Read server-side
 * only; the browser never touches the file.
 */

export type Deliverable = {
  id: string
  text: string
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Every path is built from a project id. Refusing anything that is not a uuid
 * means a crafted id can never escape its folder, whatever calls this.
 */
function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value)
}

function deliverablePath(projectId: string): string {
  return `deliverables/${projectId}.json`
}

/** Accept only what we wrote, so a corrupt file cannot break a page. */
function parse(raw: unknown): Deliverable[] {
  if (!Array.isArray(raw)) return []

  return raw
    .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === "object")
    .map((entry, index) => ({
      id: typeof entry.id === "string" && entry.id ? entry.id : `d${index}`,
      text: typeof entry.text === "string" ? entry.text.slice(0, MAX_DELIVERABLE_TEXT) : "",
    }))
    .filter((item) => item.text.trim().length > 0)
    .slice(0, MAX_DELIVERABLES)
}

export async function readDeliverables(projectId: string): Promise<Deliverable[]> {
  if (!isUuid(projectId)) return []
  const supabase = getSupabase()

  const { data, error } = await supabase.storage
    .from(PROJECT_FILES_BUCKET)
    .download(deliverablePath(projectId))

  // No file means none have been added yet.
  if (error || !data) return []

  try {
    return parse(JSON.parse(await data.text()))
  } catch {
    console.error("Deliverables file for", projectId, "is not valid JSON")
    return []
  }
}

export async function readDeliverablesForProjects(
  projectIds: string[]
): Promise<Record<string, Deliverable[]>> {
  const entries = await Promise.all(
    projectIds.map(async (id) => [id, await readDeliverables(id)] as const)
  )

  const grouped: Record<string, Deliverable[]> = {}
  for (const [id, items] of entries) grouped[id] = items
  return grouped
}

export async function writeDeliverables(
  projectId: string,
  items: Deliverable[]
): Promise<{ error?: string }> {
  if (!isUuid(projectId)) return { error: "Invalid project." }
  const supabase = getSupabase()

  const body = new Blob([JSON.stringify(items)], { type: "application/json" })

  const { error } = await supabase.storage
    .from(PROJECT_FILES_BUCKET)
    .upload(deliverablePath(projectId), body, {
      upsert: true,
      contentType: "application/json",
    })

  if (error) {
    console.error("Failed to write deliverables:", error.message)
    return { error: `Could not save deliverables: ${error.message}` }
  }

  return {}
}

/** Storage is not cascaded, so a deleted project takes its file with it. */
export async function deleteDeliverables(projectIds: string[]): Promise<void> {
  const ids = projectIds.filter(isUuid)
  if (ids.length === 0) return
  const supabase = getSupabase()
  await supabase.storage
    .from(PROJECT_FILES_BUCKET)
    .remove(ids.map(deliverablePath))
}

export function newDeliverableId(): string {
  return crypto.randomUUID()
}
