import type { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { FadeIn } from "@/components/effects/fade-in"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { products } from "@/data/products"

export const metadata: Metadata = {
  title: "AI Products & Platforms",
  description:
    "Production-ready AI platforms built by our team — interview automation, forecasting, document intelligence and more. Each one live, tested, and ready for customisation.",
  alternates: { canonical: "/products" },
}

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <Section className="pt-40 pb-20 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
          <Container>
            <FadeIn>
              <div className="max-w-3xl mb-16">
                <span className="inline-flex items-center rounded-full border px-3 py-1 font-semibold text-xs uppercase tracking-wider text-primary border-primary/20 bg-primary/5 mb-6">
                  Platforms
                </span>
                <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-6 text-foreground leading-[1.1]">
                  AI Products & Platforms
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Production-ready AI platforms built by our team. Each project is live, tested, and ready for enterprise customization.
                </p>
              </div>
            </FadeIn>

            {/* Products Grid */}
            <div className="space-y-12">
              {products.map((product, idx) => (
                <FadeIn key={product.id} delay={0.1} direction={idx % 2 === 0 ? "left" : "right"}>
                  <div className="flex flex-col lg:flex-row gap-8 items-center bg-card border border-border rounded-3xl p-6 lg:p-10 overflow-hidden relative group hover:border-primary/30 transition-all">
                    
                    {/* Content Side */}
                    <div className={`flex-1 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl md:text-3xl font-bold font-heading text-foreground">{product.title}</h3>
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                          {product.status}
                        </span>
                      </div>
                      <p className="text-primary font-medium mb-4">{product.tagline}</p>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {product.overview}
                      </p>
                      
                      {/* Tech stack tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {product.techStack?.slice(0, 6).map((tech, tIdx) => (
                          <span key={tIdx} className="text-xs font-medium px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border">
                            {tech}
                          </span>
                        ))}
                        {(product.techStack?.length || 0) > 6 && (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border">
                            +{(product.techStack?.length || 0) - 6} more
                          </span>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
                        {product.features?.slice(0, 3).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start text-sm text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 shrink-0" />
                            <span><strong>{feat.title}</strong> — {feat.description}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/products/${product.id}`}
                          className="inline-flex items-center h-11 px-6 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"
                        >
                          View Details <ArrowRight className="ml-1.5 w-4 h-4" />
                        </Link>
                        {product.liveUrl && (
                          <a
                            href={product.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center h-11 px-6 rounded-full bg-card border border-border text-foreground font-medium text-sm hover:bg-muted transition-all"
                          >
                            View Live <ArrowUpRight className="ml-1.5 w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href="/contact"
                          className="inline-flex items-center h-11 px-6 rounded-full bg-card border border-border text-foreground font-medium text-sm hover:bg-muted transition-all"
                        >
                          Get Custom Version <ArrowRight className="ml-1.5 w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    
                    {/* Visual Side */}
                    <div className="flex-1 w-full lg:w-auto">
                      {product.imageUrl ? (
                        <Link
                          href={`/products/${product.id}`}
                          className="block relative w-full aspect-[3/2] rounded-2xl border border-border overflow-hidden"
                        >
                          <Image
                            src={product.imageUrl}
                            alt={`${product.title} interface`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 45vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                      ) : (
                        <div className="w-full aspect-[3/2] rounded-2xl border border-border bg-muted flex items-center justify-center">
                          <span className="font-heading font-semibold text-muted-foreground">
                            {product.title}
                          </span>
                        </div>
                      )}
                    </div>
                    
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section className="py-20 bg-muted/30 dark:bg-[#060612]">
          <Container className="text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
                Need a Custom AI Solution?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Every product above can be customized for your business. Or we can build something entirely new.
              </p>
              <Button size="lg" asChild className="rounded-full h-14 px-10">
                <Link href="/contact">
                  Start Your Project <ArrowRight className="ml-2 w-4 h-4" />
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
