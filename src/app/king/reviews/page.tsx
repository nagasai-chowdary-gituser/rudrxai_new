import { listAllReviews } from "@/lib/data"
import { isSupabaseConfigured } from "@/lib/supabase"
import { ReviewCard } from "@/components/admin/review-moderation"

export default async function AdminReviewsPage() {
  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-muted-foreground">Supabase is not connected.</p>
  }

  const reviews = await listAllReviews()
  const pending = reviews.filter((review) => review.status === "pending")
  const rest = reviews.filter((review) => review.status !== "pending")

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Nothing appears on the public Reviews page until you publish it here.
        </p>
      </div>

      {pending.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-600">
            Awaiting your approval ({pending.length})
          </h2>
          {pending.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {pending.length > 0 ? "Reviewed" : "All reviews"}
        </h2>

        {rest.length === 0 && pending.length === 0 && (
          <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border p-8 text-center">
            No reviews submitted yet. Unlock the review form for a client from their page.
          </p>
        )}

        {rest.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </section>
    </div>
  )
}
