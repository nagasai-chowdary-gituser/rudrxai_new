"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { FadeIn } from "@/components/effects/fade-in"
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react"

const services = [
  "Business Website",
  "AI Chatbot",
  "AI Dashboard",
  "Voice AI Agent",
  "E-Commerce Platform",
  "Healthcare Solution",
  "Real Estate Platform",
  "EdTech / LMS",
  "Custom Platform",
  "Other",
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Submit directly to Web3Forms from the browser
      // (Server-side requests get blocked by Cloudflare)
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
          name: formData.name,
          email: formData.email,
          company: formData.company || "N/A",
          phone: formData.phone || "N/A",
          service: formData.service || "N/A",
          message: formData.message,
          subject: `New Contact from ${formData.name} — RudrxAI`,
          from_name: "RudrxAI Contact Form",
        }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message || "Something went wrong")
      }

      setSuccess(true)
      setFormData({ name: "", email: "", company: "", phone: "", service: "", message: "" })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background min-h-screen">
        
        {/* Hero */}
        <section className="pt-36 pb-12 relative overflow-hidden border-b border-border">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <Container>
            <FadeIn>
              <div className="max-w-3xl">
                <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-3 block">Contact</span>
                <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-4 text-foreground leading-[1.1]">
                  Let&apos;s Build <span className="text-primary">Together.</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Ready to start your project? Fill out the form and our team will respond within 24 hours.
                </p>
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* Form + Info */}
        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Contact Form */}
              <div className="lg:col-span-7">
                <FadeIn>
                  {success ? (
                    <div className="text-center py-16 px-8 rounded-2xl border border-primary/20 bg-primary/5">
                      <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
                      <h2 className="text-3xl font-bold font-heading mb-4 text-foreground">Message Sent!</h2>
                      <p className="text-muted-foreground text-lg mb-8">
                        Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
                      </p>
                      <button
                        onClick={() => setSuccess(false)}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {error && (
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                          {error}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="Your Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="you@company.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="Your Company"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="+91 00000 00000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Service Interest</label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        >
                          <option value="">Select a service...</option>
                          {services.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                        <textarea
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                          placeholder="Tell us about your project..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-4 font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5" /> Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </FadeIn>
              </div>

              {/* Contact Info Sidebar */}
              <div className="lg:col-span-5">
                <FadeIn delay={0.2}>
                  <div className="space-y-6 lg:sticky lg:top-32">
                    <div>
                      <h3 className="text-xl font-bold font-heading text-foreground mb-5">Get in Touch</h3>
                      <div className="space-y-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground mb-1">Email</div>
                            <a href="mailto:rudrovalabs@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">rudrovalabs@gmail.com</a>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground mb-1">Phone</div>
                            <a href="tel:+917989317347" className="text-muted-foreground hover:text-primary transition-colors">+91 7989317347</a>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground mb-1">Office</div>
                            <p className="text-muted-foreground">Remote — Global</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-border bg-card">
                      <h4 className="font-bold text-foreground mb-2">Response Time</h4>
                      <p className="text-sm text-muted-foreground">
                        We typically respond to all inquiries within <strong className="text-foreground">24 hours</strong>. Urgent requests are prioritized.
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </div>

            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  )
}
