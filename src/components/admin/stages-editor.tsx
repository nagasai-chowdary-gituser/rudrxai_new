"use client"

import { useActionState, useState } from "react"
import { saveStages, type ActionState } from "@/app/king/actions"
import { FormMessage, SubmitButton } from "./form"
import { DEFAULT_STAGES, MAX_STAGES, MAX_STAGE_LABEL } from "@/lib/stages"
import type { ProjectStage } from "@/lib/stages-store"
import { Check, ChevronUp, ChevronDown, Plus, Trash2, GripVertical } from "lucide-react"

const initial: ActionState = {}

type Draft = { id?: string; label: string; completed: boolean }

/**
 * Edits the stage list a client sees on their project.
 *
 * The list is held here while you work — tick, rename, reorder, add, remove —
 * and submitted whole, so one save writes the entire flow.
 */
export function StagesEditor({
  projectId,
  stages,
}: {
  projectId: string
  stages: ProjectStage[]
}) {
  const [state, action] = useActionState(saveStages, initial)
  // A project created before this feature existed has no stages. Offer the
  // default flow as an unsaved draft so one click sets it up.
  const untouched = stages.length === 0
  const [draft, setDraft] = useState<Draft[]>(() =>
    untouched
      ? DEFAULT_STAGES.map((label) => ({ label, completed: false }))
      : stages.map((stage) => ({
          id: stage.id,
          label: stage.label,
          completed: stage.completed,
        }))
  )
  const [newLabel, setNewLabel] = useState("")

  const update = (index: number, patch: Partial<Draft>) =>
    setDraft((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))

  const move = (index: number, delta: number) =>
    setDraft((prev) => {
      const next = [...prev]
      const target = index + delta
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })

  const remove = (index: number) =>
    setDraft((prev) => prev.filter((_, i) => i !== index))

  const add = () => {
    const label = newLabel.trim()
    if (!label || draft.length >= MAX_STAGES) return
    setDraft((prev) => [...prev, { label, completed: false }])
    setNewLabel("")
  }

  const done = draft.filter((s) => s.completed).length

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="stages" value={JSON.stringify(draft)} />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">
          Progress stages
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {done} of {draft.length} ticked
          </span>
        </p>
      </div>

      {untouched && (
        <p className="text-xs rounded-lg px-3 py-2 bg-primary/5 border border-primary/20 text-muted-foreground">
          This project has no progress yet. Below is the default flow — edit it
          if you like, then save to show it to the client.
        </p>
      )}

      <ul className="space-y-2">
        {draft.map((stage, index) => (
          <li
            key={stage.id ?? `new-${index}`}
            className="flex items-center gap-2 rounded-lg border border-border bg-background p-2"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" aria-hidden="true" />

            {/* Tick */}
            <button
              type="button"
              onClick={() => update(index, { completed: !stage.completed })}
              aria-pressed={stage.completed}
              aria-label={`Mark "${stage.label}" as ${stage.completed ? "not done" : "done"}`}
              className={`w-6 h-6 rounded-md grid place-items-center shrink-0 transition-colors ${
                stage.completed
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-transparent hover:border-primary/50"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
            </button>

            <input
              value={stage.label}
              maxLength={MAX_STAGE_LABEL}
              onChange={(event) => update(index, { label: event.target.value })}
              aria-label={`Stage ${index + 1} label`}
              className="flex-1 min-w-0 bg-transparent text-sm text-foreground focus:outline-none"
            />

            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-25 transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === draft.length - 1}
                aria-label="Move down"
                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-25 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove "${stage.label}"`}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {draft.length === 0 && (
        <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-border p-4 text-center">
          No stages. The client will see no progress section.
        </p>
      )}

      {/* Add */}
      <div className="flex gap-2">
        <input
          value={newLabel}
          maxLength={MAX_STAGE_LABEL}
          placeholder="Add a stage, e.g. Demo 2"
          aria-label="New stage label"
          onChange={(event) => setNewLabel(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              add()
            }
          }}
          className="flex-1 min-w-0 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="button"
          onClick={add}
          disabled={!newLabel.trim() || draft.length >= MAX_STAGES}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <FormMessage state={state} />

      <SubmitButton>Save progress</SubmitButton>

      <p className="text-xs text-muted-foreground">
        The client sees this as a read-only timeline. Ticking a stage records
        today&apos;s date beside it.
      </p>
    </form>
  )
}
