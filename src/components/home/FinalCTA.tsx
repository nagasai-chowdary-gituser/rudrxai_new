"use client"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { FadeIn } from "@/components/effects/fade-in"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function FinalCTA() {
  return (
    <Section className="relative overflow-hidden py-24 lg:py-32 bg-background">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />
      
      <Container className="relative z-10 text-center">
        <FadeIn>
          <h2 className="text-4xl md:text-6xl font-bold font-heading tracking-tight mb-6 text-foreground">
            Ready to Build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Your Digital Solution
            </span>?
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Get a free quote for your project. Websites from ₹3,999. No hidden fees. No commitments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="h-14 px-10 text-base font-semibold rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link href="/contact">
                Get Free Quote <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-10 text-base font-semibold rounded-full">
              <Link href="/products">
                Explore Our Work
              </Link>
            </Button>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}
