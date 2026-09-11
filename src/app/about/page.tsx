import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/effects/fade-in"
import { Shield, Rocket, Code, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Rudrova Labs — our mission, values, and the team building affordable digital solutions for businesses worldwide.",
}

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "45+", label: "Happy Clients" },
  { value: "10+", label: "Industries Served" },
  { value: "<2 weeks", label: "Avg. Website Delivery" },
]

const values = [
  {
    icon: Code,
    title: "Quality Code",
    description: "Every project is built with clean architecture, modern frameworks, and production-grade code that scales.",
  },
  {
    icon: Rocket,
    title: "Fast Delivery",
    description: "We ship fast. Most websites are live within 1-2 weeks. Chatbots and dashboards within 3-4 weeks.",
  },
  {
    icon: Clock,
    title: "Affordable Pricing",
    description: "Premium quality at startup-friendly prices. No hourly billing. Fixed prices with no hidden costs.",
  },
  {
    icon: Shield,
    title: "Transparent Process",
    description: "Regular updates, honest timelines, and open communication. We treat your budget like our own.",
  },
]

const timeline = [
  { year: "2023", title: "Founded", desc: "Started with a vision to make quality software affordable for every business." },
  { year: "2024", title: "First 20 Clients", desc: "Delivered 30+ projects across websites, chatbots, and AI solutions." },
  { year: "2025", title: "Product Launch", desc: "Launched proprietary SaaS products and expanded to new industries." },
  { year: "2026", title: "Scaling Global", desc: "Growing the team and expanding globally with clients across 10+ industries." },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <Section className="relative overflow-hidden border-b border-border/40 py-12 md:py-16">
          <Container>
            <div className="max-w-4xl">
              <FadeIn delay={0.1}>
                <span className="font-mono text-xs uppercase tracking-wider text-primary border border-primary/20 px-3 py-1 rounded-full bg-primary/5">
                  About Us
                </span>
              </FadeIn>
              <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 tracking-tight text-foreground leading-[1.1] mt-4">
                We Build Digital Solutions That <span className="gradient-text">Grow Businesses</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Rudrova Labs is a product engineering studio that builds affordable, production-grade websites, AI chatbots, dashboards, and custom platforms for businesses of all sizes.
              </p>
            </div>
          </Container>
        </Section>

        <Section className="bg-muted/30 relative py-12 md:py-16">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionHeading
                  title="Our Mission"
                  subtitle="We believe every business — big or small — deserves access to quality technology. Too many great businesses struggle because of expensive or bad tech."
                  className="mb-6"
                />
                <FadeIn delay={0.4}>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our mission is to be the tech partner that turns your ideas into production-ready digital products — combining modern engineering with business-first thinking, at prices that make sense.
                  </p>
                </FadeIn>
              </div>

              <StaggerContainer className="grid grid-cols-2 gap-5">
                {stats.map((stat, i) => (
                  <StaggerItem key={i} className="p-5 rounded-2xl bg-surface border border-border/80 shadow-sm flex flex-col justify-between">
                    <span className="text-3xl md:text-4xl font-bold text-foreground font-heading tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-sm text-muted-foreground mt-2 font-medium">
                      {stat.label}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </Container>
        </Section>

        <Section className="relative border-b border-border/40 py-12 md:py-16">
          <Container>
            <SectionHeading
              badge="Values"
              title="Why Choose Us"
              subtitle="What makes Rudrova Labs different from every other agency."
              centered
            />

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {values.map((val, i) => (
                <StaggerItem key={i} className="p-6 rounded-2xl bg-surface border border-border flex gap-5 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <val.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                      {val.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {val.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </Section>

        <Section className="bg-muted/30 py-12 md:py-16">
          <Container>
            <SectionHeading
              badge="Journey"
              title="Our Journey"
              subtitle="How we grew from a small team to a full-fledged product studio."
              centered
            />

            <div className="max-w-3xl mx-auto mt-12 relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border/80 -translate-x-1/2 hidden md:block" />
              
              <StaggerContainer className="space-y-10">
                {timeline.map((item, i) => {
                  const isEven = i % 2 === 0
                  return (
                    <StaggerItem key={i} className="flex flex-col md:flex-row items-start md:items-center relative">
                      <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10 top-2 md:top-auto" />
                      
                      <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:order-last"}`}>
                        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
                          <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase">
                            {item.year}
                          </span>
                          <h3 className="font-heading font-bold text-lg text-foreground mt-1 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
