import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { industries } from "@/data/industries"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { FadeIn } from "@/components/effects/fade-in"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, XCircle, TrendingUp, BarChart3, Building2 } from "lucide-react"
import Link from "next/link"

import { RoiCalculator } from "@/components/solutions/RoiCalculator"
import { ArchitectureDiagram } from "@/components/solutions/ArchitectureDiagram"
import { FinalCTA } from "@/components/home/FinalCTA"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function generateStaticParams() {
  return industries.map((ind) => ({ slug: ind.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const industry = industries.find((i) => i.id === slug)

  if (!industry) return { title: "Industry Not Found" }

  return {
    title: `${industry.title} AI Solutions`,
    description: industry.heroDescription,
    alternates: { canonical: `/industries/${industry.id}` },
    openGraph: {
      title: `${industry.title} AI Solutions | Rudrova Labs`,
      description: industry.heroDescription,
    },
  }
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const industry = industries.find((i) => i.id === resolvedParams.slug)
  
  if (!industry) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        
        {/* 1. HERO */}
        <section className="relative min-h-[70vh] flex items-center pt-32 pb-20 overflow-hidden bg-background">
          <div className="absolute inset-0 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />
          <Container className="relative z-10 text-center max-w-4xl">
            <FadeIn>
              <div className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary mb-6 gap-2">
                <Building2 className="w-4 h-4" /> {industry.title}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-8 text-foreground leading-[1.1]">
                {industry.heroSubtitle}
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                {industry.heroDescription}
              </p>
              <Button size="lg" asChild className="h-14 px-8 text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link href="/contact">Book Transformation Call <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
            </FadeIn>
          </Container>
        </section>

        {/* 2. OVERVIEW & STATISTICS */}
        <Section className="bg-surface border-y border-border">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeIn>
                <h2 className="text-3xl font-heading font-bold mb-6">Industry Transformation</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{industry.overview}</p>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {industry.statistics.map((stat, i) => (
                  <FadeIn key={i} delay={i * 0.1} className="bg-background border border-border p-6 rounded-2xl">
                    <div className="text-4xl font-bold font-heading text-secondary mb-2">{stat.value}</div>
                    <div className="font-semibold text-foreground mb-2">{stat.label}</div>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </FadeIn>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* 3 & 4. CHALLENGES VS OPPORTUNITIES */}
        <Section className="bg-background">
          <Container>
            <SectionHeading badge="The Gap" title="Challenges vs. Opportunities" centered />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
              
              {/* Challenges */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
                  <XCircle className="w-6 h-6 text-destructive" /> Current Reality
                </h3>
                {industry.challenges.map((challenge, i) => (
                  <FadeIn key={i} delay={i * 0.1} className="bg-surface border border-border p-6 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2">{challenge.problem}</h4>
                    <p className="text-muted-foreground text-sm">{challenge.impact}</p>
                  </FadeIn>
                ))}
              </div>

              {/* Opportunities */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-success" /> AI Transformation
                </h3>
                {industry.opportunities.map((opp, i) => (
                  <FadeIn key={i} delay={i * 0.1} className="bg-primary/5 border border-primary/20 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-[20px] rounded-full" />
                    <h4 className="font-semibold text-foreground mb-2">{opp.title}</h4>
                    <p className="text-muted-foreground text-sm mb-4">{opp.description}</p>
                    <div className="inline-flex items-center text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                      <TrendingUp className="w-3 h-3 mr-1" /> {opp.businessImpact}
                    </div>
                  </FadeIn>
                ))}
              </div>

            </div>
          </Container>
        </Section>

        {/* 5. ARCHITECTURE DIAGRAM */}
        <Section className="bg-elevated border-y border-border">
          <Container>
            <SectionHeading badge="Engineering" title="Reference Architecture" subtitle={`A typical high-performance AI integration pattern for ${industry.title}.`} centered />
            <div className="mt-12">
              <ArchitectureDiagram nodes={industry.architecture} />
            </div>
          </Container>
        </Section>

        {/* 6. BUSINESS OUTCOMES & ROI */}
        <Section className="bg-background">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionHeading badge="Impact" title="Measurable Outcomes" className="mb-8" />
                <div className="space-y-8">
                  <p className="text-lg text-muted-foreground mb-8">
                    Implementing Rudrx AI systems directly impacts the bottom line by eliminating bottlenecks and scaling intelligence.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    {industry.outcomes.map((outcome, i) => (
                      <FadeIn key={i} delay={i * 0.1} className="border-l-2 border-secondary pl-4">
                        <div className="text-3xl font-bold text-foreground mb-1">{outcome.metric}</div>
                        <div className="text-sm font-medium text-muted-foreground">{outcome.label}</div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </div>
              <FadeIn direction="left">
                <RoiCalculator config={industry.roiConfig} />
              </FadeIn>
            </div>
          </Container>
        </Section>

        {/* 7. TECHNOLOGY STACK */}
        <Section className="bg-surface border-y border-border">
          <Container>
            <SectionHeading badge="Infrastructure" title="Technology Stack" subtitle="Secure, scalable, and compliant enterprise infrastructure." centered />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {industry.techStack.map((stack, i) => (
                <div key={i} className="bg-background border border-border p-6 rounded-xl text-center">
                  <h4 className="font-heading font-semibold text-foreground mb-4 border-b border-border pb-4">{stack.category}</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {stack.techs.map((t, j) => (
                      <span key={j} className="px-3 py-1 bg-surface border border-border rounded-lg text-sm font-medium text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* 8. CASE STUDY */}
        <Section className="bg-background">
          <Container>
             <div className="bg-gradient-to-br from-secondary/10 to-accent/10 border border-secondary/20 rounded-3xl p-8 md:p-12">
               <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-8 flex items-center gap-2">
                 <BarChart3 className="w-4 h-4" /> Proven Success
               </span>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="md:col-span-1 border-r border-border/50">
                   <div className="text-5xl md:text-6xl font-bold font-heading text-foreground mb-2">{industry.caseStudy.metric}</div>
                   <div className="text-lg font-medium text-muted-foreground">{industry.caseStudy.metricLabel}</div>
                 </div>
                 <div className="md:col-span-2 flex flex-col justify-center">
                   <p className="text-xl md:text-2xl text-foreground font-medium mb-4 leading-relaxed">
                     &quot;{industry.caseStudy.description}&quot;
                   </p>
                   <p className="text-secondary font-semibold">— {industry.caseStudy.clientType}</p>
                 </div>
               </div>
             </div>
          </Container>
        </Section>

        {/* 9. FAQ */}
        <Section className="bg-surface border-t border-border">
          <Container className="max-w-3xl mx-auto">
            <SectionHeading badge="Questions" title="Frequently Asked Questions" centered />
            <Accordion type="single" collapsible className="w-full mt-12">
              {industry.faq.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{f.question}</AccordionTrigger>
                  <AccordionContent>{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </Section>

        {/* 10. CTA */}
        <FinalCTA />

      </main>
      <Footer />
    </>
  )
}
