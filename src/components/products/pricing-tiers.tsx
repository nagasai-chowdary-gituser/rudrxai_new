import Link from "next/link"
import { ProductPricingTier } from "@/types/products"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export function PricingTiers({ tiers }: { tiers: ProductPricingTier[] }) {
  if (!tiers || tiers.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`relative bg-surface rounded-2xl p-8 border ${
            tier.isPopular
              ? "border-primary shadow-xl shadow-primary/5 transform md:-translate-y-4"
              : "border-border hover:border-primary/50 transition-colors"
          }`}
        >
          {tier.isPopular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
              Most Popular
            </div>
          )}

          <h4 className="font-heading font-semibold text-xl text-foreground mb-2">{tier.name}</h4>
          <p className="text-sm text-muted-foreground mb-6 h-10">{tier.description}</p>

          {/* `price` is optional in the data. Without a fallback this rendered
              an empty heading under a "Transparent Pricing" title. */}
          <div className="mb-8">
            <span className="text-4xl font-bold text-foreground">
              {tier.price || "Custom"}
            </span>
            {!tier.price && (
              <span className="block text-sm text-muted-foreground mt-1">
                Scoped to your deployment
              </span>
            )}
          </div>

          <Button
            asChild
            variant={tier.isPopular ? "default" : "outline"}
            className="w-full mb-8 h-12"
          >
            <Link href="/contact">{tier.ctaText}</Link>
          </Button>

          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Includes:</p>
            <ul className="space-y-3">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mr-3" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
