"use client"

import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Monitor, Users, Activity, Clock, Layers } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"

/* ═══════════════════════════════════════════
   HERO COMPONENT — Premium Agency Landing
   ═══════════════════════════════════════════ */

export function Hero() {
  const [loaded, setLoaded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setLoaded(true) }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  return (
    <>
      {/* ═══════ SECTION 1: FULL-SCREEN HERO ═══════ */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background selection:bg-primary/30"
      >
        {/* ── Background ── */}
        <div className="absolute inset-0 z-0">
          {/* Video — zoomed out */}
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-[1.15] opacity-0 dark:opacity-45 z-0">
            <source src="/landing_page_video.mp4" type="video/mp4" />
          </video>
          {/* Center aura to mask watermark */}
          <div className="absolute inset-0 z-[1] dark:block hidden" style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(10,11,20,0.9) 0%, rgba(10,11,20,0.5) 30%, transparent 65%)'
          }} />
          {/* Dark overlay — subtle */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-[2] dark:block hidden" />
          {/* Light mode subtle bg */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.04),transparent_70%)] dark:hidden z-[1]" />
          {/* Interactive glow that follows mouse */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.06] dark:opacity-[0.08] transition-all duration-[1500ms] ease-out z-[3] pointer-events-none bg-primary"
            style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>

        {/* ── Top spacer for navbar ── */}
        <div className="pt-24 lg:pt-28" />

        {/* ── Content — positioned left ── */}
        <div className="relative z-10 flex-1 flex items-center">
          <Container>
            <div className="max-w-5xl pl-0 md:pl-2">
              {/* Welcome line */}
              <div className={`overflow-hidden mb-4 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-sm md:text-base font-medium tracking-[0.3em] uppercase text-primary animate-[slideUp_0.8s_ease-out_forwards]">
                  Welcome to Rudrova Labs Agency
                </p>
              </div>

              {/* Main headline — massive, editorial */}
              <div className="overflow-hidden mb-8">
                <h1 className={`text-[clamp(2.5rem,8vw,7rem)] font-bold font-heading leading-[0.95] tracking-[-0.04em] text-foreground transition-all duration-1000 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                  We craft digital
                  <br />
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#a78bfa] to-accent">
                    experiences
                  </span>{" "}
                  that
                  <br />
                  move businesses
                  <span className="text-primary">.</span>
                </h1>
              </div>

              {/* Subtext + CTAs side by side */}
              <div className={`mt-15 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                From websites and AI chatbots to voice agents and custom platforms — we build production-grade solutions, starting at just <span className="text-foreground font-semibold">₹3,999</span>.
              </p>

                <div className="flex gap-3 shrink-0">
                  <Button size="lg" asChild className="h-14 px-8 text-sm font-semibold bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                    <Link href="/contact">
                      Start a Project <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="ghost" asChild className="h-14 px-6 text-sm font-semibold rounded-full hover:bg-foreground/5 transition-all">
                    <Link href="/portfolio">
                      Our Work <ArrowUpRight className="ml-1 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* ── Bottom: Scrolling Marquee ── */}
        <div className={`relative z-10 border-t border-border/30 dark:border-white/5 py-5 overflow-hidden transition-all duration-1000 delay-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex shrink-0">
                {["Business Websites", "AI Chatbots", "Voice Agents", "AI Dashboards", "E-Commerce", "Healthcare Platforms", "Real Estate", "EdTech & LMS", "Custom Platforms"].map((s, i) => (
                  <span key={`${setIdx}-${i}`} className="flex items-center mx-6 md:mx-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide uppercase">{s}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 2: STATS + TRUST ═══════ */}
      <section className="relative bg-muted/30 dark:bg-[#060609] border-y border-border/30 dark:border-white/5">
        <Container>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-0 divide-x divide-border/30 dark:divide-white/5">
            {[
              { icon: Monitor, val: "50+", label: "Projects" },
              { icon: Users, val: "45+", label: "Clients" },
              { icon: Activity, val: "99.9%", label: "Uptime" },
              { icon: Layers, val: "10+", label: "Industries" },
              { icon: Clock, val: "24/7", label: "Support" },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="flex flex-col items-center py-10 group">
                  <Icon className="w-5 h-5 text-primary/60 mb-3 group-hover:text-primary transition-colors" />
                  <span className="text-2xl md:text-3xl font-bold text-foreground font-heading tracking-tight">{s.val}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1 font-medium">{s.label}</span>
                </div>
              )
            })}
          </div>
        </Container>
      </section>


      {/* ═══════ ANIMATIONS ═══════ */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}
