"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

/**
 * Tap targets that look like ordinary text.
 *
 * These take NO props on purpose. Props passed from a server component are
 * serialised into the RSC payload, which means the stage name, the tap count
 * and the destination would sit in the page source of every page on the site.
 * Keeping them as internal constants keeps the mechanism out of the HTML.
 *
 * None of this is the security — the three doors are. This only decides who
 * ever sees a door.
 */

const ENDPOINT = "/api/session"
const TAPS = 5
const WINDOW_MS = 5000

function useTapSequence(stage: string, destination: string) {
  const router = useRouter()
  const count = useRef(0)
  const first = useRef(0)
  const [busy, setBusy] = useState(false)

  return async () => {
    if (busy) return

    const now = Date.now()
    if (now - first.current > WINDOW_MS) {
      first.current = now
      count.current = 0
    }

    count.current += 1
    if (count.current < TAPS) return

    count.current = 0
    setBusy(true)

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: stage, taps: TAPS }),
      })

      if (res.ok) {
        router.push(destination)
        router.refresh()
      }
      // A refusal is silent: nothing on screen changes.
    } catch {
      // Silent by design.
    } finally {
      setBusy(false)
    }
  }
}

const style = {
  cursor: "inherit",
  userSelect: "none",
  WebkitUserSelect: "none",
} as const

/** The copyright year in the footer. */
export function FooterYear({ children }: { children: React.ReactNode }) {
  const onTap = useTapSequence("knock1", "/resources/archive")
  return (
    <span onClick={onTap} style={style}>
      {children}
    </span>
  )
}

/** The word "again" in the 404 copy. */
export function AgainWord({ children }: { children: React.ReactNode }) {
  const onTap = useTapSequence("knock2", "/den")
  return (
    <span onClick={onTap} style={style}>
      {children}
    </span>
  )
}
