import { ProductIntegration } from "@/types/products"
import { StaggerContainer, StaggerItem } from "@/components/effects/fade-in"

// Brand-ish colours for the tiles. Keys are normalised integration names, so a
// tile always reflects what it is labelled — the old version keyed off
// `logoId`, and every product ships `logoId: "aws"`, which rendered an orange
// "A" for React, Python, FastAPI and everything else.
const BRAND_COLORS: Record<string, string> = {
  aws: "bg-orange-400",
  azure: "bg-blue-500",
  gcp: "bg-red-400",
  google: "bg-red-500",
  microsoft: "bg-blue-600",
  salesforce: "bg-sky-500",
  sap: "bg-blue-700",
  slack: "bg-purple-600",
  teams: "bg-indigo-600",
  jira: "bg-blue-500",
  hubspot: "bg-orange-500",
  servicenow: "bg-green-600",
  postgres: "bg-blue-400",
  postgresql: "bg-blue-400",
  snowflake: "bg-sky-400",
  oracle: "bg-red-600",
  zendesk: "bg-emerald-600",
  react: "bg-sky-500",
  nextjs: "bg-neutral-800",
  python: "bg-blue-500",
  fastapi: "bg-teal-600",
  node: "bg-green-600",
  nodejs: "bg-green-600",
  supabase: "bg-emerald-500",
  langchain: "bg-teal-500",
  openai: "bg-neutral-700",
  tensorflow: "bg-orange-500",
  pytorch: "bg-orange-600",
  docker: "bg-blue-500",
  kubernetes: "bg-indigo-500",
  mongodb: "bg-green-700",
  redis: "bg-red-500",
  stripe: "bg-indigo-600",
  twilio: "bg-red-500",
}

// Stable fallback palette so an unknown integration still gets a consistent
// colour across renders rather than a grey box.
const FALLBACK_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
]

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function colorFor(integration: ProductIntegration) {
  const byName = BRAND_COLORS[normalise(integration.name)]
  if (byName) return byName

  const byLogoId = BRAND_COLORS[normalise(integration.logoId || "")]
  if (byLogoId) return byLogoId

  let hash = 0
  for (const char of integration.name) {
    hash = (hash + char.charCodeAt(0)) % FALLBACK_COLORS.length
  }
  return FALLBACK_COLORS[hash]
}

export function IntegrationGallery({ integrations }: { integrations: ProductIntegration[] }) {
  if (!integrations || integrations.length === 0) return null

  return (
    <div className="mt-12">
      <h3 className="font-heading font-semibold text-lg text-foreground mb-6 text-center">
        Built with
      </h3>

      <StaggerContainer className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
        {integrations.map((integration) => (
          <StaggerItem key={integration.name}>
            <div className="flex flex-col items-center gap-3 group cursor-default">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform duration-300 group-hover:-translate-y-1 ${colorFor(
                  integration
                )}`}
                aria-hidden="true"
              >
                {integration.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {integration.name}
              </span>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}
