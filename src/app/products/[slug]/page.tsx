import type { Metadata } from "next"
import { products } from "@/data/products"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { SectionHeading } from "@/components/ui/section-heading"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/effects/fade-in"
import { Button } from "@/components/ui/button"
import { IntegrationGallery } from "@/components/products/integration-gallery"
import { PricingTiers } from "@/components/products/pricing-tiers"
import { ArchitectureDiagram } from "@/components/solutions/ArchitectureDiagram"
import { InteractiveDemo } from "@/components/solutions/InteractiveDemo"
import { CheckCircle2, ShieldCheck, FileText, Blocks, Code, MessageSquare, Minus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function generateStaticParams() {
  return products.map((p) => ({
    slug: p.id,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = products.find((p) => p.id === slug)

  if (!product) return { title: "Product Not Found" }

  return {
    title: product.title,
    description: product.tagline,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${product.title} | Rudrova Labs`,
      description: product.tagline,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === resolvedParams.slug)

  if (!product) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-40 pb-20 bg-background relative overflow-hidden border-b border-border">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
          
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeIn direction="right">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold bg-surface mb-6 font-mono text-xs uppercase tracking-wider text-primary border-primary/20">
                  {product.status}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight mb-6 text-foreground leading-[1.1]">
                  {product.title}
                </h1>
                <p className="text-xl text-primary font-medium mb-6">
                  {product.tagline}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {product.overview}
                </p>
                <div className="flex flex-wrap gap-4">
                  {product.liveUrl ? (
                    <Button size="lg" asChild className="h-12 px-8">
                      <a href={product.liveUrl} target="_blank" rel="noopener noreferrer">
                        View Live Project
                      </a>
                    </Button>
                  ) : (
                    <Button size="lg" asChild className="h-12 px-8">
                      <Link href="/discovery">Request Demo</Link>
                    </Button>
                  )}
                  <Button size="lg" variant="outline" asChild className="h-12 px-8">
                    <Link href="/contact">Talk to an Engineer</Link>
                  </Button>
                </div>
              </FadeIn>
              
              <FadeIn direction="left">
                {product.imageUrl ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl">
                    <Image
                      src={product.imageUrl}
                      alt={`${product.title} interface`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <InteractiveDemo />
                )}
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Business Problems & Features */}
        <section className="py-24 bg-surface/30">
          <Container>
            <FadeIn>
              <SectionHeading 
                title="Capabilities & Outcomes"
                subtitle="Engineered to solve complex operational challenges at scale."
                centered
              />
            </FadeIn>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
              <FadeIn className="lg:col-span-1" delay={0.1}>
                <div className="bg-background rounded-2xl p-8 border border-border h-full shadow-lg">
                  <h3 className="font-heading font-semibold text-xl mb-6 flex items-center text-foreground">
                    <ShieldCheck className="w-6 h-6 text-destructive mr-3" />
                    Challenges Solved
                  </h3>
                  <ul className="space-y-4">
                    {product.businessProblems.map((problem, i) => (
                      <li key={i} className="flex items-start">
                        <Minus className="w-5 h-5 text-destructive/50 shrink-0 mr-3 mt-0.5" />
                        <span className="text-muted-foreground">{problem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
              
              <div className="lg:col-span-2">
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                  {product.features.map((feature, i) => (
                    <StaggerItem key={i}>
                      <div className="bg-background rounded-2xl p-6 border border-border h-full hover:border-primary/50 transition-colors shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <Blocks className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-heading font-semibold text-lg text-foreground mb-2">{feature.title}</h4>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </Container>
        </section>

        {/* Architecture */}
        <section className="py-24 bg-background">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeIn direction="right">
                <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-6">Enterprise Architecture</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {product.architectureDescription}
                </p>
                <div className="space-y-6">
                  {product.security.map((sec, i) => (
                    <div key={i} className="flex">
                      <div className="mt-1 bg-success/10 p-1.5 rounded-full mr-4 h-fit">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{sec.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{sec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
              <FadeIn direction="left">
                <ArchitectureDiagram nodes={[
                  { id: "1", type: "input", label: "Client Apps" },
                  { id: "2", type: "process", label: "Gateway" },
                  { id: "3", type: "process", label: "Inference Engine" },
                  { id: "4", type: "output", label: "Structured Output" }
                ]} />
              </FadeIn>
            </div>
            
            {/* Integrations */}
            <IntegrationGallery integrations={product.integrations} />
          </Container>
        </section>

        {/* Pricing */}
        <section className="py-24 bg-surface/50 border-t border-border">
          <Container>
            <FadeIn>
              <SectionHeading 
                title="Transparent Pricing"
                subtitle="Predictable scaling for enterprise deployments."
                centered
              />
            </FadeIn>
            <PricingTiers tiers={product.pricing} />
          </Container>
        </section>

        {/* FAQ & Resources */}
        <section className="py-24 bg-background border-t border-border">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8">
                <FadeIn>
                  <h2 className="text-3xl font-bold font-heading mb-8">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                    {product.faq.map((faq, i) => (
                      <div key={i} className="bg-surface p-6 rounded-2xl border border-border">
                        <h4 className="font-semibold text-foreground text-lg mb-3">{faq.question}</h4>
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              </div>
              
              <div className="lg:col-span-4">
                <FadeIn direction="left">
                  <div className="bg-surface rounded-2xl p-8 border border-border sticky top-32">
                    <h3 className="font-heading font-semibold text-xl mb-6">Next Steps</h3>
                    <div className="space-y-4">
                      {product.liveUrl && (
                        <a
                          href={product.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border group"
                        >
                          <Code className="w-5 h-5 text-muted-foreground group-hover:text-primary mr-3" />
                          <span className="text-sm font-medium">Try the live demo</span>
                        </a>
                      )}
                      <Link href="/discovery" className="flex items-center p-3 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border group">
                        <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary mr-3" />
                        <span className="text-sm font-medium">Book a technical walkthrough</span>
                      </Link>
                      <Link href="/contact" className="flex items-center p-3 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border group">
                        <MessageSquare className="w-5 h-5 text-muted-foreground group-hover:text-primary mr-3" />
                        <span className="text-sm font-medium">Ask us a question</span>
                      </Link>
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
