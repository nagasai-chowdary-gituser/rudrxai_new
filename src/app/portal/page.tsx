import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Container } from "@/components/layout/container"
import { getClientSession } from "@/lib/session"
import { getClientById } from "@/lib/data"
import { LoginForm } from "@/components/portal/login-form"
import { Lock } from "lucide-react"

export const metadata: Metadata = {
  title: "Client Portal",
  description:
    "Sign in to view your project files, revision count and payment status with Rudrova Labs.",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function PortalLoginPage() {
  // Only skip the login form if the session points at a client that still
  // exists and is active. A deleted or deactivated client used to keep a
  // working session and land on an empty portal.
  const sessionId = await getClientSession()
  if (sessionId) {
    const client = await getClientById(sessionId)
    if (client?.is_active) redirect("/portal/projects")
  }

  return (
    <Container>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold font-heading text-foreground mb-3">
                Client Portal
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sign in with the credentials your project lead gave you to see your project
                files, revisions and payment status.
              </p>
            </div>

            <LoginForm />

            <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
              Lost your details? Email{" "}
              <a
                href="mailto:rudrovalabs@gmail.com"
                className="text-primary hover:underline"
              >
                rudrovalabs@gmail.com
              </a>{" "}
              and we will issue new ones.
            </p>
          </div>
    </Container>
  )
}
