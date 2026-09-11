"use client"

import Link from "next/link"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

/**
 * Renders an assistant message.
 *
 * The previous hand-rolled renderer only understood bold and links, so the
 * pricing and timeline answers — which are markdown tables — reached users as
 * raw pipe characters.
 */
export function MessageContent({
  content,
  onNavigate,
}: {
  content: string
  onNavigate?: () => void
}) {
  return (
    <div className="space-y-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-2">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          code: ({ children }) => (
            <code className="px-1 py-0.5 rounded bg-background/60 text-[0.85em] font-mono">
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto">
              <table className="w-full text-xs border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-2 py-1 text-left font-semibold bg-background/50">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-2 py-1 align-top">{children}</td>
          ),
          a: ({ href, children }) => {
            const target = typeof href === "string" ? href : ""

            // Only ever follow same-site paths from a model-generated message:
            // a javascript:, data: or attacker-chosen external URL must not
            // become a live link in our own UI.
            if (target.startsWith("/")) {
              return (
                <Link
                  href={target}
                  onClick={onNavigate}
                  className="text-primary underline hover:no-underline"
                >
                  {children}
                </Link>
              )
            }

            if (target.startsWith("mailto:") || target.startsWith("tel:")) {
              return (
                <a href={target} className="text-primary underline hover:no-underline">
                  {children}
                </a>
              )
            }

            return <span>{children}</span>
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}
