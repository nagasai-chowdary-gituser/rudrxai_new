import "server-only"

import { cookies } from "next/headers"
import { signToken, verifyToken } from "./tokens"

/**
 * Session cookies for the admin panel and the client portal.
 *
 * Both are httpOnly and signed, so nothing the browser holds can be edited to
 * gain access — a tampered cookie fails signature verification and is treated
 * as signed out.
 */

export const ADMIN_COOKIE = "rl_s"
export const CLIENT_COOKIE = "rl_client"
export const GATE_COOKIE = "rl_gate"

// Two knock stages sit in front of the den: the footer taps, then the taps on
// the 404 page. Each is a signed cookie, so the den can 404 for anyone who has
// not performed the real gesture.
export const KNOCK_COOKIE = "rl_k"

// No countdown: the admin cookie is a BROWSER-SESSION cookie (no maxAge, no
// expires), so it exists only while the browser stays open and dies the moment
// it closes. This long signature lifetime is just a backstop on the token
// itself — nothing expires while you are working.
const ADMIN_TOKEN_LIFETIME = 30 * 24 * 60 * 60
const CLIENT_TTL = 7 * 24 * 60 * 60 // 7 days
const GATE_TTL = 5 * 60 // 5 minutes to walk through the doors
const KNOCK_TTL = 10 * 60 // 10 minutes to finish knocking and reach the den

const baseCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
}

// ------------------------------------------------------------------- admin

export async function createAdminSession(): Promise<void> {
  const token = await signToken({ role: "admin" }, ADMIN_TOKEN_LIFETIME)
  // Deliberately NO maxAge and NO expires — that makes it a session cookie:
  // closing the browser locks /admin again.
  ;(await cookies()).set(ADMIN_COOKIE, token, baseCookie)
}

export async function getAdminSession(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  const payload = await verifyToken<{ role: string }>(token)
  return payload?.role === "admin"
}

export async function clearAdminSession(): Promise<void> {
  ;(await cookies()).delete(ADMIN_COOKIE)
}

// ------------------------------------------------------------------ client

export async function createClientSession(clientId: string): Promise<void> {
  const token = await signToken({ role: "client", sub: clientId }, CLIENT_TTL)
  ;(await cookies()).set(CLIENT_COOKIE, token, { ...baseCookie, maxAge: CLIENT_TTL })
}

export async function getClientSession(): Promise<string | null> {
  const token = (await cookies()).get(CLIENT_COOKIE)?.value
  const payload = await verifyToken<{ role: string; sub: string }>(token)
  if (payload?.role !== "client" || typeof payload.sub !== "string") return null
  return payload.sub
}

export async function clearClientSession(): Promise<void> {
  ;(await cookies()).delete(CLIENT_COOKIE)
}

// -------------------------------------------------------------- gate steps

/**
 * Progress through the four doors. Each step is signed server-side, so the
 * pattern screen cannot be reached by anyone who has not already cleared the
 * colour, username and password — including by crafting requests by hand.
 */
export async function setGateStep(step: number): Promise<void> {
  const token = await signToken({ scope: "gate", step }, GATE_TTL)
  ;(await cookies()).set(GATE_COOKIE, token, { ...baseCookie, maxAge: GATE_TTL })
}

export async function getGateStep(): Promise<number> {
  const token = (await cookies()).get(GATE_COOKIE)?.value
  const payload = await verifyToken<{ scope: string; step: number }>(token)
  if (payload?.scope !== "gate" || typeof payload.step !== "number") return 0
  return payload.step
}

export async function clearGateStep(): Promise<void> {
  ;(await cookies()).delete(GATE_COOKIE)
}

// -------------------------------------------------------------- knock stages

/**
 * Knock progress: 1 = the footer gesture worked (the 404 page will listen),
 * 2 = the 404 gesture worked (the den will render). Anything else and both
 * pages behave exactly like a page that does not exist.
 */
export async function setKnock(stage: 1 | 2): Promise<void> {
  const token = await signToken({ scope: "knock", stage }, KNOCK_TTL)
  ;(await cookies()).set(KNOCK_COOKIE, token, { ...baseCookie, maxAge: KNOCK_TTL })
}

export async function getKnock(): Promise<number> {
  const token = (await cookies()).get(KNOCK_COOKIE)?.value
  const payload = await verifyToken<{ scope: string; stage: number }>(token)
  if (payload?.scope !== "knock" || typeof payload.stage !== "number") return 0
  return payload.stage
}

export async function clearKnock(): Promise<void> {
  ;(await cookies()).delete(KNOCK_COOKIE)
}
