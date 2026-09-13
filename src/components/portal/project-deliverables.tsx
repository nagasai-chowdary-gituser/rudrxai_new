import { PackageCheck } from "lucide-react"
import type { Deliverable } from "@/lib/deliverables-store"

/**
 * What the client is getting, as a numbered list.
 *
 * Read-only, and hidden entirely until the admin adds the first item — an
 * empty "Deliverables" card would just look unfinished.
 */
export function ProjectDeliverables({ items }: { items: Deliverable[] }) {
  if (items.length === 0) return null

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
        <PackageCheck className="w-5 h-5 text-primary shrink-0" />
        Deliverables
      </h2>
      <p className="text-sm text-muted-foreground mt-1 mb-5">
        What this project includes.
      </p>

      <ol className="space-y-2.5">
        {items.map((item, index) => (
          <li key={item.id} className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-md bg-primary/10 text-primary grid place-items-center text-xs font-bold tabular-nums">
              {index + 1}
            </span>
            <span className="text-foreground leading-relaxed break-words pt-0.5">
              {item.text}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
