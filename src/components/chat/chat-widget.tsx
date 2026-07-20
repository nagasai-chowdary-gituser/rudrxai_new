"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Loader2, Sparkles, ArrowRight, Maximize2, Minimize2 } from "lucide-react"
import Link from "next/link"

interface Message {
  role: "user" | "assistant"
  content: string
}

const quickActions = [
  { label: "View Pricing", href: "/pricing" },
  { label: "Book a Call", href: "/discovery" },
  { label: "Our Products", href: "/products" },
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! 👋 I'm the Rudrova Labs Assistant. I can help you learn about our products, pricing, or book a discovery call.\n\nWhat can I help you with?"
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)

      // Initialize session if not exists
      if (!sessionId) {
        const newSessionId = Math.random().toString(36).substring(7)
        setSessionId(newSessionId)
      }
    }
  }, [isOpen, sessionId])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMessage: Message = { role: "user", content: trimmed }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: trimmed,
          history: messages.slice(-10),
        }),
      })

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.message || "Sorry, I couldn't process that. Please try again." }
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting right now. Please try again or [contact us directly](/contact)." }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Parse simple markdown (bold, links)
  function renderContent(text: string) {
    // Split by markdown links and bold
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
    return parts.map((part, i) => {
      // Bold
      const boldMatch = part.match(/^\*\*(.+)\*\*$/)
      if (boldMatch) {
        return <strong key={i} className="font-semibold">{boldMatch[1]}</strong>
      }
      // Link
      const linkMatch = part.match(/^\[(.+)\]\((.+)\)$/)
      if (linkMatch) {
        return (
          <Link key={i} href={linkMatch[2]} className="text-primary underline hover:no-underline" onClick={() => setIsOpen(false)}>
            {linkMatch[1]}
          </Link>
        )
      }
      // Plain text — convert newlines
      return part.split("\n").map((line, j) => (
        <span key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </span>
      ))
    })
  }

  return (
    <>
      {/* Chat Button with Saturn Rings */}
      <div className="fixed bottom-20 right-6 z-50">
        {/* Saturn Ring 1 — outer, bright */}
        <div className={`absolute top-1/2 left-1/2 w-[72px] h-[72px] rounded-full pointer-events-none ${isOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'} transition-all duration-500`}
          style={{ border: '2px solid rgba(124,58,237,0.6)', transform: 'translate(-50%, -50%) rotateX(65deg)', animation: 'saturn-spin 8s linear infinite' }}
        />
        {/* Saturn Ring 2 — middle, bright */}
        <div className={`absolute top-1/2 left-1/2 w-[84px] h-[84px] rounded-full pointer-events-none ${isOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'} transition-all duration-500`}
          style={{ border: '2px solid rgba(167,139,250,0.5)', transform: 'translate(-50%, -50%) rotateX(55deg) rotateZ(20deg)', animation: 'saturn-spin 6s linear infinite reverse' }}
        />
        {/* Saturn Ring 3 — outermost, subtle */}
        <div className={`absolute top-1/2 left-1/2 w-[96px] h-[96px] rounded-full pointer-events-none ${isOpen ? 'opacity-0' : 'opacity-80'} transition-all duration-500`}
          style={{ border: '1.5px solid rgba(124,58,237,0.35)', transform: 'translate(-50%, -50%) rotateX(70deg) rotateZ(-10deg)', animation: 'saturn-spin 10s linear infinite' }}
        />
        {/* Bright glow aura */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/25 blur-2xl pointer-events-none ${isOpen ? 'opacity-0' : 'opacity-80'} transition-all duration-500`} />

        {/* The button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${isOpen
            ? "bg-foreground text-background rotate-90 scale-90"
            : "bg-primary text-primary-foreground hover:scale-110 hover:shadow-primary/30"
            }`}
          aria-label="Chat with Rudrova Labs"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed z-50 bg-background border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 transition-all ${isFullScreen
          ? "inset-0 md:inset-4 md:rounded-2xl border"
          : "bottom-24 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-8rem)] rounded-2xl border"
          }`}>

          {/* Header */}
          <div className="p-4 border-b border-border bg-card flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-foreground">Rudrova Labs Assistant</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Online
              </div>
            </div>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors hidden md:block"
              aria-label="Toggle Fullscreen"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            {isFullScreen && (
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors whitespace-nowrap"
                >
                  {action.label} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border shrink-0">
            <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-muted-foreground">Powered by Rudrova Labs</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
