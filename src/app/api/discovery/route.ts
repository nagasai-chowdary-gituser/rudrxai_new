import { NextResponse } from "next/server"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"
import { isValidEmail, sanitize, submitToWeb3Forms } from "@/lib/web3forms"

export const dynamic = "force-dynamic"

const RATE_LIMIT = 5 // max submissions
const RATE_WINDOW = 60_000 // per minute per IP

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    if (isRateLimited(`discovery:${ip}`, { limit: RATE_LIMIT, windowMs: RATE_WINDOW })) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Honeypot — see /api/contact.
    if (sanitize(body.website)) {
      return NextResponse.json({ success: true })
    }

    const fullName = sanitize(body.fullName, 200)
    const email = sanitize(body.email, 320)
    const company = sanitize(body.company, 200)
    const role = sanitize(body.role, 200)
    const industry = sanitize(body.industry, 100)
    const companySize = sanitize(body.companySize, 50)
    const budget = sanitize(body.budget, 100)
    const timeline = sanitize(body.timeline, 100)
    const challenges = sanitize(body.challenges)
    const currentStack = sanitize(body.currentStack)
    const aiExperience = sanitize(body.aiExperience, 200)
    const preferredDate = sanitize(body.preferredDate, 50)
    const preferredTime = sanitize(body.preferredTime, 50)

    if (!fullName || !email || !company) {
      return NextResponse.json(
        { error: "Full name, email, and company are required." },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid business email address." },
        { status: 400 }
      )
    }

    const result = await submitToWeb3Forms({
      name: fullName,
      email,
      company,
      role: role || "N/A",
      industry: industry || "N/A",
      company_size: companySize || "N/A",
      budget: budget || "N/A",
      timeline: timeline || "N/A",
      challenges: challenges || "N/A",
      current_stack: currentStack || "N/A",
      ai_experience: aiExperience || "N/A",
      preferred_date: preferredDate || "N/A",
      preferred_time: preferredTime || "N/A",
      subject: `Discovery Call Request from ${fullName} — Rudrova Labs`,
      from_name: "Rudrova Labs Discovery Form",
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Discovery submission error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
