"use client"

import { useCallback, useRef, useState } from "react"

/**
 * Phone-style 9-dot pattern lock: press and drag across the dots, release to
 * submit. Works with mouse, touch and pen via pointer events.
 *
 * Dots are numbered left to right, top to bottom:
 *   1 2 3
 *   4 5 6
 *   7 8 9
 */

const VIEW = 300
const POSITIONS = [60, 150, 240]
const HIT_RADIUS = 40

const DOTS = Array.from({ length: 9 }, (_, index) => ({
  id: index + 1,
  x: POSITIONS[index % 3],
  y: POSITIONS[Math.floor(index / 3)],
}))

type Point = { x: number; y: number }

export function PatternLock({
  onComplete,
  disabled = false,
}: {
  onComplete: (pattern: number[]) => void
  disabled?: boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [cursor, setCursor] = useState<Point | null>(null)
  const drawing = useRef(false)

  /** Translate a client coordinate into the SVG's own coordinate space. */
  const toLocal = useCallback((clientX: number, clientY: number): Point | null => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    if (!rect.width || !rect.height) return null
    return {
      x: ((clientX - rect.left) / rect.width) * VIEW,
      y: ((clientY - rect.top) / rect.height) * VIEW,
    }
  }, [])

  const dotAt = useCallback((point: Point): number | null => {
    for (const dot of DOTS) {
      const dx = dot.x - point.x
      const dy = dot.y - point.y
      if (Math.sqrt(dx * dx + dy * dy) <= HIT_RADIUS) return dot.id
    }
    return null
  }, [])

  const handleDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (disabled) return
    const point = toLocal(event.clientX, event.clientY)
    if (!point) return

    drawing.current = true
    event.currentTarget.setPointerCapture(event.pointerId)

    const dot = dotAt(point)
    setSelected(dot ? [dot] : [])
    setCursor(point)
  }

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drawing.current || disabled) return
    const point = toLocal(event.clientX, event.clientY)
    if (!point) return

    setCursor(point)

    const dot = dotAt(point)
    if (dot) {
      setSelected((prev) => (prev.includes(dot) ? prev : [...prev, dot]))
    }
  }

  const handleUp = () => {
    if (!drawing.current || disabled) return
    drawing.current = false
    setCursor(null)

    // Call the parent from the event handler, never from inside a setState
    // updater — React runs updaters during render, so notifying the parent
    // there sets state on another component mid-render.
    if (selected.length > 0) onComplete(selected)
  }

  const reset = () => {
    setSelected([])
    setCursor(null)
  }

  const lines = selected.slice(0, -1).map((id, index) => {
    const from = DOTS[id - 1]
    const to = DOTS[selected[index + 1] - 1]
    return { key: `${id}-${selected[index + 1]}`, from, to }
  })

  const lastDot = selected.length > 0 ? DOTS[selected[selected.length - 1] - 1] : null

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="w-[260px] h-[260px] touch-none select-none cursor-pointer"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        role="application"
        aria-label="Pattern lock: press and drag across the dots"
      >
        {/* Completed segments */}
        {lines.map((line) => (
          <line
            key={line.key}
            x1={line.from.x}
            y1={line.from.y}
            x2={line.to.x}
            y2={line.to.y}
            stroke="#fbbf24"
            strokeWidth={5}
            strokeLinecap="round"
          />
        ))}

        {/* Live segment following the cursor */}
        {lastDot && cursor && (
          <line
            x1={lastDot.x}
            y1={lastDot.y}
            x2={cursor.x}
            y2={cursor.y}
            stroke="#fbbf24"
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.6}
          />
        )}

        {DOTS.map((dot) => {
          const active = selected.includes(dot.id)
          return (
            <g key={dot.id}>
              {/* Generous invisible hit target */}
              <circle cx={dot.x} cy={dot.y} r={HIT_RADIUS} fill="transparent" />
              <circle
                cx={dot.x}
                cy={dot.y}
                r={active ? 18 : 14}
                fill={active ? "#fbbf24" : "rgba(255,255,255,0.12)"}
                stroke={active ? "#fde68a" : "rgba(255,255,255,0.35)"}
                strokeWidth={2}
                style={{ transition: "r 120ms ease-out" }}
              />
            </g>
          )
        })}
      </svg>

      <button
        type="button"
        onClick={reset}
        disabled={disabled || selected.length === 0}
        className="text-xs uppercase tracking-widest text-amber-200/60 hover:text-amber-200 disabled:opacity-30 transition-colors"
      >
        Clear
      </button>
    </div>
  )
}
