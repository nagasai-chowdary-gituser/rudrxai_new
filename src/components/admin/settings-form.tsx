"use client"

import { useActionState } from "react"
import { changeAdminPassword, type ActionState } from "@/app/king/actions"
import { Field, FormMessage, SubmitButton } from "./form"

const initial: ActionState = {}

export function ChangeAdminPasswordForm() {
  const [state, action] = useActionState(changeAdminPassword, initial)

  return (
    <form action={action} className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <h2 className="font-heading font-bold text-lg text-foreground">Change admin password</h2>
      <Field
        label="New password"
        name="new_password"
        type="password"
        required
        hint="Minimum 10 characters."
      />
      <Field label="Confirm new password" name="confirm_password" type="password" required />
      <FormMessage state={state} />
      <SubmitButton>Change password</SubmitButton>
    </form>
  )
}
