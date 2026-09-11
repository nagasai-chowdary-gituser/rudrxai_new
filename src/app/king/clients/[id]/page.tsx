import Link from "next/link"
import { notFound } from "next/navigation"
import { getClientById, getReviewForClient, listProjectsForClient } from "@/lib/data"
import {
  ClientDetailsForm,
  DeleteClientForm,
  ProjectsSection,
  ResetPasswordForm,
  ReviewToggle,
} from "@/components/admin/client-detail"
import { ArrowLeft } from "lucide-react"

export default async function AdminClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await getClientById(id)

  if (!client) notFound()

  const [projects, review] = await Promise.all([
    listProjectsForClient(client.id),
    getReviewForClient(client.id),
  ])

  return (
    <div className="space-y-6">
      <Link
        href="/king"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> All clients
      </Link>

      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">
          {client.display_name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Signs in as <span className="font-mono text-foreground">{client.username}</span>
          {client.company && ` · ${client.company}`}
        </p>
      </div>

      <ProjectsSection clientId={client.id} projects={projects} />
      <ReviewToggle client={client} hasReview={Boolean(review)} />
      <ClientDetailsForm client={client} />
      <ResetPasswordForm clientId={client.id} />
      <DeleteClientForm clientId={client.id} name={client.display_name} />
    </div>
  )
}
