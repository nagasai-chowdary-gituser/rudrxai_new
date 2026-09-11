"use client"

import { useActionState, useId } from "react"
import { useFormStatus } from "react-dom"
import { login, type PortalState } from "@/app/portal/actions"
import { Loader2, AlertCircle } from "lucide-react"

const initial: PortalState = {}

function SignInButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? "Signing in..." : "Sign in"}
    </button>
  )
}

export function LoginForm() {
  const [state, action] = useActionState(login, initial)
  const id = useId()

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      {state.error && (
        <p className="text-sm rounded-lg px-3 py-2 bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </p>
      )}

      <div>
        <label
          htmlFor={`${id}-username`}
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Username
        </label>
        <input
          id={`${id}-username`}
          name="username"
          type="text"
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor={`${id}-password`}
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Password
        </label>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <SignInButton />
    </form>
  )
}
