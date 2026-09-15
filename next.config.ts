import type { NextConfig } from "next"

/**
 * Content Security Policy.
 *
 * 'unsafe-inline' is unavoidable for scripts here: Next.js inlines its
 * hydration bootstrap, and a nonce-based policy would force every static page
 * to render dynamically — the opposite of what this site wants. The value is
 * still real: script-src 'self' means an injected <script src="evil.com"> is
 * refused, which is how an XSS actually loads a payload. Styles need it too,
 * for Tailwind's arbitrary values and styled-jsx.
 */
/**
 * Next's dev server hydrates through React Fast Refresh, which evaluates code
 * as a string. Without 'unsafe-eval' that throws and nothing on the page
 * becomes interactive — the site renders but no button works.
 *
 * It is added for `next dev` only. Production builds never call eval, so the
 * deployed policy stays strict.
 */
const isDev = process.env.NODE_ENV !== "production"

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self' data:",
  // The contact form posts straight to Web3Forms from the browser.
  // ws: is the dev server's hot-reload socket, and is not in production builds.
  `connect-src 'self' https://api.web3forms.com${isDev ? " ws:" : ""}`,
  "form-action 'self' https://api.web3forms.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Force HTTPS for two years, including subdomains.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
]

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
