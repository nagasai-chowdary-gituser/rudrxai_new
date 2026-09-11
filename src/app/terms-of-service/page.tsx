import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { FadeIn } from "@/components/effects/fade-in"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service of Rudrova Labs to understand the terms governing your use of our website and services.",
}

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <Section>
          <Container>
            <div className="max-w-3xl mx-auto">
              <FadeIn delay={0.1}>
                <span className="font-mono text-xs uppercase tracking-wider text-primary border border-primary/20 px-3 py-1 rounded-full bg-primary/5">
                  Legal
                </span>
                <h1 className="text-4xl md:text-5xl font-bold font-heading mt-6 mb-8 text-foreground tracking-tight">
                  Terms of Service
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.2} className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-6 leading-relaxed">
                <p><strong>Last Updated: July 17, 2026</strong></p>
                
                <p>
                  Welcome to Rudrova Labs. By accessing or using our website, services, or tools, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.
                </p>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
                <p>
                  By visiting our website or purchasing our services, you engage in our &quot;Service&quot; and agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions in this document, you are not authorized to access the site or use any of our services.
                </p>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">2. Intellectual Property</h2>
                <p>
                  All content, branding, design, graphics, custom code, copy, and trademarks on this site are the intellectual property of Rudrova Labs or its licensors. You may not reproduce, distribute, modify, or transmit any part of our website or materials without our explicit written permission.
                </p>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">3. Custom Software Delivery</h2>
                <p>
                  For clients entering into custom software development or AI integration contracts:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Project scope, payments, and delivery timelines are governed by individual Statement of Work (SOW) documents signed by both parties.</li>
                  <li>Intellectual property ownership of delivered code is transferred to the client upon full payment of the agreed contract fees, unless otherwise specified in writing.</li>
                  <li>We aim to deliver error-free software, but all delivered software is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis unless explicitly warranted in the SOW.</li>
                </ul>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">4. Prohibited Uses</h2>
                <p>
                  You are prohibited from using our site or services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>For any unlawful purpose or to solicit others to perform illegal acts.</li>
                  <li>To violate any international, federal, state, or local laws or regulations.</li>
                  <li>To transmit any malware, viruses, or destructive code.</li>
                  <li>To interfere with or circumvent the security features of our website or backend servers.</li>
                </ul>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">5. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, Rudrova Labs, its directors, employees, or contractors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, or goodwill, arising from your use of our website or services.
                </p>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">6. Changes to Terms</h2>
                <p>
                  We reserve the right to update, change, or replace any part of these Terms of Service at any time by posting updates on our website. It is your responsibility to check this page periodically for changes.
                </p>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">7. Contact Information</h2>
                <p>
                  Questions about the Terms of Service should be sent to us via our contact page.
                </p>
              </FadeIn>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
