import { NextResponse, type NextRequest } from "next/server"
import { verifyToken } from "@/lib/tokens"
import { ADMIN_COOKIE, CLIENT_COOKIE, KNOCK_COOKIE } from "@/lib/session"

/**
 * First line of defence for the private areas.
 *
 * Runs before the page does, so an unauthorised visitor never reaches a server
 * component — no database call, no render. It answers with the site's own 404
 * rather than a redirect, because a redirect confirms that the route exists.
 *
 * Runs on the Edge runtime, which is why token verification uses Web Crypto.
 * The matcher is deliberately narrow: middleware invocations are metered, and
 * every public page should skip this entirely.
 */

/** Render the app's not-found page, with a real 404 status. */
function notFound(request: NextRequest) {
  const url = request.nextUrl.clone()
  // A path that cannot exist, so Next resolves it to the not-found page.
  url.pathname = "/_404"
  const response = NextResponse.rewrite(url, { status: 404 })
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  response.headers.set("Cache-Control", "no-store, max-age=0")
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/king")) {
    const payload = await verifyToken<{ role: string }>(
      request.cookies.get(ADMIN_COOKIE)?.value
    )
    if (payload?.role !== "admin") return notFound(request)
  }

  // Stage 2 of the hidden entrance: only reachable after the taps on the 404.
  if (pathname.startsWith("/den")) {
    const knock = await verifyToken<{ scope: string; stage: number }>(
      request.cookies.get(KNOCK_COOKIE)?.value
    )
    if (knock?.scope !== "knock" || knock.stage < 2) return notFound(request)
  }

  // Stage 1: only reachable after the taps on the footer year. Checked here as
  // well as in the page so the route is rejected before it renders at all.
  if (pathname.startsWith("/resources")) {
    const knock = await verifyToken<{ scope: string; stage: number }>(
      request.cookies.get(KNOCK_COOKIE)?.value
    )
    if (knock?.scope !== "knock" || knock.stage < 1) return notFound(request)
  }

  if (pathname.startsWith("/portal/")) {
    // The portal is public-facing: clients are told to go there, so this one
    // sends them to the sign-in page rather than pretending it is missing.
    const payload = await verifyToken<{ role: string; sub: string }>(
      request.cookies.get(CLIENT_COOKIE)?.value
    )
    if (payload?.role !== "client") {
      return NextResponse.redirect(new URL("/portal", request.url))
    }
  }

  const response = NextResponse.next()
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  response.headers.set("Cache-Control", "no-store, max-age=0")
  return response
}

export const config = {
  matcher: [
    "/king/:path*",
    "/king",
    "/portal/:path*",
    "/portal",
    "/den/:path*",
    "/den",
    "/resources/:path*",
  ],
}
