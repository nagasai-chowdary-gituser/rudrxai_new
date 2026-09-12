/**
 * The stages a project moves through, shown to the client as a timeline.
 *
 * These are only the defaults every new project starts with — labels, order
 * and membership are editable per project from the admin panel.
 */
export const DEFAULT_STAGES = [
  "Requirements collected",
  "Advance paid by client",
  "Work started",
  "Demo 1",
  "Final project submitted",
  "Full payment paid by client",
] as const

export const MAX_STAGES = 20
export const MAX_STAGE_LABEL = 80
