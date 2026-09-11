import Link from "next/link"

/**
 * The site's 404 screen.
 *
 * Shared so that the plain version and the one carrying the hidden tap target
 * are byte-for-byte identical to look at. `again` is ordinary text unless a
 * caller passes the interactive version.
 */
export function NotFoundView({ again }: { again?: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-[7rem] md:text-[10rem] font-bold font-heading leading-none tracking-tighter text-foreground/90">
          404
        </p>

        <p className="text-lg text-muted-foreground mt-2 mb-10">
          Page not found. Please try {again ?? "again"} later.
        </p>

        <Link
          href="/"
          className="inline-flex items-center h-11 px-6 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
