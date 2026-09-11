"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PatternLock } from "./pattern-lock"
import { ForestScene } from "./forest-scene"

/**
 * The den: four torches beside the stone, then three doors deeper inside.
 *
 * Nothing here knows any answer. Every torch and every keystroke is decided by
 * /api/session, which replies only "ok" or refuses. A refusal at any point wipes
 * the knock cookies too, so a wrong answer sends you all the way back to the
 * footer — not back one step.
 */

type Stage = "torches" | "username" | "password" | "pattern" | "rejected" | "locked"

const TORCHES = [
  { name: "red", lit: "#ef4444", glow: "rgba(239,68,68,0.55)" },
  { name: "blue", lit: "#3b82f6", glow: "rgba(59,130,246,0.55)" },
  { name: "yellow", lit: "#fbbf24", glow: "rgba(251,191,36,0.55)" },
  { name: "green", lit: "#22c55e", glow: "rgba(34,197,94,0.55)" },
]

const DEPTH: Record<string, 0 | 1 | 2 | 3> = {
  torches: 0,
  username: 1,
  password: 2,
  pattern: 3,
}

/** A torch bracketed to the rock beside the cave mouth. */
function Torch({
  color,
  disabled,
  onClick,
}: {
  color: (typeof TORCHES)[number]
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={`${color.name} torch`}
      className="group relative flex flex-col items-center disabled:opacity-50 transition-transform hover:-translate-y-1"
    >
      {/* Flame */}
      <span
        className="block w-7 h-10 rounded-full blur-[3px] animate-pulse"
        style={{
          background: `radial-gradient(ellipse at 50% 70%, ${color.lit} 0%, ${color.glow} 55%, transparent 75%)`,
        }}
      />
      {/* Halo on the rock behind it */}
      <span
        className="absolute -top-3 w-20 h-20 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: color.glow }}
      />
      {/* Sconce */}
      <span className="block w-3 h-12 rounded-sm bg-gradient-to-b from-[#4b3a2a] to-[#241b14]" />
      <span className="block w-8 h-1.5 rounded-full bg-[#3a2d22]" />
    </button>
  )
}

/** A stone door frame that the current challenge sits inside. */
function StoneDoor({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="w-full max-w-sm rounded-t-[3rem] border border-[#3b443e]/70 bg-[#0b0f0d]/85 backdrop-blur-sm px-7 pt-10 pb-8 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-amber-200/45 text-center mb-2">
        {label}
      </p>
      <h2 className="text-xl font-bold text-amber-50 text-center mb-7">{title}</h2>
      {children}
    </div>
  )
}

export function DenGate() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>("torches")
  const [busy, setBusy] = useState(false)
  const [doorOpen, setDoorOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const reject = () => {
    setStage("rejected")
    setTimeout(() => router.replace("/"), 1600)
  }

  const attempt = async (step: string, value: string | number[], next: Stage) => {
    if (busy) return
    setBusy(true)

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, value }),
      })

      const data = await res.json().catch(() => ({ ok: false }))

      if (res.status === 429 || data.locked) {
        setStage("locked")
        return
      }

      if (!data.ok) {
        reject()
        return
      }

      if (data.done) {
        router.replace("/king")
        router.refresh()
        return
      }

      setUsername("")
      setPassword("")

      if (step === "color") {
        // Let the door finish swinging before the camera moves through it.
        setDoorOpen(true)
        setTimeout(() => setStage(next), 1150)
        return
      }

      setStage(next)
    } catch {
      reject()
    } finally {
      setBusy(false)
    }
  }

  if (stage === "rejected") {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center animate-[denFlash_1.6s_ease-out]">
        <p className="text-4xl md:text-6xl font-bold tracking-tight text-black">
          go to hell
        </p>
        <style>{`@keyframes denFlash{0%{opacity:0}8%{opacity:1}100%{opacity:1}}`}</style>
      </div>
    )
  }

  const depth = stage === "locked" ? 1 : DEPTH[stage]

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <ForestScene depth={depth} doorOpen={doorOpen} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end pb-[12vh] px-6">
        {stage === "locked" && (
          <div className="max-w-md text-center rounded-2xl border border-[#3b443e]/70 bg-[#0b0f0d]/90 p-8">
            <h2 className="text-2xl font-bold text-amber-200 mb-3">The den is sealed</h2>
            <p className="text-amber-100/70 text-sm leading-relaxed">
              Too many failed attempts from this address. Try again in fifteen minutes.
            </p>
          </div>
        )}

        {stage === "torches" && !doorOpen && (
          <div className="w-full max-w-3xl">
            {/* Torches sit either side of the cave mouth, bracketed to the rock */}
            <div className="flex items-end justify-center gap-10 sm:gap-20 md:gap-32">
              <div className="flex items-end gap-6 sm:gap-10">
                {TORCHES.slice(0, 2).map((color) => (
                  <Torch
                    key={color.name}
                    color={color}
                    disabled={busy}
                    onClick={() => attempt("color", color.name, "username")}
                  />
                ))}
              </div>
              <div className="flex items-end gap-6 sm:gap-10">
                {TORCHES.slice(2).map((color) => (
                  <Torch
                    key={color.name}
                    color={color}
                    disabled={busy}
                    onClick={() => attempt("color", color.name, "username")}
                  />
                ))}
              </div>
            </div>

            <p className="text-center text-[0.65rem] uppercase tracking-[0.35em] text-amber-200/35 mt-10">
              One torch opens the stone
            </p>
          </div>
        )}

        {(stage === "username" || stage === "password") && (
          <StoneDoor
            label={stage === "username" ? "First door" : "Second door"}
            title={stage === "username" ? "Who approaches?" : "Speak the word"}
          >
            <form
              onSubmit={(event) => {
                event.preventDefault()
                if (stage === "username") {
                  attempt("username", username, "password")
                } else {
                  attempt("password", password, "pattern")
                }
              }}
            >
              <input
                key={stage}
                type={stage === "username" ? "text" : "password"}
                autoFocus
                autoComplete="off"
                spellCheck={false}
                value={stage === "username" ? username : password}
                onChange={(event) =>
                  stage === "username"
                    ? setUsername(event.target.value)
                    : setPassword(event.target.value)
                }
                className="w-full bg-black/50 border border-amber-200/20 rounded-lg px-4 py-3 text-amber-50 text-center tracking-wide focus:outline-none focus:border-amber-300/60 transition-colors"
                aria-label={stage === "username" ? "Username" : "Password"}
              />
              <button
                type="submit"
                disabled={busy}
                className="mt-5 w-full rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold py-3 transition-colors disabled:opacity-50"
              >
                {busy ? "..." : "Push the door"}
              </button>
            </form>
          </StoneDoor>
        )}

        {stage === "pattern" && (
          <StoneDoor label="Third door" title="Trace the sigil">
            <PatternLock
              disabled={busy}
              onComplete={(pattern) => attempt("pattern", pattern, "pattern")}
            />
          </StoneDoor>
        )}
      </div>
    </div>
  )
}
