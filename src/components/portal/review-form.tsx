"use client"

import { useActionState, useId, useState } from "react"
import { useFormStatus } from "react-dom"
import { submitReview, type PortalState } from "@/app/portal/actions"
import { Star, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

const initial: PortalState = {}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? "Sending..." : "Submit review"}
    </button>
  )
}

export function ReviewForm() {
  const [state, action] = useActionState(submitReview, initial)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [body, setBody] = useState("")
  const id = useId()

  if (state.success) {
    return (
      <div className="rounded-2xl border border-success/20 bg-success/5 p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-4" />
        <p className="text-foreground font-medium">{state.success}</p>
      </div>
    )
  }

  const shown = hovered || rating

  return (
    <form action={action} className="space-y-6 rounded-2xl border border-border bg-card p-6">
      {state.error && (
        <p className="text-sm rounded-lg px-3 py-2 bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </p>
      )}

      <input type="hidden" name="rating" value={rating} />

      <div>
        <span className="block text-sm font-medium text-foreground mb-2">
          How was it working with us?
        </span>
        <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              aria-pressed={rating === value}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  value <= shown
                    ? "text-amber-400 fill-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor={`${id}-body`}
          className="block text-sm font-medium text-foreground mb-2"
        >
          Your review
        </label>
        <textarea
          id={`${id}-body`}
          name="body"
          rows={6}
          maxLength={2000}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="What did we build for you, and how did the process go?"
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {body.length < 20
            ? `At least ${20 - body.length} more characters`
            : `${body.length} / 2000`}
        </p>
      </div>

      <SubmitButton disabled={rating === 0 || body.trim().length < 20} />

      <p className="text-xs text-muted-foreground text-center">
        You can only submit once, so take your time.
      </p>
    </form>
  )
}
