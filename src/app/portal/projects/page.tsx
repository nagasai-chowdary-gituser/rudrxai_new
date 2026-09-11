import Link from "next/link"
import { redirect } from "next/navigation"
import { Container } from "@/components/layout/container"
import { getClientSession } from "@/lib/session"
import { formatMoney, getClientById, listProjectsForClient } from "@/lib/data"
import { ChevronRight, FileText, FolderOpen } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PortalProjectsPage() {
  const clientId = await getClientSession()
  if (!clientId) redirect("/portal")

  // The account may have been removed since this session was issued.
  const client = await getClientById(clientId)
  if (!client?.is_active) redirect("/portal")

  const projects = await listProjectsForClient(clientId)

  return (
    <Container>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold font-heading text-foreground mb-2">
          Your projects
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Select a project to see its brief, revisions and payment status.
        </p>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <FolderOpen className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              No projects have been added to your account yet. Your project lead will add
              them shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => {
              const balance = project.total_charge - project.advance_paid
              return (
                <Link
                  key={project.id}
                  href={`/portal/projects/${project.id}`}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <h2 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                      {project.name}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {project.revisions_used} of {project.revisions_total} revisions used
                      {balance > 0
                        ? ` · ${formatMoney(balance, project.currency)} due`
                        : " · fully paid"}
                    </p>
                  </div>

                  {project.pdf_path && (
                    <FileText className="w-4 h-4 text-primary shrink-0" aria-label="Has a brief" />
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </Container>
  )
}
