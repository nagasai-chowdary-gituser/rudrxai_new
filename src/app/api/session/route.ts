import { NextResponse } from "next/server"
import { getClientIp } from "@/lib/rate-limit"
import {
  checkAdminPattern,
  checkAdminUsername,
  checkGateColor,
  clearAttempts,
  isLockedOut,
  logAdminEvent,
  recordFailedAttempt,
} from "@/lib/admin-auth"
import {
  clearGateStep,
  clearKnock,
  createAdminSession,
  getGateStep,
  getKnock,
  setGateStep,
  setKnock,
} from "@/lib/session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * The hidden entrance.
 *
 *   knock1   footer taps        → the 404 page starts listening
 *   knock2   taps on "again"    → the den will render
 *   color    a torch beside the den
 *   username / pattern
 *
 * Every stage is decided here, on the server. The browser is told only "ok" or
 * nothing at all, and each cleared stage is recorded in a signed, short-lived
 * cookie that the next stage requires — so no stage can be skipped, even by
 * crafting requests by hand.
 */

type Step = "knock1" | "knock2" | "night" | "color" | "username" | "pattern"

// The sun must be put down before any torch is touched. Enforced here rather
// than in the UI, so the order cannot be skipped by crafting a request.
//
// "password" is deliberately absent: the step was removed, so a request naming
// it is not a wrong password but an unknown step, and is refused as a 404 like
// any other nonsense.
const GATE_ORDER: Record<string, number> = {
  night: 0,
  color: 1,
  username: 2,
  pattern: 3,
}

function tapsRequired(name: "KNOCK_FOOTER_TAPS" | "KNOCK_AGAIN_TAPS"): number {
  const value = Number(process.env[name])
  return Number.isInteger(value) && value >= 3 && value <= 20 ? value : 5
}

/**
 * One response for every failure, and it is a 404 — the same thing this route
 * would say if it did not exist. Nothing distinguishes a wrong torch from a
 * wrong name, or a real endpoint from a dead one.
 */
function nothingHere() {
  return new NextResponse(null, { status: 404 })
}

export async function POST(request: Request) {
  const ip = getClientIp(request)

  try {
    const body = await request.json().catch(() => null)
    const step = body?.step as Step | undefined
    if (!step) return nothingHere()

    // ---------------------------------------------------------- knock stages
    if (step === "knock1" || step === "knock2") {
      const taps = Number(body.taps)
      const required = tapsRequired(
        step === "knock1" ? "KNOCK_FOOTER_TAPS" : "KNOCK_AGAIN_TAPS"
      )

      if (!Number.isInteger(taps) || taps < required) return nothingHere()

      // The second knock is only available to someone who cleared the first.
      if (step === "knock2" && (await getKnock()) < 1) return nothingHere()

      await setKnock(step === "knock1" ? 1 : 2)
      return NextResponse.json({ ok: true })
    }

    // ------------------------------------------------------------- the doors
    // Reaching any door at all requires having knocked through to the den.
    if ((await getKnock()) < 2) return nothingHere()

    if (await isLockedOut(ip)) {
      await clearGateStep()
      await clearKnock()
      return NextResponse.json({ ok: false, locked: true }, { status: 429 })
    }

    if (!(step in GATE_ORDER)) return nothingHere()

    // A door may only be attempted once every previous door has been cleared.
    const currentStep = await getGateStep()
    if (currentStep !== GATE_ORDER[step]) {
      await clearGateStep()
      await recordFailedAttempt(ip, `out-of-order:${step}`)
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    let passed = false

    if (step === "night") {
      // Nothing secret to check: this step exists to fix the order. Touching a
      // torch first arrives here as an out-of-order "color" and is refused
      // above, which is what sends the visitor to the flash screen.
      passed = true
    } else if (step === "color") {
      passed = typeof body.value === "string" && (await checkGateColor(body.value))
    } else if (step === "username") {
      passed = typeof body.value === "string" && (await checkAdminUsername(body.value))
    } else if (step === "pattern") {
      const pattern = Array.isArray(body.value)
        ? body.value.filter((n: unknown): n is number => typeof n === "number")
        : []
      passed = pattern.length > 0 && (await checkAdminPattern(pattern))
    }

    if (!passed) {
      // Any wrong answer throws away all progress — including the knocks, so a
      // failed attempt means starting again from the footer.
      await clearGateStep()
      await clearKnock()
      await recordFailedAttempt(ip, step)
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    if (step === "pattern") {
      await clearGateStep()
      await clearKnock()
      await clearAttempts(ip)
      await createAdminSession()
      await logAdminEvent("admin_login", undefined, ip)
      return NextResponse.json({ ok: true, done: true })
    }

    await setGateStep(GATE_ORDER[step] + 1)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Session route error:", error)
    await clearGateStep()
    return NextResponse.json(
      { ok: false, error: "unavailable" },
      { status: 500 }
    )
  }
}
