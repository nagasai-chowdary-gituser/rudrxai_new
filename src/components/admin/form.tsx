"use client"

import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
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
        <div className="text-sm rounded-lg px-3 py-2 bg-primary/5 border border-primary/20">
          <p className="text-muted-foreground mb-1">
            Password — copy it now, it cannot be shown again:
          </p>
          <code className="font-mono font-bold text-foreground select-all break-all">
            {state.password}
          </code>
        </div>
      )}
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
