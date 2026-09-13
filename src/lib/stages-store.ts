import "server-only"

import { PROJECT_FILES_BUCKET, getSupabase } from "./supabase"
import { MAX_STAGES, MAX_STAGE_LABEL } from "./stages"

/**
 * Project progress stages, stored as one small JSON file per project in the
 * private bucket rather than in a table.
 *
 * That keeps the feature free of any schema migration — no SQL to run — at the
 * cost of one storage read per project page. For a handful of stages that is
 * imperceptible, and the file inherits the bucket's privacy: it is only ever
 * read server-side with the service role, never exposed to a browser.
 */

export type ProjectStage = {
  id: string
  label: string
  completed: boolean
  completed_at: string | null
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

function stagePath(projectId: string): string {
  return `stages/${projectId}.json`
}

/** Accept only what we wrote, so a corrupt or hand-edited file cannot break a page. */
function parseStages(raw: unknown): ProjectStage[] {
  if (!Array.isArray(raw)) return []

  return raw
    .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === "object")
    .map((entry, index) => ({
      id: typeof entry.id === "string" && entry.id ? entry.id : `s${index}`,
      label: typeof entry.label === "string" ? entry.label.slice(0, MAX_STAGE_LABEL) : "",
      completed: Boolean(entry.completed),
      completed_at:
        typeof entry.completed_at === "string" ? entry.completed_at : null,
    }))
    .filter((stage) => stage.label.length > 0)
    .slice(0, MAX_STAGES)
}

/**
 * Returns null when a project has never had its stages saved, so callers can
 * tell that apart from an admin who deliberately cleared the list.
 */
export async function readStages(projectId: string): Promise<ProjectStage[] | null> {
  if (!isUuid(projectId)) return null
  const supabase = getSupabase()

  const { data, error } = await supabase.storage
    .from(PROJECT_FILES_BUCKET)
    .download(stagePath(projectId))

  // A project that has never been saved simply has no file yet.
  if (error || !data) return null

  try {
    return parseStages(JSON.parse(await data.text()))
  } catch {
    console.error("Stage file for", projectId, "is not valid JSON")
    return null
  }
}

/** Stages for several projects at once, keyed by project id. */
export async function readStagesForProjects(
  projectIds: string[]
): Promise<Record<string, ProjectStage[] | null>> {
  const entries = await Promise.all(
    projectIds.map(async (id) => [id, await readStages(id)] as const)
  )

  const grouped: Record<string, ProjectStage[] | null> = {}
  for (const [id, stages] of entries) grouped[id] = stages
  return grouped
}

/** The default flow, as unsaved stages — what a project shows before setup. */
export function defaultStages(labels: readonly string[]): ProjectStage[] {
  return labels.map((label, index) => ({
    id: `default-${index}`,
    label,
    completed: false,
    completed_at: null,
  }))
}

export async function writeStages(
  projectId: string,
  stages: ProjectStage[]
): Promise<{ error?: string }> {
  if (!isUuid(projectId)) return { error: "Invalid project." }
  const supabase = getSupabase()

  const body = new Blob([JSON.stringify(stages)], { type: "application/json" })

  const { error } = await supabase.storage
    .from(PROJECT_FILES_BUCKET)
    .upload(stagePath(projectId), body, {
      upsert: true,
      contentType: "application/json",
    })

  if (error) {
    console.error("Failed to write stages:", error.message)
    return { error: `Could not save progress: ${error.message}` }
  }

  return {}
}

/** Remove a project's stage file. Storage is not cascaded for us. */
export async function deleteStages(projectIds: string[]): Promise<void> {
  const ids = projectIds.filter(isUuid)
  if (ids.length === 0) return
  const supabase = getSupabase()
  await supabase.storage.from(PROJECT_FILES_BUCKET).remove(ids.map(stagePath))
}

/** A fresh id for a stage the admin has just added. */
export function newStageId(): string {
  return crypto.randomUUID()
}
