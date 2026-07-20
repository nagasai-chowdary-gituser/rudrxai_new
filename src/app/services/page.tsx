import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/effects/fade-in"
import { Globe, MessageSquare, Mic, BarChart3, Building2, GraduationCap, HeartPulse, Home, ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Services | Rudrova Labs",
  description: "We build websites, AI chatbots, dashboards, voice agents, and custom platforms for businesses across all industries.",
}

const servicesList = [
  {
    icon: Globe,
    title: "Business Websites",
    desc: "Professional, SEO-optimized, responsive websites for businesses of all sizes. Corporate sites, landing pages, portfolios, and multi-page platforms built to convert visitors into customers.",
    tags: ["Next.js", "React", "SEO", "Responsive", "Fast Loading"],
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbots",
    desc: "Intelligent customer support chatbots, lead generation bots, and internal automation agents. Integrate with WhatsApp, websites, and CRM systems for 24/7 automated customer engagement.",
    tags: ["OpenAI", "LangChain", "WhatsApp", "Lead Gen", "CRM"],
    color: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-500",
  },
  {
    icon: BarChart3,
    title: "AI Dashboards",
    desc: "Real-time business analytics dashboards with AI-powered insights. Track sales, inventory, customer behavior, and operations with beautiful, interactive data visualizations.",
    tags: ["React", "Charts", "Real-time", "Analytics", "Reports"],
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: Mic,
    title: "Voice AI Agents",
    desc: "AI-powered voice agents for customer support calls, appointment booking, order tracking, and automated phone systems. Reduce call center costs by 70% with intelligent voice automation.",
    tags: ["Voice AI", "Telephony", "NLP", "Auto-Booking", "IVR"],
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-500",
  },
  {
    icon: Building2,
    title: "Real Estate Solutions",
    desc: "Property listing websites, virtual tour platforms, CRM systems for brokers, and AI-powered property valuation tools. Complete digital solutions for real estate businesses.",
    tags: ["Property Listings", "CRM", "Virtual Tours", "Valuation AI"],
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
  },
  {
    icon: HeartPulse,
    title: "Healthcare Platforms",
    desc: "Patient management systems, telemedicine portals, appointment booking, medical record digitization, and health analytics dashboards for clinics, hospitals, and health startups.",
    tags: ["Patient Portal", "Telemedicine", "EHR", "Booking", "HIPAA"],
    color: "from-red-500/20 to-pink-500/20",
    iconColor: "text-red-500",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce & Retail",
    desc: "Full-stack e-commerce platforms with payment integration, inventory management, AI-powered product recommendations, and multi-vendor marketplace solutions.",
    tags: ["Payments", "Inventory", "AI Recommendations", "Multi-vendor"],
    color: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-500",
  },
  {
    icon: GraduationCap,
    title: "EdTech & LMS",
    desc: "Learning management systems, online course platforms, student portals, quiz engines, and AI-powered tutoring systems for schools, coaching centers, and ed-tech startups.",
    tags: ["LMS", "Course Builder", "Quiz Engine", "Student Portal"],
    color: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-500",
  },
  {
    icon: Home,
    title: "Custom Business Platforms",
    desc: "Tailored software solutions for any industry — restaurant ordering systems, logistics trackers, appointment schedulers, inventory tools, and internal automation platforms.",
    tags: ["Custom Dev", "API", "Automation", "SaaS", "Internal Tools"],
    color: "from-teal-500/20 to-emerald-500/20",
    iconColor: "text-teal-500",
  },
]

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <Section className="relative border-b border-border/40 py-12 md:py-16">
          <Container>
            <div className="max-w-4xl">
              <FadeIn delay={0.1}>
                <span className="font-mono text-xs uppercase tracking-wider text-primary border border-primary/20 px-3 py-1 rounded-full bg-primary/5">
                  Our Services
                </span>
              </FadeIn>
              <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 tracking-tight text-foreground leading-[1.1] mt-4">
                Real Services. <span className="gradient-text">Real Results.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We build production-ready digital solutions for businesses across every industry. From websites to AI agents — we deliver what works.
              </p>
            </div>
          </Container>
        </Section>

        <Section className="bg-muted/30 py-12 md:py-16">
          <Container>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesList.map((service, i) => (
                <StaggerItem
                  key={i}
                  className="group rounded-2xl bg-surface border border-border overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between h-full"
                >
                  <div className="p-6 flex-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                      <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {service.desc}
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted border border-border/80 text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </Section>

        <Section className="border-t border-border/40 relative overflow-hidden bg-background py-12 md:py-16">
          <Container>
            <div className="p-8 md:p-12 rounded-3xl bg-muted/40 border border-border text-center max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">
                  Ready to start a project?
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
                  Let&apos;s discuss how we can build the perfect digital solution for your business.
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="gap-2">
                      Get In Touch <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
