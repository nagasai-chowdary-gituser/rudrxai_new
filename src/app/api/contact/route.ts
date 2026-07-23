import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5 // max requests
const RATE_WINDOW = 60_000 // per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim().slice(0, 2000)
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const name = sanitize(body.name || "")
    const email = sanitize(body.email || "")
    const company = sanitize(body.company || "")
    const phone = sanitize(body.phone || "")
    const service = sanitize(body.service || "")
    const message = sanitize(body.message || "")

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
    }

    // Web3Forms Integration
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY
    if (!web3Key || web3Key === "your-web3forms-access-key") {
      console.warn("WEB3FORMS_ACCESS_KEY is not configured in .env")
      return NextResponse.json({ success: true, note: "Web3Forms key not configured yet" })
    }

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        access_key: web3Key.trim(),
        name, email,
        company: company || "N/A",
        phone: phone || "N/A",
        service: service || "N/A",
        message,
        subject: `New Contact from ${name} — RudrxAI`,
        from_name: "RudrxAI Contact Form",
      })
    })

    const web3Result = await web3Response.json()

    if (!web3Result.success) {
      console.error("Web3Forms submission failed:", web3Result)
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Contact submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
