import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your project and get a free, fixed-price quote. We reply to every enquiry within 24 hours.",
  alternates: { canonical: "/contact" },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
