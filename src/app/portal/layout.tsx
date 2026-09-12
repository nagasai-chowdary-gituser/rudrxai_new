import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { getClientSession } from "@/lib/session"
import { getClientById } from "@/lib/data"
import { logout } from "./actions"
import { FolderOpen, Star, LogOut } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clientId = await getClientSession()
  const client = clientId ? await getClientById(clientId) : null

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background min-h-screen pt-28 pb-24">
        {client && (
          <div className="border-b border-border bg-card/50 mb-10">
            <Container>
              <div className="flex items-center justify-between gap-4 py-6 flex-wrap">
                <div className="min-w-0">
                  <p className="font-heading font-bold text-2xl sm:text-3xl text-foreground truncate leading-tight">
                    {client.display_name}
                  </p>
                  {client.company && (
                    <p className="text-base sm:text-lg text-muted-foreground truncate mt-0.5">
                      {client.company}
                    </p>
                  )}
                </div>

                <nav className="flex items-center gap-1">
                  <Link
                    href="/portal/projects"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <FolderOpen className="w-4 h-4" /> Projects
                  </Link>

                  {client.reviews_enabled && (
                    <Link
                      href="/portal/review"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Star className="w-4 h-4" /> Review
                    </Link>
                  )}

                  <form action={logout}>
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
            </Container>
          </div>
        )}

        {children}
      </main>
      <Footer />
    </>
  )
}
