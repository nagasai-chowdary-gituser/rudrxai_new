"use client"

import { useActionState, useState } from "react"
import {
  deleteClient,
  deleteProject,
  resetClientPassword,
  saveProject,
  toggleReviews,
  updateClient,
  type ActionState,
} from "@/app/king/actions"
import { Field, FormMessage, SubmitButton } from "./form"
import type { ClientRow, ProjectRow } from "@/lib/supabase"
import { FileText, Plus, Trash2, KeyRound, Star, Copy, Check } from "lucide-react"

const initial: ActionState = {}

function Card({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-heading font-bold text-lg text-foreground">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 mb-5">{description}</p>
      )}
      <div className={description ? "" : "mt-5"}>{children}</div>
    </section>
  )
}

// ------------------------------------------------------------------ details

export function ClientDetailsForm({ client }: { client: ClientRow }) {
  const [state, action] = useActionState(updateClient, initial)

  return (
    <Card title="Client details" description="Shown on the public review card.">
      <form action={action} className="space-y-4">
        <input type="hidden" name="client_id" value={client.id} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Client name" name="display_name" required defaultValue={client.display_name} />
          <Field label="Company" name="company" defaultValue={client.company ?? ""} />
        </div>
        <FormMessage state={state} />
        <SubmitButton variant="outline">Save details</SubmitButton>
      </form>
    </Card>
  )
}

// ----------------------------------------------------------------- password

export function CredentialsCard({ client }: { client: ClientRow }) {
  const [state, action] = useActionState(resetClientPassword, initial)
  const [copied, setCopied] = useState(false)

  const copyUsername = async () => {
    try {
      await navigator.clipboard.writeText(client.username)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the value is selectable either way.
    }
  }

  return (
    <Card
      title="Sign-in credentials"
      description="What this client types at /portal. There is no email on file, so password changes happen here."
    >
      {/* Username — the half that can always be shown */}
      <div className="rounded-lg border border-border bg-background p-4 mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Username
            </p>
            <p className="font-mono font-semibold text-foreground break-all select-all">
              {client.username}
            </p>
          </div>
          <button
            type="button"
            onClick={copyUsername}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Password
          </p>
          <p className="font-mono text-muted-foreground">••••••••••••</p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Stored as a one-way hash, so it cannot be read back — not by this
            panel and not by anyone who steals the database. If the client has
            lost it, set a new one below and send them the pair.
          </p>
        </div>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="client_id" value={client.id} />
        <Field
          label="Set a new password"
          name="password"
          placeholder="Leave blank to generate a strong one"
          hint="Minimum 8 characters. Shown once, immediately after saving."
        />
        <FormMessage state={state} />
        <SubmitButton variant="outline">
          <KeyRound className="w-4 h-4" /> Set new password
        </SubmitButton>
      </form>
    </Card>
  )
}

// ------------------------------------------------------------------ reviews

export function ReviewToggle({
  client,
  hasReview,
}: {
  client: ClientRow
  hasReview: boolean
}) {
  const [state, action] = useActionState(toggleReviews, initial)

  return (
    <Card
      title="Client review"
      description={
        hasReview
          ? "This client has already submitted their review — moderate it on the Reviews page."
          : "Unlock the review form in this client's portal. They can submit once."
      }
    >
      <form action={action} className="space-y-4">
        <input type="hidden" name="client_id" value={client.id} />
        <input type="hidden" name="enabled" value={(!client.reviews_enabled).toString()} />
        <FormMessage state={state} />
        <SubmitButton variant={client.reviews_enabled ? "outline" : "primary"}>
          <Star className="w-4 h-4" />
          {client.reviews_enabled ? "Lock review form" : "Unlock review form"}
        </SubmitButton>
      </form>
    </Card>
  )
}

// ----------------------------------------------------------------- projects

