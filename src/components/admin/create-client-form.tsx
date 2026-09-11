"use client"

import { useActionState, useState } from "react"
import { createClient, type ActionState } from "@/app/king/actions"
import { Field, FormMessage, SubmitButton } from "./form"
import { UserPlus, ChevronDown } from "lucide-react"

const initial: ActionState = {}

export function CreateClientForm() {
  const [open, setOpen] = useState(false)
  const [state, action] = useActionState(createClient, initial)

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
          <UserPlus className="w-4 h-4 text-primary" /> Create a client
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <form action={action} className="p-4 pt-0 space-y-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Field label="Client name" name="display_name" required placeholder="Jane Doe" />
            <Field label="Company" name="company" placeholder="Acme Corp" />
            <Field
              label="Username"
              name="username"
              required
              placeholder="acme"
              hint="What the client types to sign in."
            />
            <Field
              label="Password"
              name="password"
              placeholder="Leave blank to generate"
              hint="Minimum 8 characters."
            />
          </div>

          <FormMessage state={state} />

          <SubmitButton>Create client</SubmitButton>
        </form>
      )}
    </div>
  )
}
