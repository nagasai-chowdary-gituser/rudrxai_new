"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Container } from "./container"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Menu, X, UserCircle } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/industries", label: "Industries" },
  { href: "/reviews", label: "Reviews" },
  { href: "/products", label: "Products" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMobileOpen])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-[70] transition-all duration-300 border-b border-transparent",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-border shadow-sm"
            : "bg-transparent"
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
              <Logo />
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/portal"
                title="Client Portal"
                aria-label="Client Portal"
                className="group relative w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
              >
                <UserCircle className="w-4 h-4" />
                <span className="pointer-events-none absolute top-full mt-2 right-0 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity">
                  Client Portal
                </span>
              </Link>
              <ThemeToggle />
              <Link href="/contact">
                <Button>Get a Quote</Button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="flex lg:hidden items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 text-foreground"
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-lg pt-24 lg:hidden">
          <Container>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-lg font-medium text-foreground py-3 px-4 rounded-lg hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border my-4" />
              <Link
                href="/portal"
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex items-center gap-2 text-lg font-medium text-foreground py-3 px-4 rounded-lg hover:bg-muted transition-colors"
              >
                <UserCircle className="w-5 h-5 text-primary" /> Client Portal
              </Link>
              <Link href="/contact" onClick={() => setIsMobileOpen(false)}>
                <Button className="w-full mt-2" size="lg">Get a Quote</Button>
              </Link>
            </nav>
          </Container>
        </div>
      )}
    </>
  )
}
