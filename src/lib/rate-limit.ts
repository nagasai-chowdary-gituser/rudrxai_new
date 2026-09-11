/**
 * Small in-memory rate limiter for API routes.
 *
 * Note: state is per serverless instance, so this is a cheap first line of
 * defence against casual abuse — not a distributed guarantee. Move to Redis /
 * Upstash if you need hard limits across instances.
 */

type Bucket = { count: number; resetTime: number }

const buckets = new Map<string, Bucket>()

// Drop expired buckets so the map cannot grow without bound.
function prune(now: number) {
  if (buckets.size < 5000) return
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetTime) buckets.delete(key)
  }
}

/**
 * Best-effort client identifier. `x-forwarded-for` is a comma-separated list
 * where the FIRST entry is the original client, so take that one rather than
 * treating the whole header as an opaque key (which a spoofed header could
 * vary on every request to get a fresh bucket).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

export function isRateLimited(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): boolean {
  const now = Date.now()
  prune(now)

  const bucket = buckets.get(key)
  if (!bucket || now > bucket.resetTime) {
    buckets.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  bucket.count++
  return bucket.count > limit
}
