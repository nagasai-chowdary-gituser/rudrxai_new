import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Deliberately NOT listing /admin or /den: robots.txt is a public file,
        // and naming them there would hand over the exact paths we hide. Both
        // return 404 and carry noindex headers, so they need no entry.
        disallow: ["/api/", "/portal"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
