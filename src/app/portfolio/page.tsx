import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/effects/fade-in"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore our work — business websites, AI chatbots, dashboards, voice agents, and custom platforms delivered by Rudrova Labs.",
}

const projects = [
  {
    category: "Real Estate / Website",
    title: "PropertyNest — Real Estate Portal",
    desc: "Full-featured property listing platform with advanced search filters, virtual tour integration, agent dashboard, and lead management system for a real estate agency.",
    metric: "3x more leads generated",
    tech: ["Next.js", "PostgreSQL", "Maps API", "CRM", "Responsive"],
    color: "from-amber-600 to-orange-600",
  },
  {
    category: "Healthcare / Platform",
    title: "MedConnect — Clinic Management",
    desc: "Patient booking system with telemedicine, appointment scheduling, medical records digitization, and automated SMS/WhatsApp reminders for a chain of clinics.",
    metric: "40% reduction in no-shows",
    tech: ["React", "Node.js", "Twilio", "PostgreSQL", "HIPAA"],
    color: "from-red-600 to-pink-600",
  },
  {
    category: "E-Commerce / Retail",
    title: "ShopSmart — Multi-Vendor Marketplace",
    desc: "Complete e-commerce platform with vendor onboarding, payment gateway integration, inventory management, AI product recommendations, and delivery tracking.",
    metric: "₹15L+ monthly revenue",
    tech: ["Next.js", "Stripe", "Redis", "AI Recommendations", "AWS"],
    color: "from-blue-600 to-cyan-600",
  },
  {
    category: "AI / Chatbot",
    title: "SalesBot — Lead Generation Chatbot",
    desc: "AI-powered chatbot deployed on a business website and WhatsApp that qualifies leads, books appointments, and answers product queries 24/7 with 95% accuracy.",
    metric: "95% query resolution rate",
    tech: ["OpenAI", "LangChain", "WhatsApp API", "CRM Integration"],
    color: "from-purple-600 to-violet-600",
  },
  {
    category: "Business / Dashboard",
    title: "InsightIQ — Business Analytics Dashboard",
    desc: "Real-time analytics dashboard for a logistics company tracking fleet performance, delivery metrics, fuel costs, and driver efficiency with predictive maintenance alerts.",
    metric: "25% operational cost reduction",
    tech: ["React", "D3.js", "Python", "Real-time DB", "Charts"],
    color: "from-emerald-600 to-teal-600",
  },
  {
    category: "EdTech / LMS",
    title: "LearnHub — Online Learning Platform",
    desc: "Full LMS with course builder, video hosting, quiz engine, student progress tracking, certificate generation, and payment gateway for a coaching institute.",
    metric: "5,000+ students onboarded",
    tech: ["Next.js", "Video Streaming", "Razorpay", "PostgreSQL"],
    color: "from-indigo-600 to-purple-600",
  },
  {
    category: "Voice AI / Customer Support",
    title: "CallFlow — AI Voice Agent",
    desc: "AI-powered voice agent handling inbound customer support calls for an insurance company — appointment booking, claim status, policy info — reducing call center load by 60%.",
    metric: "60% call center load reduced",
    tech: ["Voice AI", "Twilio", "NLP", "FastAPI", "Telephony"],
    color: "from-pink-600 to-rose-600",
  },
  {
    category: "Restaurant / Ordering",
    title: "FoodBase — Restaurant Ordering System",
    desc: "Online ordering platform with menu management, table reservations, kitchen display system, delivery tracking, and integrated POS for a restaurant chain.",
    metric: "2x online orders increase",
    tech: ["React", "Node.js", "Socket.io", "Razorpay", "Real-time"],
    color: "from-cyan-600 to-blue-600",
  },
]

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <Section className="relative border-b border-border/40 py-12 md:py-16">
          <Container>
            <div className="max-w-4xl">
              <FadeIn delay={0.1}>
                <span className="font-mono text-xs uppercase tracking-wider text-primary border border-primary/20 px-3 py-1 rounded-full bg-primary/5">
                  Our Work
                </span>
              </FadeIn>
              <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 tracking-tight text-foreground leading-[1.1] mt-4">
                Work That <span className="gradient-text">Speaks for Itself</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Real projects. Real businesses. Here&apos;s a selection of work we&apos;ve delivered — on time and on budget.
              </p>
            </div>
          </Container>
        </Section>

        <Section className="bg-muted/30 py-12 md:py-16">
          <Container>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, i) => (
                <StaggerItem
                  key={i}
                  className="group rounded-2xl bg-surface border border-border overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`p-6 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-background/25 dark:bg-background/40 backdrop-blur-[2px]" />
                      <div className="relative z-10">
                        <span className="text-xs font-mono font-semibold text-foreground/80 dark:text-white/80 uppercase tracking-wider">
                          {project.category}
                        </span>
                        <h3 className="font-heading font-bold text-xl text-foreground dark:text-white mt-2">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                        {project.desc}
                      </p>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-4">
                        <TrendingUp className="w-4 h-4" />
                        <span>{project.metric}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground"
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
                  Ready to build something extraordinary?
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
                  Let&apos;s turn your vision into a product that users love and competitors envy.
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="gap-2">
                      Start Your Project <ArrowUpRight className="w-4 h-4" />
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
