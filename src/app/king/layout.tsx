import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAdminSession } from "@/lib/session"
import { signOut } from "./actions"
import { Users, Star, Settings, LogOut, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

const links = [
  { href: "/king", label: "Clients", icon: Users },
  { href: "/king/reviews", label: "Reviews", icon: Star },
  { href: "/king/settings", label: "Settings", icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware already blocks this path, but the layout re-checks: defence in
  // depth costs nothing here and protects against a misconfigured matcher.
  // 404, not a redirect: a redirect tells a scanner "this exists and is
  // protected". A 404 tells it nothing at all.
  if (!(await getAdminSession())) notFound()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-heading font-bold text-foreground">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline">Rudrova Labs Admin</span>
            <span className="ml-2 hidden md:inline text-xs font-normal font-sans text-muted-foreground">
              unlocked · sign out or close the browser to lock
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              )
            })}
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
