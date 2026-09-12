"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Loader2, Copy, Check } from "lucide-react"
import type { ActionState } from "@/app/king/actions"

export function SubmitButton({
  children,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode
  variant?: "primary" | "outline" | "danger"
  className?: string
}) {
  const { pending } = useFormStatus()

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-border text-foreground hover:bg-muted",
    danger: "bg-destructive text-white hover:bg-destructive/90",
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

export function FormMessage({ state }: { state: ActionState }) {
  if (!state.error && !state.success) return null

  return (
    <div className="space-y-2">
      {state.error && (
        <p className="text-sm rounded-lg px-3 py-2 bg-destructive/10 border border-destructive/20 text-destructive">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm rounded-lg px-3 py-2 bg-success/10 border border-success/20 text-success">
          {state.success}
        </p>
      )}
      {state.password && (
        <Credentials username={state.username} password={state.password} />
      )}
    </div>
  )
}

/**
 * Shown once, straight after a password is generated.
 *
 * Passwords are stored as scrypt hashes, so this is the only moment the plain
 * value exists — it cannot be looked up later, only replaced.
 */
export function Credentials({
  username,
  password,
}: {
  username?: string
  password: string
}) {
  const [copied, setCopied] = useState(false)

  const block = username
    ? `Username: ${username}\nPassword: ${password}`
    : password

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the text is selectable either way.
    }
  }

  return (
    <div className="rounded-lg border border-primary/25 bg-primary/5 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm font-medium text-foreground">
          Send these to your client
        </p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy both"}
        </button>
      </div>

      <dl className="space-y-2 text-sm">
        {username && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 text-muted-foreground">Username</dt>
            <dd className="font-mono font-semibold text-foreground select-all break-all">
              {username}
            </dd>
          </div>
        )}
        <div className="flex gap-3">
          <dt className="w-20 shrink-0 text-muted-foreground">Password</dt>
          <dd className="font-mono font-semibold text-foreground select-all break-all">
            {password}
          </dd>
        </div>
      </dl>

      <p className="text-xs text-muted-foreground mt-3">
        Copy this now. The password is stored hashed and cannot be shown again —
        if it is lost, generate a new one.
      </p>
    </div>
  )
}

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  min,
  step,
  hint,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string | number
  placeholder?: string
  required?: boolean
  min?: number
  step?: string
  hint?: string
}) {
  const id = `field-${name}`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        autoComplete="off"
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
      />
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}
