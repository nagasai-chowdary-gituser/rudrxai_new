/**
 * Web3Forms helpers shared by the contact and discovery endpoints.
 *
 * The access key is read from NEXT_PUBLIC_WEB3FORMS_KEY (Web3Forms access keys
 * are designed to be public, and the browser needs it for the direct-submit
 * path). WEB3FORMS_ACCESS_KEY is still accepted so older deployments keep
 * working.
 */

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

const PLACEHOLDER_KEYS = new Set([
  "your-web3forms-access-key",
  "your-access-key",
  "",
])

export function getWeb3FormsKey(): string | null {
  const key = (
    process.env.NEXT_PUBLIC_WEB3FORMS_KEY ||
    process.env.WEB3FORMS_ACCESS_KEY ||
    ""
  ).trim()

  if (!key || PLACEHOLDER_KEYS.has(key)) return null
  return key
}

/** Strip HTML tags and clamp length before anything is forwarded or emailed. */
export function sanitize(value: unknown, maxLength = 2000): string {
  if (typeof value !== "string") return ""
  return value.replace(/<[^>]*>/g, "").trim().slice(0, maxLength)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export type Web3FormsResult =
  | { ok: true }
  | { ok: false; status: number; error: string }

/**
 * POST a payload to Web3Forms and interpret the response defensively —
 * Web3Forms returns an HTML error page rather than JSON in some failure modes,
 * so never call .json() directly on it.
 */
export async function submitToWeb3Forms(
  payload: Record<string, string>
): Promise<Web3FormsResult> {
  const key = getWeb3FormsKey()
  if (!key) {
    // Misconfiguration must surface as a failure. Returning a fake success here
    // silently drops the lead, which is exactly what used to happen.
    console.error(
      "Web3Forms access key is not configured — set NEXT_PUBLIC_WEB3FORMS_KEY"
    )
    return {
      ok: false,
      status: 500,
      error:
        "Our form service is not configured right now. Please email us at rudrovalabs@gmail.com.",
    }
  }

  let response: Response
  try {
    response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Web3Forms sits behind Cloudflare, which answers unidentified
        // server-to-server calls with a 403 "Just a moment..." challenge page.
        // The browser path in lib/submit-lead.ts is therefore the primary one;
        // this route is a fallback that fails loudly rather than silently.
        "User-Agent": "RudrovaLabsWebsite/1.0 (+https://github.com/rudrovalabs)",
      },
      body: JSON.stringify({ ...payload, access_key: key }),
    })
  } catch (error) {
    console.error("Web3Forms request failed:", error)
    return {
      ok: false,
      status: 502,
      error:
        "We could not reach our form service. Please try again or email rudrovalabs@gmail.com.",
    }
  }

  const text = await response.text()
  let result: { success?: boolean; message?: string }

  try {
    result = JSON.parse(text)
  } catch {
    console.error(
      "Web3Forms returned a non-JSON response:",
      response.status,
      text.slice(0, 200)
    )
    return {
      ok: false,
      status: 502,
      error:
        "Our form service returned an unexpected response. Please email us at rudrovalabs@gmail.com.",
    }
  }

  if (!result.success) {
    console.error("Web3Forms submission rejected:", result)
    return {
      ok: false,
      status: 502,
      error: result.message || "Failed to send your message. Please try again.",
    }
  }

  return { ok: true }
}
