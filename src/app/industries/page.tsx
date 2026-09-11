import type { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/effects/fade-in"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { industries as industryData } from "@/data/industries"

export const metadata: Metadata = {
  title: "Industries",
  description:
    "AI systems built for the operational, regulatory, and technical realities of healthcare, finance, government, manufacturing, retail and more.",
  alternates: { canonical: "/industries" },
}

const industryCards = [
  {
    name: "Healthcare",
    slug: "healthcare",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=60&w=800",
    desc: "We build secure, compliant intelligent systems that automate documentation, streamline operations, and provide clinical decision support for healthcare providers.",
  },
  {
    name: "Finance & Banking",
    slug: "finance",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=60&w=800&auto=format&fit=crop",
    desc: "Financial institutions must balance rapid customer service with regulatory compliance. We provide systems that accelerate loan processing, automate KYC, and deliver real-time risk intelligence.",
  },
  {
    name: "Government (B2G)",
    slug: "government",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=60&w=800&auto=format&fit=crop",
    desc: "Governments hold massive amounts of data in silos. We build sovereign, secure systems that help agencies process documents faster, support citizens 24/7, and analyze policy impact.",
  },
  {
    name: "Manufacturing",
    slug: "manufacturing",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=60&w=800&auto=format&fit=crop",
    desc: "Downtime and quality defects cost manufacturers millions. Rudrova Labs implements computer vision for instant defect detection and predictive models that alert you before machines break down.",
  },
  {
    name: "Retail & Ecommerce",
    slug: "retail",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=60&w=800",
    desc: "Retailers need personalized experiences at scale while managing complex logistics. We build systems that understand customer intent, price dynamically, and optimize inventory.",
  },
  {
    name: "Education",
    slug: "education",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=60&w=800",
    desc: "The education industry is rapidly evolving. We build intelligent, scalable systems tailored for the unique operational challenges — from LMS platforms to AI tutoring assistants.",
  },
  {
    name: "Logistics & Supply Chain",
    slug: "logistics",
    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=60&w=800",
    desc: "We build intelligent systems for route optimization, demand forecasting, warehouse automation, and real-time shipment tracking across your entire supply chain.",
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=60&w=800&auto=format&fit=crop",
    desc: "From virtual tours to property matching AI, we build systems that automate lead qualification, property valuation, and tenant management for real estate businesses.",
  },
  {
    name: "Insurance",
    slug: "insurance",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=60&w=800&auto=format&fit=crop",
    desc: "We build intelligent systems for automated claims processing, risk assessment, fraud detection, and customer service bots for insurance companies.",
  },
  {
    name: "Agriculture",
    slug: "agriculture",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=60&w=800&auto=format&fit=crop",
    desc: "From crop monitoring to yield prediction, we build AI-powered solutions that help farmers and agribusinesses make data-driven decisions and optimize operations.",
  },
  {
    name: "Hospitality",
    slug: "hospitality",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=60&w=800&auto=format&fit=crop",
    desc: "We build booking systems, guest experience AI, and operations platforms tailored for hotels, restaurants, and the travel industry.",
  },
  {
    name: "Automotive",
    slug: "automotive",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=60&w=800&auto=format&fit=crop",
    desc: "From dealership CRM to service scheduling AI, we build intelligent systems for the automotive industry — connecting showrooms, workshops, and customers.",
  },
]

// Only surface cards that actually have a detail page behind them.
const industries = industryCards.filter((card) =>
  industryData.some((industry) => industry.id === card.slug)
)

export default function IndustriesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <Section className="pt-40 pb-20 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
          <Container>
            <FadeIn>
              <div className="max-w-3xl mb-16">
                <FadeIn>
                  <span className="inline-flex items-center rounded-full border px-3 py-1 font-semibold text-xs uppercase tracking-wider text-primary border-primary/20 bg-primary/5 mb-6">
                    Sectors
                  </span>
                </FadeIn>
                <FadeIn>
                  <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-6 text-foreground leading-[1.1]">
                    Industry Transformation
                  </h1>
                </FadeIn>
                <FadeIn>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    We build premium AI systems tailored to the specific operational, regulatory, and technical challenges of your industry.
                  </p>
                </FadeIn>
              </div>
            </FadeIn>

            {/* Industries Grid */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {industries.map((ind) => (
                <StaggerItem key={ind.slug}>
                  <div className="group h-full bg-card border border-border rounded-2xl transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden flex flex-col">
                    {/* Image */}
                    <Link href={`/industries/${ind.slug}`} className="block w-full h-52 relative overflow-hidden group/img">
                      <Image
                        src={ind.image}
                        alt={ind.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1 relative z-10 -mt-6">
                      <h3 className="font-heading font-bold text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                        {ind.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                        {ind.desc}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-border">
                        <Link
                          href={`/industries/${ind.slug}`}
                          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center group/link"
                        >
                          View Details <ArrowRight className="ml-1 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          href="/discovery"
                          className="inline-flex items-center gap-2 text-sm font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white px-5 py-2.5 rounded-full transition-all shadow-sm"
                        >
                          <Calendar className="w-4 h-4" /> Book Call
                        </Link>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </Section>

        {/* CTA */}
        <Section className="py-20 bg-muted/30 dark:bg-[#060612]">
          <Container className="text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
                Don&apos;t see your industry?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                We build custom solutions for any sector. Tell us about your business challenges.
              </p>
              <Button size="lg" asChild className="rounded-full h-14 px-10">
                <Link href="/contact">
                  Get a Custom Quote <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </FadeIn>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
