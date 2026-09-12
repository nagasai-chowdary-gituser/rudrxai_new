import { redirect } from "next/navigation"
import { getClientSession } from "@/lib/session"
import { getClientById } from "@/lib/data"
import { WelcomeFlash } from "@/components/portal/welcome-flash"

export const dynamic = "force-dynamic"

export default async function PortalWelcomePage() {
  const clientId = await getClientSession()
  if (!clientId) redirect("/portal")

  const client = await getClientById(clientId)
  if (!client?.is_active) redirect("/portal")

  return <WelcomeFlash name={client.display_name} />
}
