import { NotFoundView } from "@/components/den/not-found-view"

export const metadata = {
  title: "404 — Page Not Found",
  robots: { index: false, follow: false },
}

/**
 * The site's 404, shown for every unknown URL — and for /king and /den when the
 * visitor has not earned access.
 *
 * Completely inert: no tap target, no client component, nothing to find in the
 * source. The hidden entrance lives on its own route and only appears to
 * someone who has already knocked.
 */
export default function NotFound() {
  return <NotFoundView />
}
