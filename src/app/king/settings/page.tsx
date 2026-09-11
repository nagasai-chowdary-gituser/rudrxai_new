import { ChangeAdminPasswordForm } from "@/components/admin/settings-form"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your admin password is stored hashed in Supabase. Changing it here takes effect
          immediately, without a redeploy.
        </p>
      </div>

      <ChangeAdminPasswordForm />

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading font-bold text-lg text-foreground mb-2">
          The den
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The torch colour and the pattern are seeded from{" "}
          <code className="font-mono text-xs">ADMIN_GATE_COLOR</code> and{" "}
          <code className="font-mono text-xs">ADMIN_PATTERN</code> in your environment, then
          stored in Supabase. Failed attempts lock the den for 15 minutes after 5 tries from
          the same address.
        </p>
      </div>
    </div>
  )
}
