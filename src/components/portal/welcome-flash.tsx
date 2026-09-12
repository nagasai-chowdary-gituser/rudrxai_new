"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * A white screen greeting the client by name, then straight into the portal.
 *
 * Covers everything including the portal chrome, so the first thing after a
 * successful sign-in is their own name rather than a half-painted dashboard.
 */
export function WelcomeFlash({ name }: { name: string }) {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/portal/projects")
    }, 1900)
    return () => clearTimeout(timer)
  }, [router])

  const firstName = name.trim().split(/\s+/)[0] || name

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center px-6">
      <div className="text-center animate-[welcomeIn_700ms_ease-out]">
        <p className="text-lg md:text-xl font-medium tracking-[0.3em] uppercase text-neutral-400 mb-4">
          Welcome
        </p>
        <p className="text-4xl md:text-6xl font-bold font-heading tracking-tight text-neutral-900 break-words">
          {firstName}
        </p>
      </div>

      <style>{`
        @keyframes welcomeIn {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
