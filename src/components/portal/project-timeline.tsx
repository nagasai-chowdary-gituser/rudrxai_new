import { Check } from "lucide-react"
import type { ProjectStage } from "@/lib/stages-store"

/**
 * The transparency flow the client sees: a vertical line down the left with
 * one pill per stage beside it.
 *
 * Read-only. Stages are ticked by the admin; the client only ever sees where
 * their project has reached.
 */
export function ProjectTimeline({ stages }: { stages: ProjectStage[] }) {
  if (stages.length === 0) return null

  const done = stages.filter((stage) => stage.completed).length
  const percent = Math.round((done / stages.length) * 100)

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h2 className="font-heading font-bold text-lg text-foreground">Progress</h2>
        <span className="text-sm font-semibold text-primary tabular-nums">
          {done}/{stages.length}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Where your project has reached.
      </p>

      {/* Overall bar — the one-glance answer */}
      <div
        className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-7"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Project progress"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="relative">
        {stages.map((stage, index) => {
          const last = index === stages.length - 1
          // The connector belongs to the stage above it, and is only filled
          // when that stage is done — so the line grows with real progress.
          const connectorLit = stage.completed && stages[index + 1]?.completed

          return (
            <li key={stage.id} className="relative flex gap-4 pb-5 last:pb-0">
              {/* Vertical line */}
              {!last && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[15px] top-8 bottom-0 w-0.5 rounded-full transition-colors ${
                    connectorLit ? "bg-primary" : "bg-border"
                  }`}
                />
              )}

              {/* Marker */}
              <span
                className={`relative z-10 shrink-0 w-8 h-8 rounded-full grid place-items-center text-xs font-bold transition-colors ${
                  stage.completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground ring-1 ring-inset ring-border"
                }`}
              >
                {stage.completed ? <Check className="w-4 h-4" /> : index + 1}
              </span>

              {/* Pill */}
              <div
                className={`flex-1 min-w-0 rounded-xl px-4 py-2.5 transition-colors ${
                  stage.completed ? "bg-primary/8 border border-primary/20" : "bg-muted/50 border border-transparent"
                }`}
              >
                <p
                  className={`font-semibold leading-snug break-words ${
                    stage.completed ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {stage.label}
                </p>
                {stage.completed && stage.completed_at && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(stage.completed_at).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
