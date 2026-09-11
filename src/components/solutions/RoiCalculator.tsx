"use client"

import { useId, useState } from "react"
import { motion } from "framer-motion"
import { RoiConfig } from "@/types/solutions"

const DEFAULT_CONFIG: RoiConfig = {
  defaultEmployees: 5,
  defaultHourlyRate: 40,
  defaultHoursPerWeek: 40,
  efficiencyGainPercentage: 0.3,
}

const WEEKS_PER_MONTH = 4

/**
 * Efficiency gain is authored inconsistently across the data files: some
 * entries use a fraction (0.3) and some use whole percent (30). Normalise to a
 * fraction here so a "30" can never be read as "3,000% of monthly cost".
 * Clamped to 90% so the output stays a claim we can defend.
 */
function normaliseGain(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0
  const fraction = value > 1 ? value / 100 : value
  return Math.min(fraction, 0.9)
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function RoiCalculator({ config }: { config?: RoiConfig }) {
  const conf = config || DEFAULT_CONFIG
  const gain = normaliseGain(conf.efficiencyGainPercentage)
  const id = useId()

  const [employees, setEmployees] = useState(conf.defaultEmployees)
  const [hourlyRate, setHourlyRate] = useState(conf.defaultHourlyRate)
  const [hoursPerWeek, setHoursPerWeek] = useState(conf.defaultHoursPerWeek)

  const monthlyHours = employees * hoursPerWeek * WEEKS_PER_MONTH
  const currentMonthlyCost = monthlyHours * hourlyRate
  const estimatedSavings = currentMonthlyCost * gain

  return (
    <div className="bg-surface border border-border p-8 rounded-2xl">
      <h3 className="text-2xl font-heading font-bold text-foreground mb-6">ROI Calculator</h3>

      <div className="space-y-6 mb-8">
        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor={`${id}-employees`} className="text-sm font-medium text-muted-foreground">
              Team Size (Employees)
            </label>
            <span className="text-sm font-bold text-primary">{employees}</span>
          </div>
          <input
            id={`${id}-employees`}
            type="range"
            min="1"
            max="100"
            value={employees}
            onChange={(e) => setEmployees(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor={`${id}-rate`} className="text-sm font-medium text-muted-foreground">
              Average Hourly Rate
            </label>
            <span className="text-sm font-bold text-primary">{currency.format(hourlyRate)}/hr</span>
          </div>
          <input
            id={`${id}-rate`}
            type="range"
            min="15"
            max="150"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor={`${id}-hours`} className="text-sm font-medium text-muted-foreground">
              Hours Per Week
            </label>
            <span className="text-sm font-bold text-primary">{hoursPerWeek} hrs</span>
          </div>
          <input
            id={`${id}-hours`}
            type="range"
            min="5"
            max="60"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Monthly Cost</p>
          <p className="text-2xl font-bold text-foreground">{currency.format(currentMonthlyCost)}</p>
        </div>
        <div>
          <p className="text-sm text-primary font-medium mb-1">Estimated Monthly Savings</p>
          {/* Animate scale only — animating to a hard-coded colour made this
              invisible against the light theme. */}
          <motion.p
            key={estimatedSavings}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25 }}
            className="text-3xl font-bold font-heading text-success"
          >
            {currency.format(estimatedSavings)}
          </motion.p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Illustrative estimate based on a {Math.round(gain * 100)}% efficiency gain across{" "}
        {monthlyHours.toLocaleString()} monthly hours. Actual results vary by workflow.
      </p>
    </div>
  )
}
