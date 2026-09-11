import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Discovery Session",
  description:
    "Book a complimentary discovery session. Share your context and our consultants prepare a tailored architecture and strategy overview before the call.",
  alternates: { canonical: "/discovery" },
}

export default function DiscoveryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
