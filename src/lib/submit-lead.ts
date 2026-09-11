"use client"

import { WEB3FORMS_ENDPOINT } from "./web3forms"

/**
 * Submit a lead form from the browser.
 *
 * Primary path is a direct POST to Web3Forms (this is the path that has always
 * worked in production). If that fails — offline, a blocker extension eating
 * third-party form endpoints, or Web3Forms rejecting the request — we retry
 * through our own API route so the lead is not silently lost.
 *
 * Throws an Error with a user-presentable message when BOTH paths fail. Callers
 * must let that propagate to the UI: never show a success screen on failure.
 */
export async function submitLead(
  apiPath: "/api/contact" | "/api/discovery",
  payload: Record<string, string>
): Promise<void> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY?.trim()

  if (accessKey) {
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...payload, access_key: accessKey }),
      })

      // Web3Forms can answer with an HTML error page, so parse defensively.
      const text = await res.text()
      try {
        const data = JSON.parse(text) as { success?: boolean }
        if (data.success) return
      } catch {
        // fall through to the server-side retry below
      }
    } catch {
      // fall through to the server-side retry below
    }
  }

  // Fallback: let the server submit on our behalf.
  const res = await fetch(apiPath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  let data: { success?: boolean; error?: string } = {}
  try {
    data = await res.json()
  } catch {
    // keep the generic message below
  }

  if (!res.ok || !data.success) {
    throw new Error(
      data.error ||
        "We could not send your message. Please try again or email rudrovalabs@gmail.com."
    )
  }
}
