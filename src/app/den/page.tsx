import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getKnock } from "@/lib/session"
import { DenGate } from "@/components/den/den-gate"

export const metadata: Metadata = {
  // Even the tab title gives nothing away.
  title: "404 — Page Not Found",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

/**
 * The den. The forest and the stone are drawn in SVG by DenGate — no image
 * assets, so this page costs almost nothing to serve.
 */
export default async function DenPage() {
  // Without both knocks this route behaves exactly like a URL that was never
  // built: the site's own 404, with a 404 status. Nothing hints otherwise.
  if ((await getKnock()) < 2) notFound()

  return <DenGate />
}
