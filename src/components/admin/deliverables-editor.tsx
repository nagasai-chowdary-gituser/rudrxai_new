"use client"

import { useActionState, useState } from "react"
import { saveDeliverables, type ActionState } from "@/app/king/actions"
import { FormMessage, SubmitButton } from "./form"
import { MAX_DELIVERABLES, MAX_DELIVERABLE_TEXT } from "@/lib/deliverables"
import type { Deliverable } from "@/lib/deliverables-store"
import { ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react"

const initial: ActionState = {}

type Draft = { id?: string; text: string }

/**
 * Edits the deliverables the client sees.
 *
 * The list is held here while you work and submitted whole, so one save writes
 * it all. Numbers are just positions, so reordering renumbers automatically.
 */
export function DeliverablesEditor({
  projectId,
  items,
}: {
  projectId: string
  items: Deliverable[]
}) {
  const [state, action] = useActionState(saveDeliverables, initial)
  const [draft, setDraft] = useState<Draft[]>(() =>
    items.map((item) => ({ id: item.id, text: item.text }))
  )
  const [newText, setNewText] = useState("")

  const update = (index: number, value: string) =>
    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, text: value } : item)))

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
    const value = newText.trim()
    if (!value || draft.length >= MAX_DELIVERABLES) return
    setDraft((prev) => [...prev, { text: value }])
    setNewText("")
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="deliverables" value={JSON.stringify(draft)} />

      <p className="text-sm font-medium text-foreground">
        Deliverables
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          {draft.length} {draft.length === 1 ? "item" : "items"}
        </span>
      </p>

      <ul className="space-y-2">
        {draft.map((item, index) => (
          <li
            key={item.id ?? `new-${index}`}
            className="flex items-center gap-2 rounded-lg border border-border bg-background p-2"
          >
            <span className="shrink-0 w-6 h-6 rounded-md bg-primary/10 text-primary grid place-items-center text-xs font-bold tabular-nums">
              {index + 1}
            </span>

            <input
              value={item.text}
              maxLength={MAX_DELIVERABLE_TEXT}
              onChange={(event) => update(index, event.target.value)}
              aria-label={`Deliverable ${index + 1}`}
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
                aria-label={`Remove deliverable ${index + 1}`}
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
          None yet. The client sees no deliverables section until you add one.
        </p>
      )}

      <div className="flex gap-2">
        <input
          value={newText}
          maxLength={MAX_DELIVERABLE_TEXT}
          placeholder="Add a deliverable, e.g. 5-page responsive website"
          aria-label="New deliverable"
          onChange={(event) => setNewText(event.target.value)}
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
          disabled={!newText.trim() || draft.length >= MAX_DELIVERABLES}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <FormMessage state={state} />

      <SubmitButton>Save deliverables</SubmitButton>

      <p className="text-xs text-muted-foreground">
        The client sees this as a read-only numbered list.
      </p>
    </form>
  )
}
