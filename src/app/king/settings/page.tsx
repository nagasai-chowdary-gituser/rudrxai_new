import { getAdminSettings } from "@/lib/admin-auth"
import { ChangeAdminCredentialsForm } from "@/components/admin/settings-form"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings()

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          The den has no password. The torch colour, the username and the pattern
          are the whole answer — changing them here takes effect immediately,
          without a redeploy.
        </p>
      </div>

      <ChangeAdminCredentialsForm
        currentUsername={settings.username}
        currentPattern={settings.pattern}
      />

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading font-bold text-lg text-foreground mb-2">The den</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The greyed-out text in each box above is what the den asks for right
          now — write it down somewhere safe. The torch colour is seeded from{" "}
          <code className="font-mono text-xs">ADMIN_GATE_COLOR</code> and can only
          be changed in Supabase. Failed attempts seal the den for 15 minutes
          after 5 tries from the same address.
        </p>
      </div>
    </div>
  )
}
