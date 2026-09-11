import { processMessage, ChatMessage } from "@/lib/chat-agent"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const RATE_LIMIT = 20 // max messages
const RATE_WINDOW = 60_000 // per minute per IP
const MAX_MESSAGE_LENGTH = 2000
const MAX_HISTORY = 10

/**
 * Only "user" and "assistant" turns may come from the browser. Accepting a
 * client-supplied "system" role would let anyone rewrite the assistant's
 * instructions by crafting a request.
 */
function sanitizeHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return []

  return history
    .filter(
      (entry): entry is { role: unknown; content: unknown } =>
        !!entry && typeof entry === "object"
    )
    .map((entry) => ({
      role: entry.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content:
        typeof entry.content === "string"
          ? entry.content.slice(0, MAX_MESSAGE_LENGTH)
          : "",
    }))
    .filter((entry) => entry.content.length > 0)
    .slice(-MAX_HISTORY)
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    if (isRateLimited(`chat:${ip}`, { limit: RATE_LIMIT, windowMs: RATE_WINDOW })) {
      return NextResponse.json(
        { error: "You're sending messages a bit fast. Please wait a moment." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const rawMessage = typeof body?.message === "string" ? body.message.trim() : ""

    if (!rawMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const message = rawMessage.slice(0, MAX_MESSAGE_LENGTH)
    const history = sanitizeHistory(body?.history)

    // Process message using built-in chat agent (RAG + Groq API / fallback)
    const response = await processMessage(message, history)

    return NextResponse.json({
      message: response.message,
      intent: response.intent,
      bookingData: response.bookingData,
    })
  } catch (error: unknown) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