function ProjectForm({
  clientId,
  project,
  onDone,
}: {
  clientId: string
  project?: ProjectRow
  onDone?: () => void
}) {
  const [state, action] = useActionState(saveProject, initial)

  return (
    <form
      action={async (formData) => {
        await action(formData)
        onDone?.()
      }}
      className="space-y-4"
    >
      {project && <input type="hidden" name="project_id" value={project.id} />}
      <input type="hidden" name="client_id" value={clientId} />

      <Field
        label="Project name"
        name="name"
        required
        defaultValue={project?.name}
        placeholder="Corporate website rebuild"
        hint="This is what the client sees and clicks in their portal."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field
          label="Revisions used"
          name="revisions_used"
          type="number"
          min={0}
          defaultValue={project?.revisions_used ?? 0}
        />
        <Field
          label="Revisions total"
          name="revisions_total"
          type="number"
          min={0}
          defaultValue={project?.revisions_total ?? 0}
        />
        <Field
          label="Advance paid"
          name="advance_paid"
          type="number"
          min={0}
          step="0.01"
          defaultValue={project?.advance_paid ?? 0}
        />
        <Field
          label="Total charge"
          name="total_charge"
          type="number"
          min={0}
          step="0.01"
          defaultValue={project?.total_charge ?? 0}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`currency-${project?.id ?? "new"}`}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Currency
          </label>
          <select
            id={`currency-${project?.id ?? "new"}`}
            name="currency"
            defaultValue={project?.currency ?? "INR"}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            <option value="INR">₹ Indian Rupee</option>
            <option value="USD">$ US Dollar</option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`pdf-${project?.id ?? "new"}`}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Project details PDF
          </label>
          <input
            id={`pdf-${project?.id ?? "new"}`}
            type="file"
            name="pdf"
            accept="application/pdf"
            className="w-full text-sm text-muted-foreground file:mr-3 file:h-9 file:px-3 file:rounded-lg file:border file:border-border file:bg-muted file:text-foreground file:text-sm file:font-medium hover:file:bg-muted/70 file:cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {project?.pdf_name ? `Current: ${project.pdf_name}` : "PDF, max 8 MB."}
          </p>
        </div>
      </div>

      <FormMessage state={state} />
      <SubmitButton>{project ? "Save project" : "Create project"}</SubmitButton>
    </form>
  )
}

function DeleteProjectForm({ projectId }: { projectId: string }) {
  const [state, action] = useActionState(deleteProject, initial)

  return (
    <form action={action} className="pt-2">
      <input type="hidden" name="project_id" value={projectId} />
      <FormMessage state={state} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete this project
      </button>
    </form>
  )
}

export function ProjectsSection({
  clientId,
  projects,
}: {
  clientId: string
  projects: ProjectRow[]
}) {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)

  return (
    <Card
      title="Projects"
      description="Each project is a separate card in the client's portal."
    >
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-border p-4">
            <button
              type="button"
              onClick={() => setEditing(editing === project.id ? null : project.id)}
              className="w-full flex items-center justify-between gap-3 text-left"
            >
              <span className="font-semibold text-foreground">{project.name}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-3 shrink-0">
                {project.pdf_path && <FileText className="w-3.5 h-3.5 text-primary" />}
                {project.revisions_used}/{project.revisions_total} rev
                <span className="text-primary">{editing === project.id ? "Close" : "Edit"}</span>
              </span>
            </button>

            {editing === project.id && (
              <div className="mt-5 pt-5 border-t border-border space-y-4">
                <ProjectForm clientId={clientId} project={project} />
                <DeleteProjectForm projectId={project.id} />
              </div>
            )}
          </div>
        ))}

        {projects.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border p-6 text-center">
            No projects yet.
          </p>
        )}

        {adding ? (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <ProjectForm clientId={clientId} onDone={() => setAdding(false)} />
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Plus className="w-4 h-4" /> Add project
          </button>
        )}
      </div>
    </Card>
  )
}

// ------------------------------------------------------------------- danger

export function DeleteClientForm({ clientId, name }: { clientId: string; name: string }) {
  const [state, action] = useActionState(deleteClient, initial)

  return (
    <Card
      title="Delete client"
      description={`Permanently removes ${name}, their projects, uploaded PDFs and review. This cannot be undone.`}
    >
      <form action={action} className="space-y-4">
        <input type="hidden" name="client_id" value={clientId} />
        <Field label="Type DELETE to confirm" name="confirm" placeholder="DELETE" />
        <FormMessage state={state} />
        <SubmitButton variant="danger">
          <Trash2 className="w-4 h-4" /> Delete client
        </SubmitButton>
      </form>
    </Card>
  )
}
