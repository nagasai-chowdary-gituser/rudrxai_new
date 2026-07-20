import { caseStudies } from "@/data/case-studies"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { SectionHeading } from "@/components/ui/section-heading"
import { FadeIn } from "@/components/effects/fade-in"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { FilterGallery } from "@/components/case-studies/filter-gallery"

export default function CaseStudiesIndex() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        
        {/* Premium Hero */}
        <section className="pt-40 pb-32 bg-background relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <Container>
            <FadeIn>
              <SectionHeading 
                badge="Success Stories"
                title="Real Business Outcomes. Powered by AI."
                subtitle="Explore how enterprise leaders and governments are leveraging Rudrova Labs to orchestrate intelligent workflows, automate operations, and achieve measurable ROI."
                centered
              />
            </FadeIn>

            {/* Animated KPI Counters */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              <FadeIn delay={0.1}>
                <div className="flex flex-col items-center text-center p-6 bg-surface/50 border border-border rounded-2xl">
                  <div className="text-4xl md:text-5xl font-bold font-heading text-primary mb-2">
                    <AnimatedCounter value={24} prefix="+" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Enterprise Solutions</span>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="flex flex-col items-center text-center p-6 bg-surface/50 border border-border rounded-2xl">
                  <div className="text-4xl md:text-5xl font-bold font-heading text-primary mb-2">
                    <AnimatedCounter value={2} prefix="$" suffix="M+" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Hours Automated</span>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="flex flex-col items-center text-center p-6 bg-surface/50 border border-border rounded-2xl">
                  <div className="text-4xl md:text-5xl font-bold font-heading text-primary mb-2">
                    <AnimatedCounter value={99} suffix="%" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Deployment Success</span>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex flex-col items-center text-center p-6 bg-surface/50 border border-border rounded-2xl">
                  <div className="text-4xl md:text-5xl font-bold font-heading text-primary mb-2">
                    <AnimatedCounter value={3} prefix="<" suffix="s" duration={1} />
                  </div>
                  <span className="text-sm font-medium text-foreground">Agent Latency</span>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Gallery Section */}
        <section className="py-24 bg-surface/30 border-t border-border">
          <Container>
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold font-heading text-foreground mb-4">Discover the Impact</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Filter by industry to see exactly how Rudrova Labs is transforming operations.
                </p>
              </div>
            </FadeIn>
            
            <FilterGallery caseStudies={caseStudies} />
            
          </Container>
        </section>

      </main>
      <Footer />
    </>
  )
}
