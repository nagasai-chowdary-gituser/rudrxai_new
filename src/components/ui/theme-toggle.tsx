"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  // resolvedTheme, not theme: with enableSystem the stored value can be
  // "system", which made the icon and the first click both wrong.
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="w-4 h-4" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all cursor-pointer"
      aria-label={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  )
}
