/**
 * Canonical origin for absolute URLs (metadataBase, sitemap, robots).
 *
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment. Vercel exposes
 * VERCEL_PROJECT_PRODUCTION_URL automatically, which we fall back to so preview
 * and production builds still emit correct absolute URLs.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, "")

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`

  return "http://localhost:3000"
}

export const SITE_URL = resolveSiteUrl()
export const SITE_NAME = "Rudrova Labs"
