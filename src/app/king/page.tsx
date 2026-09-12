import Link from "next/link"
import { listClients } from "@/lib/data"
import { isSupabaseConfigured } from "@/lib/supabase"
import { CreateClientForm } from "@/components/admin/create-client-form"
import { ChevronRight, FolderOpen, Star, AlertTriangle, KeyRound } from "lucide-react"

export default async function AdminClientsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
        <h2 className="flex items-center gap-2 font-heading font-bold text-lg mb-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Supabase is not connected
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Add <code className="font-mono">SUPABASE_URL</code> and{" "}
          <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> to your{" "}
          <code className="font-mono">.env</code>, then run{" "}
          <code className="font-mono">supabase/schema.sql</code> in the Supabase SQL editor.
        </p>
      </div>
    )
  }

  const clients = await listClients()

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Clients</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {clients.length} {clients.length === 1 ? "client" : "clients"}. Credentials are
          created here and handed to the client directly.
        </p>
      </div>

      <CreateClientForm />

      <div className="space-y-3">
        {clients.length === 0 && (
          <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border p-8 text-center">
            No clients yet. Create the first one above.
          </p>
        )}

        {clients.map((client) => (
          <Link
            key={client.id}
            href={`/king/clients/${client.id}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">{client.display_name}</span>
                {client.company && (
                  <span className="text-xs text-muted-foreground">· {client.company}</span>
                )}
              </div>
              <div className="text-xs mt-1 flex items-center gap-1.5">
                <KeyRound className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="font-mono text-foreground/80 select-all">
                  {client.username}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
              <span className="inline-flex items-center gap-1">
                <FolderOpen className="w-3.5 h-3.5" />
                {client.project_count}
              </span>

              {client.review_status ? (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    client.review_status === "published"
                      ? "bg-success/10 text-success"
                      : client.review_status === "pending"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Star className="w-3 h-3" />
                  {client.review_status}
                </span>
              ) : client.reviews_enabled ? (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  review unlocked
                </span>
              ) : null}
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
