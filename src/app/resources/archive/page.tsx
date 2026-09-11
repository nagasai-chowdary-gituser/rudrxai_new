import { notFound } from "next/navigation"
import { getKnock } from "@/lib/session"
import { NotFoundView } from "@/components/den/not-found-view"
import { AgainWord } from "@/components/den/secret-taps"

export const metadata = {
  title: "404 — Page Not Found",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

/**
 * Visually identical to the site's 404 — but here the word "again" is the
 * second stage of the hidden entrance.
 *
 * Without the first knock this renders the plain 404 instead, so the tap target
 * never exists in the HTML for anyone who has not already knocked.
 */
export default async function ResourcesArchivePage() {
  if ((await getKnock()) < 1) notFound()

  return <NotFoundView again={<AgainWord>again</AgainWord>} />
}
