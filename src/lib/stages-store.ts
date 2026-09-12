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

export async function readStages(projectId: string): Promise<ProjectStage[]> {
  const supabase = getSupabase()

  const { data, error } = await supabase.storage
    .from(PROJECT_FILES_BUCKET)
    .download(stagePath(projectId))

  // A project that has never been saved simply has no file yet.
  if (error || !data) return []

  try {
    return parseStages(JSON.parse(await data.text()))
  } catch {
    console.error("Stage file for", projectId, "is not valid JSON")
    return []
  }
}

/** Stages for several projects at once, keyed by project id. */
export async function readStagesForProjects(
  projectIds: string[]
): Promise<Record<string, ProjectStage[]>> {
  const entries = await Promise.all(
    projectIds.map(async (id) => [id, await readStages(id)] as const)
  )

  const grouped: Record<string, ProjectStage[]> = {}
  for (const [id, stages] of entries) {
    if (stages.length > 0) grouped[id] = stages
  }
  return grouped
}

export async function writeStages(
  projectId: string,
  stages: ProjectStage[]
): Promise<{ error?: string }> {
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
  if (projectIds.length === 0) return
  const supabase = getSupabase()
  await supabase.storage.from(PROJECT_FILES_BUCKET).remove(projectIds.map(stagePath))
}

/** A fresh id for a stage the admin has just added. */
export function newStageId(): string {
  return crypto.randomUUID()
}
