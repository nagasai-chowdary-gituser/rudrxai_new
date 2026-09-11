import { NextResponse } from "next/server"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"
import { isValidEmail, sanitize, submitToWeb3Forms } from "@/lib/web3forms"

export const dynamic = "force-dynamic"

const RATE_LIMIT = 5 // max submissions
const RATE_WINDOW = 60_000 // per minute per IP

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    if (isRateLimited(`contact:${ip}`, { limit: RATE_LIMIT, windowMs: RATE_WINDOW })) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Honeypot: a real user never fills a hidden field. Accept silently so bots
    // do not learn they were caught, but do not forward the submission.
    if (sanitize(body.website)) {
      return NextResponse.json({ success: true })
    }

    const name = sanitize(body.name, 200)
    const email = sanitize(body.email, 320)
    const company = sanitize(body.company, 200)
    const phone = sanitize(body.phone, 50)
    const service = sanitize(body.service, 100)
    const message = sanitize(body.message)

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    const result = await submitToWeb3Forms({
      name,
      email,
      company: company || "N/A",
      phone: phone || "N/A",
      service: service || "N/A",
      message,
      subject: `New Contact from ${name} — Rudrova Labs`,
      from_name: "Rudrova Labs Contact Form",
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    // Log the detail, return a generic message — internal errors are not for
    // the client.
    console.error("Contact submission error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
