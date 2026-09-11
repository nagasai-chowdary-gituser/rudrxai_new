"use client"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { StaggerContainer, StaggerItem } from "@/components/effects/fade-in"
import { Cpu, Bot, Mic, Workflow, Sparkles, ScanEye, Network, Database, BrainCircuit, Code2, ArrowRight } from "lucide-react"
import Link from "next/link"

const solutions = [
  { icon: Cpu, title: "Enterprise AI", desc: "Custom AI strategy and architecture for large-scale enterprise transformation." },
  { icon: Bot, title: "AI Agents", desc: "Autonomous AI agents that execute complex business workflows natively." },
  { icon: Mic, title: "Voice AI", desc: "Conversational voice interfaces and automated call center solutions." },
  { icon: Workflow, title: "Automation", desc: "End-to-end process automation driven by intelligent orchestration." },
  { icon: Sparkles, title: "Generative AI", desc: "Custom LLM deployment and fine-tuning for specialized enterprise tasks." },
  { icon: ScanEye, title: "Computer Vision", desc: "Real-time visual analysis, quality control, and spatial computing." },
  { icon: Network, title: "MLOps", desc: "Scalable infrastructure for training, deploying, and monitoring AI models." },
  { icon: Database, title: "Data Intelligence", desc: "Transform raw data into predictive insights and actionable intelligence." },
  { icon: BrainCircuit, title: "Machine Learning", desc: "Predictive modeling and classical ML for forecasting and risk analysis." },
  { icon: Code2, title: "Custom Software", desc: "Full-stack intelligent applications built around your core AI models." },
]

export function SolutionsGrid() {
  return (
    <Section className="bg-elevated relative border-y border-border">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 items-end mb-16">
          <SectionHeading 
            badge="Capabilities"
            title="AI Solutions" 
            subtitle="Comprehensive AI engineering capabilities to build exactly what your business needs to stay ahead."
            className="mb-0 flex-1"
          />
          <Link href="/products" className="hidden lg:inline-flex items-center text-primary font-medium hover:text-accent transition-colors">
            View all solutions <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {solutions.map((item, i) => (
            <StaggerItem key={i} direction="up">
              <div className="group h-full p-6 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  {item.desc}
                </p>
                
                <Link href="/products" className="inline-flex items-center text-sm font-medium text-foreground group-hover:text-primary transition-colors mt-auto">
                  Learn More <ArrowRight className="ml-1 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        
        <div className="mt-8 text-center lg:hidden">
          <Link href="/products" className="inline-flex items-center text-primary font-medium hover:text-accent transition-colors">
            View all solutions <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}
