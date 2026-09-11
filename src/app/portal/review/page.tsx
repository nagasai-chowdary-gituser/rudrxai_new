import { redirect } from "next/navigation"
import { Container } from "@/components/layout/container"
import { getClientSession } from "@/lib/session"
import { getClientById, getReviewForClient } from "@/lib/data"
import { ReviewForm } from "@/components/portal/review-form"
import { CheckCircle2, Star, Lock } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PortalReviewPage() {
  const clientId = await getClientSession()
  if (!clientId) redirect("/portal")

  const [client, review] = await Promise.all([
    getClientById(clientId),
    getReviewForClient(clientId),
  ])

  if (!client?.is_active) redirect("/portal")

  return (
    <Container>
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold font-heading text-foreground mb-2">
          Leave a review
        </h1>

        {review ? (
          <div className="rounded-2xl border border-border bg-card p-8 mt-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl text-foreground mb-2">
              Thank you — we have your review
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {review.status === "published"
                ? "It is live on our Reviews page."
                : "It is with our team for approval and will appear on our Reviews page once published."}
            </p>

            <div className="flex items-center justify-center gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < review.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-foreground italic leading-relaxed whitespace-pre-line">
              “{review.body}”
            </p>
          </div>
        ) : client.reviews_enabled ? (
          <>
            <p className="text-muted-foreground text-sm mb-8">
              You can submit one review. It appears on our public Reviews page under your
              name and company once our team approves it.
            </p>
            <ReviewForm />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center mt-8">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              The review form is not open for your account yet. We usually unlock it once
              your project is delivered.
            </p>
          </div>
        )}
      </div>
    </Container>
  )
}
