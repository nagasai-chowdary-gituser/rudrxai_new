"use client"

/**
 * A moonlit forest and a stone den, drawn entirely in SVG + CSS.
 *
 * No image files: bandwidth is the metered resource on Vercel's free tier, and
 * a photographic forest would be 300 KB–2 MB. This is a few KB of markup that
 * gzips to almost nothing and stays sharp on any screen.
 *
 * What makes it read as photographic rather than vector:
 *   - ragged, asymmetric tree silhouettes instead of clean triangles
 *   - aerial perspective: distant layers lose contrast and take the fog's hue
 *   - depth of field: far and foreground layers are blurred, mid-ground sharp
 *   - volumetric light shafts from the moon
 *   - film grain and a vignette over everything
 * All of it is procedural, so the cost is CPU at paint time, not bytes.
 */

// Deterministic pseudo-random: Math.random() would differ between the server
// and client render and trip a hydration mismatch.
function seeded(seed: number) {
  let value = seed % 2147483647
  if (value <= 0) value += 2147483646
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

/**
 * A conifer silhouette built as one ragged polygon. Branch tips droop and
 * jitter, and the two sides are generated independently, so no tree is
 * symmetrical — which is what kills the cartoon look.
 */
function conifer(random: () => number, height: number, width: number): string {
  const tiers = 15
  const gap = height / tiers
  const points: string[] = []

  const side = (sign: number) => {
    const collected: string[] = []
    for (let i = 0; i < tiers; i++) {
      const t = i / tiers
      const spread = width * Math.pow(1 - t, 1.25) * (0.72 + random() * 0.55)
      const y = -t * height
      const droop = gap * (0.15 + random() * 0.3)
      collected.push(`${(sign * spread).toFixed(1)},${(y + droop).toFixed(1)}`)
      collected.push(
        `${(sign * spread * (0.2 + random() * 0.18)).toFixed(1)},${(y - gap * 0.5).toFixed(1)}`
      )
    }
    return collected
  }

  points.push("0,6")
  points.push(...side(-1))
  points.push(`${(random() * 6 - 3).toFixed(1)},${(-height - gap * (0.6 + random())).toFixed(1)}`)
  points.push(...side(1).reverse())

  return points.join(" ")
}

type TreeSpec = { x: number; height: number; width: number; seed: number }

function makeTrees(seed: number, count: number, spread: number, h: number, w: number): TreeSpec[] {
  const random = seeded(seed)
  return Array.from({ length: count }, (_, index) => ({
    x: (index / count) * spread + random() * (spread / count) - spread / (count * 2),
    height: h * (0.68 + random() * 0.62),
    width: w * (0.75 + random() * 0.5),
    seed: seed + index * 977,
  }))
}

function TreeLayer({
  trees,
  fill,
  trunk,
}: {
  trees: TreeSpec[]
  fill: string
  trunk: string
}) {
  return (
    <>
      {trees.map((tree, index) => {
        const random = seeded(tree.seed)
        return (
          <g key={index} transform={`translate(${tree.x.toFixed(1)} 0)`}>
            {/* Tapered trunk, slightly off-vertical */}
            <path
              d={`M-${(tree.width * 0.05).toFixed(1)} 8 L-${(tree.width * 0.028).toFixed(1)} -${(tree.height * 0.5).toFixed(1)} L${(tree.width * 0.028).toFixed(1)} -${(tree.height * 0.5).toFixed(1)} L${(tree.width * 0.05).toFixed(1)} 8 Z`}
              fill={trunk}
            />
            <polygon points={conifer(random, tree.height, tree.width)} fill={fill} />
          </g>
        )
      })}
    </>
  )
}

export function ForestScene({
  depth = 0,
  doorOpen = false,
  night = true,
  onSunClick,
}: {
  depth?: 0 | 1 | 2 | 3
  doorOpen?: boolean
  /** Daylight until the sun is put down. */
  night?: boolean
  onSunClick?: () => void
}) {
  // The camera pushes into the cave mouth as the doors are cleared. Transform
  // and opacity only — both run on the compositor, so this stays smooth on a
  // phone without touching layout.
  const zoom = [1, 2.8, 5.6, 9.5][depth]
  // Going deeper should feel like walking into a torch-lit cave, not into a
  // blackout: a little shadow, and a warm glow that grows to carry the light.
  const dim = [0, 0.14, 0.22, 0.3][depth]
  const warmth = [0, 0.3, 0.45, 0.58][depth]

  const far = makeTrees(11, 22, 1500, 210, 62)
  const mid = makeTrees(53, 14, 1560, 330, 96)
  const near = makeTrees(211, 7, 1700, 470, 140)

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#03080a] pointer-events-none"
      aria-hidden={night ? "true" : undefined}
    >
      <div
        className="absolute inset-0 origin-[50%_76%] transition-[transform,filter] duration-[1600ms] ease-[cubic-bezier(0.55,0,0.3,1)] will-change-transform"
        style={{
          transform: `scale(${zoom})`,
          // Everything below is painted for night, so daylight is a global
          // brightness and saturation lift rather than a second set of colours.
          filter: night ? "none" : "brightness(2.05) saturate(1.35) contrast(0.92)",
        }}
      >
        <svg
          viewBox="0 0 1400 700"
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b2138" />
              <stop offset="38%" stopColor="#123544" />
              <stop offset="72%" stopColor="#1a444d" />
              <stop offset="100%" stopColor="#123033" />
            </linearGradient>

            {/* Aerial perspective: haze pools between the tree layers */}
            <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b4450" stopOpacity="0" />
              <stop offset="65%" stopColor="#1b4450" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1b4450" stopOpacity="0.72" />
            </linearGradient>

            <linearGradient id="groundMist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#23505c" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#23505c" stopOpacity="0" />
            </linearGradient>

            {/* Daylight sky, crossfaded over the night one */}
            <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f8fd0" />
              <stop offset="45%" stopColor="#7cbbe4" />
              <stop offset="78%" stopColor="#bcdcf0" />
              <stop offset="100%" stopColor="#e4eedd" />
            </linearGradient>

            <radialGradient id="sunGlow">
              <stop offset="0%" stopColor="#fffbe8" stopOpacity="1" />
              <stop offset="14%" stopColor="#ffe89a" stopOpacity="0.72" />
              <stop offset="42%" stopColor="#ffd166" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ffce5c" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="sunShaft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff6d5" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#fff6d5" stopOpacity="0" />
            </linearGradient>

            <radialGradient id="moonGlow">
              <stop offset="0%" stopColor="#dfeeff" stopOpacity="0.85" />
              <stop offset="22%" stopColor="#9dc3dd" stopOpacity="0.24" />
              <stop offset="60%" stopColor="#6f9ab5" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#6f9ab5" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cfe6f7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#cfe6f7" stopOpacity="0" />
            </linearGradient>

            {/* Procedural rock: fractal noise roughens the silhouette and lights
                it from the upper left. Cheaper than any texture download. */}
            <filter id="rock" x="-12%" y="-12%" width="124%" height="124%">
              <feTurbulence type="fractalNoise" baseFrequency="0.022 0.035" numOctaves="3" seed="17" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="18" xChannelSelector="R" yChannelSelector="G" result="rough" />
              <feDiffuseLighting in="n" lightingColor="#7e8c85" surfaceScale="2.8" diffuseConstant="0.9" result="lit">
                <feDistantLight azimuth="228" elevation="52" />
              </feDiffuseLighting>
              <feComposite in="lit" in2="rough" operator="in" result="tex" />
              <feBlend in="rough" in2="tex" mode="multiply" />
            </filter>

            {/* Wood grain: noise stretched along one axis reads as sawn timber.
                Baked into a pattern rather than used as a filter on the door,
                because the door animates and a filter would re-rasterise on
                every frame. */}
            <filter id="woodTex" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9 0.012" numOctaves="4" seed="5" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" result="rough" />
              <feDiffuseLighting in="n" lightingColor="#6b4f34" surfaceScale="1.4" diffuseConstant="1" result="lit">
                <feDistantLight azimuth="210" elevation="62" />
              </feDiffuseLighting>
              <feComposite in="lit" in2="rough" operator="in" result="tex" />
              <feBlend in="rough" in2="tex" mode="multiply" />
            </filter>

            <pattern id="wood" width="260" height="220" patternUnits="userSpaceOnUse">
              <rect width="260" height="220" fill="#3d2c1d" />
              <rect width="260" height="220" filter="url(#woodTex)" opacity="0.62" />
            </pattern>

            <linearGradient id="iron" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a5157" />
              <stop offset="35%" stopColor="#22282c" />
              <stop offset="100%" stopColor="#14181b" />
            </linearGradient>

            <radialGradient id="mouth" cx="50%" cy="90%" r="76%">
              <stop offset="0%" stopColor="#54402a" />
              <stop offset="38%" stopColor="#2a1d11" />
              <stop offset="72%" stopColor="#120c07" />
              <stop offset="100%" stopColor="#070503" />
            </radialGradient>

            <radialGradient id="firelight" cx="50%" cy="96%" r="72%">
              <stop offset="0%" stopColor="#ffc061" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.42" />
              <stop offset="70%" stopColor="#b45309" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>

            <clipPath id="skyClip">
              <rect width="1400" height="700" />
            </clipPath>
          </defs>

          <rect width="1400" height="700" fill="url(#sky)" />

          {/* Daylight sky sits on top and fades away when the sun goes down */}
          <rect
            width="1400"
            height="700"
            fill="url(#skyDay)"
            style={{ opacity: night ? 0 : 1, transition: "opacity 2000ms ease-in-out" }}
          />

          {/* Moon and its scattering halo */}
          <g
            clipPath="url(#skyClip)"
            style={{ opacity: night ? 1 : 0, transition: "opacity 2000ms ease-in-out" }}
          >
            <circle cx="1090" cy="118" r="220" fill="url(#moonGlow)" />
            <circle cx="1090" cy="118" r="30" fill="#f4f9ff" opacity="0.95" />
            <circle cx="1090" cy="118" r="30" fill="#cfe0ef" opacity="0.35" />

            {/* Volumetric shafts angling down from the moon */}
            <g style={{ mixBlendMode: "screen" }} opacity="0.5">
              {[-26, -17, -9, 2, 11].map((angle, index) => (
                <polygon
                  key={index}
                  points={`1090,118 ${1040 + index * 26},700 ${1120 + index * 26},700`}
                  fill="url(#shaft)"
                  transform={`rotate(${angle} 1090 118)`}
                  style={{ filter: "blur(14px)" }}
                />
              ))}
            </g>
          </g>

          {/* The sun. Clicking it brings the night — the only thing on this
              screen that does anything while it is still up. */}
          <g
            clipPath="url(#skyClip)"
            style={{ opacity: night ? 0 : 1, transition: "opacity 1400ms ease-in-out" }}
          >
            <g style={{ mixBlendMode: "screen" }} opacity="0.75">
              {[-30, -18, -6, 6, 18].map((angle, index) => (
                <polygon
                  key={index}
                  points={`1090,118 ${1020 + index * 30},700 ${1130 + index * 30},700`}
                  fill="url(#sunShaft)"
                  transform={`rotate(${angle} 1090 118)`}
                  style={{ filter: "blur(18px)" }}
                />
              ))}
            </g>
            <circle cx="1090" cy="118" r="300" fill="url(#sunGlow)" />
            <g
              onClick={night ? undefined : onSunClick}
              style={{
                cursor: night ? "default" : "pointer",
                pointerEvents: night ? "none" : "auto",
              }}
            >
              {/* Generous hit area around the disc */}
              <circle cx="1090" cy="118" r="120" fill="transparent" />
              <circle cx="1090" cy="118" r="46" fill="#fffdf2" />
              <circle cx="1090" cy="118" r="62" fill="#ffe9a8" opacity="0.5">
                <animate
                  attributeName="r"
                  values="62;70;62"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>

          {/* ---- Layer 1: distant treeline. Low contrast, fog-tinted, soft. ---- */}
          <g transform="translate(-50 560)" opacity="0.5" style={{ filter: "blur(2.4px)" }}>
            <TreeLayer trees={far} fill="#2a5b68" trunk="#24505c" />
          </g>
          <rect y="330" width="1400" height="270" fill="url(#haze)" />

          {/* ---- Layer 2: mid treeline, the sharp one ---- */}
          <g transform="translate(-70 622)" opacity="0.94">
            <TreeLayer trees={mid} fill="#12303a" trunk="#0d242d" />
          </g>

          {/* Ground */}
          <path d="M0 620 Q 340 596, 700 612 T 1400 628 L1400 700 L0 700 Z" fill="#0b1a1f" />
          <rect y="560" width="1400" height="150" fill="url(#groundMist)" />

          {/* ---------------- the stone den ---------------- */}
          <g transform="translate(700 634)">
            <path
              d="M-320 0 C -312 -158, -226 -300, -96 -342 C 26 -382, 160 -342, 236 -248 C 298 -172, 320 -84, 320 0 Z"
              fill="#2b322e"
              filter="url(#rock)"
            />
            <ellipse cx="-262" cy="-16" rx="96" ry="36" fill="#232925" filter="url(#rock)" />
            <ellipse cx="268" cy="-12" rx="80" ry="30" fill="#232925" filter="url(#rock)" />
            <ellipse cx="-160" cy="-8" rx="58" ry="22" fill="#1e2320" filter="url(#rock)" />

            {/* Lintel over the opening */}
            <path d="M-136 -206 L136 -206 L118 -178 L-118 -178 Z" fill="#3b443d" filter="url(#rock)" />

            {/* The opening, and the dark behind the door */}
            <path d="M-116 0 C -116 -116, -70 -192, 0 -192 C 70 -192, 116 -116, 116 0 Z" fill="url(#mouth)" />
            <path
              d="M-116 0 C -116 -116, -70 -192, 0 -192 C 70 -192, 116 -116, 116 0 Z"
              fill="url(#firelight)"
              style={{
                opacity: doorOpen ? 1 : 0.25,
                transition: "opacity 1400ms ease-out",
              }}
            />

            {/* ---- the door ---- */}
            <g
              style={{
                transformBox: "fill-box",
                transformOrigin: "left center",
                transform: doorOpen ? "scaleX(0.14) translateX(-6px)" : "scaleX(1)",
                filter: doorOpen ? "brightness(0.3)" : "brightness(1)",
                transition:
                  "transform 1500ms cubic-bezier(0.5,0,0.2,1), filter 1500ms ease-out",
                willChange: "transform",
              }}
            >
              {/* Planks */}
              <path
                d="M-104 -4 C -104 -110, -62 -180, 0 -180 C 62 -180, 104 -110, 104 -4 Z"
                fill="url(#wood)"
              />
              {/* Plank seams */}
              {[-70, -35, 0, 35, 70].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1={-176 + Math.abs(x) * 0.42}
                  x2={x}
                  y2={-4}
                  stroke="#22180f"
                  strokeWidth="2"
                  opacity="0.65"
                />
              ))}
              {/* Iron bands with rivets */}
              {[-140, -70].map((y) => (
                <g key={y}>
                  <rect x="-100" y={y} width="200" height="15" rx="2" fill="url(#iron)" />
                  {[-86, -52, -18, 16, 50, 84].map((x) => (
                    <circle key={x} cx={x} cy={y + 7.5} r="3.4" fill="#5a6268" opacity="0.9" />
                  ))}
                </g>
              ))}
              {/* Ring handle */}
              <circle cx="66" cy="-92" r="13" fill="none" stroke="url(#iron)" strokeWidth="6" />
              <rect x="60" y="-108" width="12" height="10" rx="2" fill="#2b3236" />
            </g>
          </g>

          {/* ---- Layer 3: foreground trunks, heavily blurred like a real lens ---- */}
          <g transform="translate(-150 740)" opacity="0.97" style={{ filter: "blur(7px)" }}>
            <TreeLayer trees={near.slice(0, 4)} fill="#030a0c" trunk="#020608" />
          </g>
          <g transform="translate(1020 740)" opacity="0.97" style={{ filter: "blur(7px)" }}>
            <TreeLayer trees={near.slice(4)} fill="#030a0c" trunk="#020608" />
          </g>
        </svg>
      </div>

      {/* Film grain — one small tiling noise texture, not a full-screen filter */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-[1600ms]"
        style={{
          opacity: night ? 0.16 : 0.06,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[1600ms]"
        style={{
          opacity: night ? 1 : 0.3,
          background:
            "radial-gradient(ellipse 82% 72% at 50% 58%, transparent 42%, rgba(0,0,0,0.34) 78%, rgba(0,0,0,0.62) 100%)",
        }}
      />

      {/* Firelight from deeper in the den, growing as you advance */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[1600ms]"
        style={{
          opacity: night ? warmth : 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 72%, rgba(255,180,94,0.55) 0%, rgba(214,122,32,0.3) 38%, rgba(90,44,10,0.12) 70%, transparent 100%)",
          mixBlendMode: "screen",
        }}
      />

      {/* A little shadow at the edges, not a blackout */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-[1600ms] pointer-events-none"
        style={{ opacity: dim }}
      />
    </div>
  )
}
