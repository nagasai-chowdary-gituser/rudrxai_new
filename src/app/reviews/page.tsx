import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { FadeIn } from "@/components/effects/fade-in"
import { Button } from "@/components/ui/button"
import { listPublishedReviews, type PublishedReview } from "@/lib/data"
import { isSupabaseConfigured } from "@/lib/supabase"
import { Star, Quote, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Client Reviews",
  description:
    "What Rudrova Labs clients say about working with us — verified reviews submitted from their own client portal.",
  alternates: { canonical: "/reviews" },
}

// Rebuilt at most once a minute: reviews change rarely, and this keeps the page
// effectively static on Vercel's free tier.
export const revalidate = 60

function Stars({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`${size} ${
            index < rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/25"
          }`}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: PublishedReview }) {
  return (
    <figure className="h-full flex flex-col rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors">
      <Quote className="w-6 h-6 text-primary/30 mb-4" aria-hidden="true" />

      <blockquote className="flex-1 text-foreground leading-relaxed whitespace-pre-line mb-6">
        {review.body}
      </blockquote>

      <figcaption className="pt-5 border-t border-border">
        <Stars rating={review.rating} />
        <p className="font-semibold text-foreground mt-3">{review.display_name}</p>
        {review.company && (
          <p className="text-sm text-muted-foreground">{review.company}</p>
        )}
      </figcaption>
    </figure>
  )
}

export default async function ReviewsPage() {
  let reviews: PublishedReview[] = []

  // The page must still render if Supabase is unreachable — a marketing page
  // should never hard-fail because a database is down.
  if (isSupabaseConfigured()) {
    try {
      reviews = await listPublishedReviews()
    } catch (error) {
      console.error("Failed to load reviews:", error)
    }
  }

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section className="pt-40 pb-16 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
          <Container>
            <FadeIn>
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full border px-3 py-1 font-semibold text-xs uppercase tracking-wider text-primary border-primary/20 bg-primary/5 mb-6">
                  Client Reviews
                </span>
                <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-6 text-foreground leading-[1.1]">
                  In our clients&apos; words
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Every review here was written by a client from inside their own portal
                  after we delivered their project.
                </p>

                {reviews.length > 0 && (
                  <div className="flex items-center gap-4 mt-8">
                    <span className="text-4xl font-bold font-heading text-foreground">
                      {average.toFixed(1)}
                    </span>
                    <div>
                      <Stars rating={Math.round(average)} size="w-5 h-5" />
                      <p className="text-sm text-muted-foreground mt-1">
                        from {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          </Container>
        </Section>

        <Section className="pb-24 bg-background">
          <Container>
            {reviews.length === 0 ? (
              <FadeIn>
                <div className="rounded-2xl border border-dashed border-border p-16 text-center max-w-2xl mx-auto">
                  <Star className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                  <h2 className="font-heading font-bold text-xl text-foreground mb-2">
                    No reviews published yet
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We&apos;re collecting reviews from clients as projects wrap up. In the
                    meantime, our work speaks for itself.
                  </p>
                  <Button asChild className="mt-6 rounded-full">
                    <Link href="/portfolio">
                      See our work <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review, index) => (
                  <FadeIn key={review.id} delay={Math.min(index, 5) * 0.05}>
                    <ReviewCard review={review} />
                  </FadeIn>
                ))}
              </div>
            )}
          </Container>
        </Section>

        <Section className="py-20 bg-muted/30 dark:bg-[#060612]">
          <Container className="text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
                Ready to be our next review?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Tell us what you need built. Fixed price, guaranteed timeline.
              </p>
              <Button size="lg" asChild className="rounded-full h-14 px-10">
                <Link href="/contact">
                  Start Your Project <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </FadeIn>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
