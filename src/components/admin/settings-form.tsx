"use client"

import { useActionState } from "react"
import { changeAdminCredentials, type ActionState } from "@/app/king/actions"
import { Field, FormMessage, SubmitButton } from "./form"

const initial: ActionState = {}

export function ChangeAdminCredentialsForm({
  currentUsername,
  currentPattern,
}: {
  currentUsername: string
  currentPattern: string
}) {
  const [state, action] = useActionState(changeAdminCredentials, initial)

  return (
    <form action={action} className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div>
        <h2 className="font-heading font-bold text-lg text-foreground">
          Change what the den asks for
        </h2>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          Fill in only what you want to change. Anything you leave blank stays as
          it is.
        </p>
      </div>

      <Field
        label="New username"
        name="username"
        placeholder={currentUsername}
        hint="Minimum 3 characters. Case does not matter at the door."
      />

      <Field
        label="New pattern"
        name="pattern"
        placeholder={currentPattern}
        hint="Dots numbered 1-9, left to right and top to bottom, separated by commas. At least 4, no repeats."
      />

      <FormMessage state={state} />
      <SubmitButton>Save the answer</SubmitButton>
    </form>
  )
}
