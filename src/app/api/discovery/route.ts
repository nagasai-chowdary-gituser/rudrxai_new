import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      fullName, email, company, role, industry, companySize,
      budget, timeline, challenges, currentStack, aiExperience,
      preferredDate, preferredTime
    } = body

    // Validate required fields
    if (!fullName || !email || !company) {
      return NextResponse.json(
        { error: "Full name, email, and company are required." },
        { status: 400 }
      )
    }

    // Web3Forms Integration
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY
    if (!web3Key || web3Key === "your-web3forms-access-key") {
      console.warn("WEB3FORMS_ACCESS_KEY is not configured in .env")
      return NextResponse.json({ success: true, note: "Web3Forms key not configured yet" })
    }

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        access_key: web3Key.trim(),
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
    })

    const web3Result = await web3Response.json()

    if (!web3Result.success) {
      console.error("Web3Forms discovery submission failed:", web3Result)
      return NextResponse.json({ error: "Failed to send request. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Discovery submission error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
