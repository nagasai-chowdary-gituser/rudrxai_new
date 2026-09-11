import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Fixed-price engagement models with no hourly billing and no hidden costs. Websites, AI chatbots, dashboards, voice agents and custom platforms.",
  alternates: { canonical: "/pricing" },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
