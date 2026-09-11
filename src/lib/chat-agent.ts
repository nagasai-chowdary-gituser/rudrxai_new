import { retrieveRelevantKnowledge, buildRAGContext } from "./rag"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface AgentResponse {
  message: string
  intent: string
  bookingData?: {
    name?: string
    email?: string
    company?: string
    preferredTime?: string
  }
}

/* ═══════════════════════════════════════════
   INTENT DETECTION — comprehensive keywords
   ═══════════════════════════════════════════ */
function detectIntent(msg: string): string {
  const l = msg.toLowerCase()

  // Greetings
  if (/^(hi|hello|hey|hii|hola|namaste|good\s*(morning|afternoon|evening)|what'?s?\s*up|yo)\b/.test(l))
    return "greeting"

  // Farewell
  if (/\b(bye|goodbye|thanks|thank\s*you|see\s*you|take\s*care|that'?s?\s*all)\b/.test(l))
    return "farewell"

  // Booking
  if (/\b(book|schedule|call|meeting|appointment|demo|discovery|consultation|talk\s*to\s*(someone|team|human))\b/.test(l))
    return "book_call"

  // Pricing
  if (/\b(price|pricing|cost|how\s*much|budget|afford|cheap|expensive|rate|charge|fee|quote|estimate|package|plan|tier|inr|rupee|₹)\b/.test(l))
    return "pricing_inquiry"

  // Services
  if (/\b(service|what\s*(do\s*you|can\s*you)\s*(do|offer|build|make|provide)|capabilities|offerings|solutions)\b/.test(l))
    return "services"

  // Website
  if (/\b(website|web\s*site|web\s*app|landing\s*page|wordpress|react|next\.?js|frontend|web\s*dev|web\s*development)\b/.test(l))
    return "website"

  // Chatbot
  if (/\b(chatbot|chat\s*bot|ai\s*bot|support\s*bot|customer\s*support\s*ai|automated\s*chat|live\s*chat)\b/.test(l))
    return "chatbot"

  // Dashboard
  if (/\b(dashboard|analytics|data\s*viz|visualization|report|bi\s*tool|admin\s*panel|crm)\b/.test(l))
    return "dashboard"

  // Voice agent
  if (/\b(voice|ivr|call\s*center|voice\s*ai|voice\s*agent|voice\s*bot|telephony|phone\s*ai|call\s*bot)\b/.test(l))
    return "voice_agent"

  // Portfolio
  if (/\b(portfolio|work|project|case\s*stud|example|client|showcase|past\s*work|previous\s*work)\b/.test(l))
    return "portfolio"

  // About
  if (/\b(about|who\s*(are|is)\s*(you|rudrx)|team|founder|company|history|story|mission|vision)\b/.test(l))
    return "about"

  // Contact
  if (/\b(contact|reach|email|phone|whatsapp|address|location|get\s*in\s*touch|connect)\b/.test(l))
    return "contact"

  // Timeline / delivery
  if (/\b(time|timeline|deadline|deliver|how\s*long|duration|turnaround|when|eta|days|weeks)\b/.test(l))
    return "timeline"

  // Technology
  if (/\b(tech|technology|stack|framework|language|tools|built\s*with|use|python|node|react|ai|ml|gpt)\b/.test(l))
    return "technology"

  // Process
  if (/\b(process|how\s*(do\s*you|does\s*it)\s*work|steps|methodology|approach|workflow|procedure)\b/.test(l))
    return "process"

  // Support
  if (/\b(support|help|maintenance|after\s*delivery|post\s*launch|bug|fix|update|warranty)\b/.test(l))
    return "support"

  // Comparison
  if (/\b(vs|versus|compare|better\s*than|different|why\s*(you|rudrx)|advantage|unique|special)\b/.test(l))
    return "comparison"

  // Payment
  if (/\b(pay|payment|upi|bank|transfer|emi|installment|advance|milestone|refund)\b/.test(l))
    return "payment"

  return "general_question"
}

/* ═══════════════════════════════════════════
   BOOKING INFO EXTRACTION
   ═══════════════════════════════════════════ */
function extractBookingInfo(message: string): Record<string, string | undefined> {
  const emailMatch = message.match(/[\w.+-]+@[\w-]+\.[\w.]+/)
  const info: Record<string, string | undefined> = {}
  if (emailMatch) info.email = emailMatch[0]
  return info
}

/* ═══════════════════════════════════════════
   SYSTEM PROMPT (for Groq API)
   ═══════════════════════════════════════════ */
function buildSystemPrompt(ragContext: string, intent: string): string {
  let intentInstructions = ""

  if (intent === "book_call") {
    intentInstructions = `The user wants to book a call. Guide them to provide: name, email, company, preferred time. Confirm and say team will reach out in 24 hours.`
  } else if (intent === "pricing_inquiry") {
    intentInstructions = `Give accurate pricing from knowledge base. Mention fixed-price, no hidden costs. Suggest a free quote via /contact.`
  }

  return `You are Rudrova Labs Assistant — a professional, friendly AI chatbot for Rudrova Labs, a digital solutions agency.

PERSONALITY: Professional, warm, concise. Use short paragraphs and bullet points. Never make up info.

KNOWLEDGE BASE:
${ragContext}

${intentInstructions}

RULES:
- Keep responses under 200 words
- Use markdown (bold, bullets) for readability
- For bookings, guide to /discovery
- For pricing, give tier info and suggest /contact
- If unsure, say "I'd recommend speaking with our team" and suggest /contact`
}

/* ═══════════════════════════════════════════
   MAIN AGENT — processes message
   ═══════════════════════════════════════════ */
export async function processMessage(
  userMessage: string,
  history: ChatMessage[]
): Promise<AgentResponse> {
  const intent = detectIntent(userMessage)
  const relevantKnowledge = retrieveRelevantKnowledge(userMessage)
  const ragContext = buildRAGContext(relevantKnowledge)
  const systemPrompt = buildSystemPrompt(ragContext, intent)
  const bookingInfo = extractBookingInfo(userMessage)

  const apiKey = process.env.GROQ_API_KEY

  if (apiKey && apiKey !== "your-groq-api-key") {
    try {
      // Only the system turn we build here may carry the "system" role — every
      // turn that came from the browser is forced to user/assistant.
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.slice(-10).map(m => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ]

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
        // Never let a hung upstream call hold the request open.
        signal: AbortSignal.timeout(20_000),
      })

      if (!res.ok) {
        console.error("Groq API returned", res.status, await res.text())
        return generateFallbackResponse(userMessage, intent, relevantKnowledge)
      }

      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content

      if (text) {
        return {
          message: text,
          intent,
          bookingData: intent === "book_call" ? bookingInfo : undefined,
        }
      }
    } catch (error) {
      console.error("Groq API error, falling back to built-in responses:", error)
    }
  }

  // Fallback: comprehensive built-in responses
  return generateFallbackResponse(userMessage, intent, relevantKnowledge)
}

/* ═══════════════════════════════════════════
   FALLBACK RESPONSES — works without API key
   ═══════════════════════════════════════════ */
function generateFallbackResponse(
  _userMessage: string,
  intent: string,
  relevantKnowledge: ReturnType<typeof retrieveRelevantKnowledge>
): AgentResponse {
  const responses: Record<string, string> = {
    greeting:
      "Hey there! 👋 Welcome to **Rudrova Labs**!\n\nI'm your AI assistant. I can help you with:\n\n• 💰 **Pricing** — plans from ₹3,999\n• 🛠️ **Services** — websites, chatbots, dashboards & more\n• 📁 **Portfolio** — see our past projects\n• 📞 **Contact** — get a free quote\n\nWhat would you like to know?",

    farewell:
      "Thanks for chatting with us! 🙏\n\nIf you need anything else, feel free to come back anytime. You can also:\n\n• 📞 [Contact us](/contact) for a free quote\n• 📧 Email us at **rudrovalabs@gmail.com**\n• 📱 Call/WhatsApp: **+91 7989317347**\n\nHave a great day! 🚀",

    book_call:
      "I'd love to help you book a discovery call! 🎯\n\nYou can schedule your **free 30-minute session** directly:\n\n👉 [Book Discovery Call](/discovery)\n\nOr share your **name, email, and company** here, and our team will reach out within **24 hours** to confirm.\n\nWhat works best for you?",

    pricing_inquiry:
      "Here's our pricing overview 💰\n\n| Service | Price Range |\n|---------|------------|\n| 🌐 Business Website | ₹3,999 – ₹9,999 |\n| 🤖 AI Chatbot | ₹4,999 – ₹19,999 |\n| 📊 AI Dashboard | ₹2,999 – ₹9,999 |\n| 🎙️ Voice AI Agent | ₹5,999 – ₹29,000 |\n| 🔧 Custom Platform | Custom Quote |\n\n✅ **Fixed-price** — no hidden costs, no hourly billing.\n\n👉 [View Full Pricing](/pricing) or [Get a Free Quote](/contact)",

    services:
      "Here's what we build at **Rudrova Labs** 🚀\n\n• 🌐 **Business Websites** — responsive, fast, SEO-optimized\n• 🤖 **AI Chatbots** — 24/7 customer support automation\n• 📊 **AI Dashboards** — real-time analytics & insights\n• 🎙️ **Voice AI Agents** — automated phone/call handling\n• 🏥 **Healthcare Platforms** — patient portals, telemedicine\n• 🏠 **Real Estate Solutions** — property listings, virtual tours\n• 🛒 **E-Commerce** — online stores with payment integration\n• 📚 **EdTech / LMS** — learning management systems\n• 🔧 **Custom Platforms** — tailored to your business\n\n👉 [Explore Services](/products) or [Get a Quote](/contact)",

    website:
      "We build stunning, production-ready **websites** 🌐\n\n• **Business websites** from ₹3,999\n• Mobile-responsive & SEO-optimized\n• Modern design with smooth animations\n• Fast loading with Next.js / React\n• Custom domains & deployment\n\nEvery website is built from scratch — no templates.\n\n👉 [View Portfolio](/portfolio) | [Get a Quote](/contact)",

    chatbot:
      "Our **AI Chatbots** handle customer support 24/7 🤖\n\n• Automated FAQs & lead capture\n• Multi-language support\n• Integration with WhatsApp, websites, apps\n• Smart escalation to human agents\n• Analytics dashboard included\n\n**Starting at ₹4,999**\n\n👉 [Learn More](/products) | [Get a Quote](/contact)",

    dashboard:
      "We create powerful **AI Dashboards** 📊\n\n• Real-time data visualization\n• Custom KPI tracking\n• Revenue, user & growth analytics\n• Export reports as PDF/Excel\n• Role-based access control\n\n**Starting at ₹2,999**\n\n👉 [View Examples](/portfolio) | [Get a Quote](/contact)",

    voice_agent:
      "Our **Voice AI Agents** automate phone interactions 🎙️\n\n• Inbound & outbound call handling\n• Appointment booking by voice\n• Natural language understanding\n• Call recording & analytics\n• Integration with existing phone systems\n\n**Starting at ₹5,999**\n\n👉 [Learn More](/products) | [Get a Quote](/contact)",

    portfolio:
      "Check out our recent work 🏆\n\n• 🏠 **PropertyNest** — AI real estate platform\n• 🏥 **MedConnect** — healthcare management\n• 🛒 **ShopSmart** — e-commerce with AI recommendations\n• 📊 **InsightIQ** — business analytics dashboard\n• 📚 **LearnHub** — EdTech LMS platform\n• 🤖 **SalesBot** — lead generation chatbot\n\n**50+ projects delivered** across 10+ industries.\n\n👉 [View Full Portfolio](/portfolio)",

    about:
      "**Rudrova Labs** is a digital solutions agency 🏢\n\n• 🚀 **50+ projects** delivered\n• 👥 **45+ happy clients** worldwide\n• ⏱️ **99.9% uptime** guarantee\n• 🌍 **Remote-first** — serving clients globally\n• 📧 **rudrovalabs@gmail.com**\n• 📱 **+91 7989317347**\n\nWe build websites, AI chatbots, dashboards, voice agents, and custom platforms for businesses of all sizes.\n\n👉 [Learn More About Us](/about)",

    contact:
      "Here's how to reach us 📞\n\n• 📧 **Email:** rudrovalabs@gmail.com\n• 📱 **Phone/WhatsApp:** +91 7989317347\n• 🌍 **Office:** Remote — Global\n• ⏰ **Response time:** Within 24 hours\n\nYou can also fill out the contact form for a **free quote**:\n\n👉 [Contact Us](/contact)",

    timeline:
      "Here are our typical delivery timelines ⏰\n\n| Project | Timeline |\n|---------|----------|\n| Business Website | 1–2 weeks |\n| AI Chatbot | 1–3 weeks |\n| AI Dashboard | 2–3 weeks |\n| Voice AI Agent | 2–4 weeks |\n| Custom Platform | 3–6 weeks |\n\nTimelines depend on complexity. We provide **guaranteed delivery dates** in our proposals.\n\n👉 [Get a Timeline Estimate](/contact)",

    technology:
      "Here's our technology stack 🛠️\n\n• **Frontend:** React, Next.js, TypeScript, Tailwind CSS\n• **Backend:** Node.js, Python, PostgreSQL\n• **AI/ML:** OpenAI, LangChain, HuggingFace, TensorFlow\n• **Voice:** Twilio, Deepgram, ElevenLabs\n• **Cloud:** AWS, Vercel, GCP\n• **Tools:** Git, Docker, CI/CD pipelines\n\nWe pick the best tech for your specific project.\n\n👉 [Learn More](/about)",

    process:
      "Our delivery process is simple and transparent 📋\n\n1️⃣ **Discovery** — Free consultation to understand your needs\n2️⃣ **Proposal** — Detailed scope, timeline, and fixed price\n3️⃣ **Design** — UI/UX mockups for your approval\n4️⃣ **Development** — Build with regular progress updates\n5️⃣ **Testing** — QA, performance & security testing\n6️⃣ **Launch** — Deployment & handover\n7️⃣ **Support** — Post-launch maintenance\n\n👉 [Start Your Project](/contact)",

    support:
      "We've got you covered after launch 🛡️\n\n• **30 days free support** after delivery\n• Bug fixes & minor updates included\n• Extended maintenance plans available\n• Priority support via WhatsApp/email\n• Regular security updates\n\nYour project doesn't end at launch — we're here for the long run.\n\n👉 [Contact Support](/contact)",

    comparison:
      "Why choose **Rudrova Labs**? 🏆\n\n• ✅ **Fixed pricing** — no hourly surprises\n• ✅ **Guaranteed timelines** — we commit and deliver\n• ✅ **Full-stack** — design, dev, AI, deployment\n• ✅ **Direct communication** — talk to the developers\n• ✅ **Post-launch support** — 30 days free\n• ✅ **Affordable** — websites from ₹3,999\n\nWe're not a faceless agency — we're your **tech partner**.\n\n👉 [See Our Work](/portfolio) | [Get a Quote](/contact)",

    payment:
      "Our payment process is flexible 💳\n\n• **50% advance** to start the project\n• **50% on delivery** — pay when you're satisfied\n• **UPI, Bank Transfer, or PayPal** accepted\n• No hidden fees or extra charges\n• Full invoice provided\n\nFor larger projects, we offer **milestone-based payments**.\n\n👉 [Discuss Your Project](/contact)",
  }

  // Check if we have a direct response for this intent
  if (responses[intent]) {
    return { message: responses[intent], intent }
  }

  // Try RAG knowledge base
  if (relevantKnowledge.length > 0) {
    const entry = relevantKnowledge[0]
    return {
      message: `${entry.content}\n\nWant to learn more? Feel free to ask, or [get in touch](/contact) with our team.`,
      intent,
    }
  }

  // Default fallback
  return {
    message: "Thanks for your question! I'm the **Rudrova Labs Assistant** 🤖\n\nI can help you with:\n\n• 🛠️ **Services** — Websites, Chatbots, Dashboards, Voice Agents\n• 💰 **Pricing** — Fixed-price plans from ₹3,999\n• 📁 **Portfolio** — 50+ projects across 10+ industries\n• 📞 **Contact** — Get a free quote\n• ⏰ **Timelines** — Delivery estimates\n• 🛡️ **Support** — Post-launch help\n\nJust ask me anything!",
    intent: "general_question",
  }
}
