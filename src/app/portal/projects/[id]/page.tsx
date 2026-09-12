import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Container } from "@/components/layout/container"
import { getClientSession } from "@/lib/session"
import { formatMoney, getProject, getSignedPdfLinks } from "@/lib/data"
import { ArrowLeft, Download, Eye, FileText, RefreshCw, Wallet, Receipt } from "lucide-react"

export const dynamic = "force-dynamic"

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Wallet
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-3">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className="text-2xl font-bold font-heading text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}

export default async function PortalProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const clientId = await getClientSession()
  if (!clientId) redirect("/portal")

  const { id } = await params
  const project = await getProject(id)

  // Ownership check: a signed-in client must never be able to open another
  // client's project by guessing its id.
  if (!project || project.client_id !== clientId) notFound()

  const pdf = project.pdf_path
    ? await getSignedPdfLinks(project.pdf_path, project.pdf_name)
    : null
  const balance = project.total_charge - project.advance_paid
  const revisionsLeft = Math.max(0, project.revisions_total - project.revisions_used)

  return (
    <Container>
      <div className="max-w-3xl">
        <Link
          href="/portal/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> All projects
        </Link>

        <h1 className="text-3xl font-bold font-heading text-foreground mb-8">
          {project.name}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Stat
            icon={RefreshCw}
            label="Revisions"
            value={`${project.revisions_used} of ${project.revisions_total}`}
            sub={revisionsLeft === 0 ? "None remaining" : `${revisionsLeft} remaining`}
          />
          <Stat
            icon={Wallet}
            label="Advance paid"
            value={formatMoney(project.advance_paid, project.currency)}
          />
          <Stat
            icon={Receipt}
            label="Total charge"
            value={formatMoney(project.total_charge, project.currency)}
            sub={
              balance > 0
                ? `${formatMoney(balance, project.currency)} balance due`
                : "Fully paid"
            }
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading font-bold text-lg text-foreground mb-1">
            Project brief
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            The full scope and deliverables for this project.
          </p>

          {pdf ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                {project.pdf_name || "Project brief.pdf"}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={pdf.view}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <Eye className="w-4 h-4" /> View
                </a>
                <a
                  href={pdf.download}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" /> No document has been uploaded yet.
            </p>
          )}

          {pdf && (
            <p className="text-xs text-muted-foreground mt-3">
              These links are private to you and expire after a few minutes. Reload the
              page for fresh ones.
            </p>
          )}
        </div>
      </div>
    </Container>
  )
}
