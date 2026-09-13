import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getClientById,
  getReviewForClient,
  getSignedPdfLinks,
  listProjectsForClient,
  type PdfLinks,
} from "@/lib/data"
import { readStagesForProjects } from "@/lib/stages-store"
import { readDeliverablesForProjects } from "@/lib/deliverables-store"
import {
  ClientDetailsForm,
  DeleteClientForm,
  ProjectsSection,
  CredentialsCard,
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

  // Sign every uploaded brief once here, so the panel can open them without
  // the browser ever touching Supabase directly.
  const projectIds = projects.map((project) => project.id)
  const [stages, deliverables] = await Promise.all([
    readStagesForProjects(projectIds),
    readDeliverablesForProjects(projectIds),
  ])

  const pdfLinks: Record<string, PdfLinks> = {}
  await Promise.all(
    projects
      .filter((project) => project.pdf_path)
      .map(async (project) => {
        const links = await getSignedPdfLinks(project.pdf_path!, project.pdf_name)
        if (links) pdfLinks[project.id] = links
      })
  )

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

      <ProjectsSection
        clientId={client.id}
        projects={projects}
        pdfLinks={pdfLinks}
        stages={stages}
        deliverables={deliverables}
      />
      <ReviewToggle client={client} hasReview={Boolean(review)} />
      <ClientDetailsForm client={client} />
      <CredentialsCard client={client} />
      <DeleteClientForm clientId={client.id} name={client.display_name} />
    </div>
  )
}
