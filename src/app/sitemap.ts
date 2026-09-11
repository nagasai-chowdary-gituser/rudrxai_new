import type { MetadataRoute } from "next"
import { products } from "@/data/products"
import { industries } from "@/data/industries"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/products", priority: 0.9 },
    { path: "/industries", priority: 0.9 },
    { path: "/reviews", priority: 0.8 },
    { path: "/portfolio", priority: 0.8 },
    { path: "/pricing", priority: 0.9 },
    { path: "/contact", priority: 0.9 },
    { path: "/discovery", priority: 0.8 },
    { path: "/privacy-policy", priority: 0.3 },
    { path: "/terms-of-service", priority: 0.3 },
  ].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }))

  const productRoutes = products.map((product) => ({
    url: `${SITE_URL}/products/${product.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const industryRoutes = industries.map((industry) => ({
    url: `${SITE_URL}/industries/${industry.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes, ...industryRoutes]
}
