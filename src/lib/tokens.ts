/**
 * Signed, expiring tokens used for the admin gate steps and for the admin and
 * client session cookies.
 *
 * Implemented with Web Crypto (not node:crypto) so this module is safe to
 * import from Edge middleware as well as from Node server routes, and adds no
 * dependency to the bundle.
 */

const encoder = new TextEncoder()

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="))
  const bytes = new Uint8Array(new ArrayBuffer(binary.length))
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function getSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short — set it in .env")
  }
  return secret
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

export type TokenPayload = Record<string, string | number | boolean>

/** Sign a payload with an expiry, in seconds from now. */
export async function signToken(
  payload: TokenPayload,
  ttlSeconds: number
): Promise<string> {
  const body = { ...payload, exp: Date.now() + ttlSeconds * 1000 }
  const encoded = base64UrlEncode(encoder.encode(JSON.stringify(body)))
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getKey(),
    encoder.encode(encoded)
  )
  return `${encoded}.${base64UrlEncode(new Uint8Array(signature))}`
}

/**
 * Verify a token's signature and expiry. Returns null for anything that is
 * malformed, tampered with, or expired — callers treat null as "denied".
 */
export async function verifyToken<T extends TokenPayload>(
  token: string | undefined | null
): Promise<(T & { exp: number }) | null> {
  if (!token) return null

  const parts = token.split(".")
  if (parts.length !== 2) return null

  const [encoded, signature] = parts

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await getKey(),
      base64UrlDecode(signature),
      encoder.encode(encoded)
    )
    if (!valid) return null

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encoded)))
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null

    return payload
  } catch {
    return null
  }
}
