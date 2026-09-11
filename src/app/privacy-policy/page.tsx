import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { FadeIn } from "@/components/effects/fade-in"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy of Rudrova Labs to understand how we collect, use, and protect your data.",
}

export default function PrivacyPolicyPage() {
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
                  Privacy Policy
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.2} className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-6 leading-relaxed">
                <p><strong>Last Updated: July 17, 2026</strong></p>
                
                <p>
                  At Rudrova Labs, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
                </p>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">1. Information We Collect</h2>
                <p>
                  We collect information that you voluntarily provide to us when you fill out contact forms, book discovery calls, subscribe to our newsletter, or communicate with us directly. This information may include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal details: Name, email address, phone number, job title, and company name.</li>
                  <li>Project details: The details of your software/AI requirements, timeline, budget, and technologies.</li>
                  <li>Log data: IP address, browser type, referring pages, and access times when visiting our website.</li>
                </ul>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
                <p>
                  We use the information we collect for various purposes, including to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, operate, and maintain our website and services.</li>
                  <li>Understand and analyze how you use our website to improve user experience.</li>
                  <li>Respond to your inquiries, schedule discovery sessions, and deliver requested services.</li>
                  <li>Communicate with you regarding updates, promotional materials, and marketing offers (with your consent).</li>
                  <li>Detect, prevent, and address technical issues or security threats.</li>
                </ul>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">3. Sharing Your Information</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties. We may share information with trusted third-party service providers (such as Web3Forms, host providers, and database services) who assist us in operating our website and conducting our business, as long as they agree to keep this information confidential.
                </p>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">4. Security of Your Data</h2>
                <p>
                  We implement industry-standard security measures to maintain the safety of your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">5. Your Privacy Rights</h2>
                <p>
                  Depending on your location, you may have rights under GDPR, CCPA, or other privacy regulations, such as:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The right to access and receive a copy of your personal data.</li>
                  <li>The right to request the rectification or deletion of your personal data.</li>
                  <li>The right to withdraw your consent at any time for marketing communication.</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at our email address.
                </p>

                <h2 className="text-xl font-semibold font-heading text-foreground mt-8 mb-4">6. Contact Us</h2>
                <p>
                  If you have any questions or concerns about this Privacy Policy, please reach out to us through our contact page or email.
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
