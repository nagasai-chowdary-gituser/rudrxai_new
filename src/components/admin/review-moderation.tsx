"use client"

import { useActionState } from "react"
import { setReviewStatus, type ActionState } from "@/app/king/actions"
import { FormMessage, SubmitButton } from "./form"
import { Star } from "lucide-react"

const initial: ActionState = {}

export function ReviewCard({
  review,
}: {
  review: {
    id: string
    rating: number
    body: string
    status: string
    submitted_at: string
    display_name: string
    company: string | null
  }
}) {
  const [state, action] = useActionState(setReviewStatus, initial)

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    published: "bg-success/10 text-success border-success/20",
    hidden: "bg-muted text-muted-foreground border-border",
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <p className="font-semibold text-foreground">{review.display_name}</p>
          {review.company && (
            <p className="text-xs text-muted-foreground">{review.company}</p>
          )}
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[review.status]}`}
        >
          {review.status}
        </span>
      </div>

      <div className="flex items-center gap-0.5 mb-3" aria-label={`${review.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < review.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-4">
        {review.body}
      </p>

      <p className="text-xs text-muted-foreground mb-4">
        Submitted {new Date(review.submitted_at).toLocaleDateString()}
      </p>

      <FormMessage state={state} />

      <div className="flex flex-wrap gap-2 mt-3">
        {review.status !== "published" && (
          <form action={action}>
            <input type="hidden" name="review_id" value={review.id} />
            <input type="hidden" name="status" value="published" />
            <SubmitButton>Publish</SubmitButton>
          </form>
        )}
        {review.status !== "hidden" && (
          <form action={action}>
            <input type="hidden" name="review_id" value={review.id} />
            <input type="hidden" name="status" value="hidden" />
            <SubmitButton variant="outline">Hide</SubmitButton>
          </form>
        )}
      </div>
    </div>
  )
}
