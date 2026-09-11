"use client"

import { useId, useState } from "react"
import { FadeIn } from "@/components/effects/fade-in"
import { submitLead } from "@/lib/submit-lead"
import { ArrowRight, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react"

type Step = 1 | 2 | 3 | 4

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function DiscoveryWizard() {
  const [step, setStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState("")
  const id = useId()

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    industry: "",
    companySize: "",
    email: "",
    challenges: "",
    budget: "",
    timeline: "",
    website: "", // honeypot — must stay empty
  })

  const update = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear the error for a field as soon as the user corrects it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev))
  }

  /** Required fields per step. The form used to let you click straight through
   *  every step and submit an entirely empty request. */
  const validateStep = (target: Step): Record<string, string> => {
    const next: Record<string, string> = {}

    if (target === 1) {
      if (!formData.fullName.trim()) next.fullName = "Please tell us your name."
      if (!formData.companyName.trim()) next.companyName = "Company name is required."
      if (!formData.industry) next.industry = "Please select an industry."
      if (!formData.email.trim()) {
        next.email = "Business email is required."
      } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
        next.email = "Please enter a valid email address."
      }
    }

    if (target === 2 && !formData.challenges.trim()) {
      next.challenges = "A short description of your challenge helps us prepare."
    }

    if (target === 3 && !formData.budget) {
      next.budget = "Please select an estimated budget range."
    }

    return next
  }

  const nextStep = () => {
    const stepErrors = validateStep(step)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    setStep((s) => Math.min(4, s + 1) as Step)
  }

  const prevStep = () => {
    setErrors({})
    setSubmitError("")
    setStep((s) => Math.max(1, s - 1) as Step)
  }

  const handleSubmit = async () => {
    // Re-validate every step before sending — someone can reach step 4 and then
    // edit an earlier field.
    const allErrors = {
      ...validateStep(1),
      ...validateStep(2),
      ...validateStep(3),
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      const firstBrokenStep: Step = Object.keys(validateStep(1)).length
        ? 1
        : Object.keys(validateStep(2)).length
          ? 2
          : 3
      setStep(firstBrokenStep)
      setSubmitError("Please complete the highlighted fields before submitting.")
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      await submitLead("/api/discovery", {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        company: formData.companyName.trim(),
        industry: formData.industry,
        companySize: formData.companySize,
        budget: formData.budget,
        timeline: formData.timeline,
        challenges: formData.challenges.trim(),
        website: formData.website,
      })

      setIsSuccess(true)
    } catch (error: unknown) {
      // Never show the success screen on failure — that silently loses the lead.
      console.error("Discovery submission error:", error)
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not send your request. Please try again or email rudrovalabs@gmail.com."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-12 text-center shadow-xl">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-3xl font-bold font-heading mb-4 text-foreground">Discovery Call Requested</h3>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Thanks, {formData.fullName.split(" ")[0]}. We have your request — a consultant will reach out to{" "}
          <strong>{formData.email}</strong> within 24 hours to schedule your session.
        </p>
      </div>
    )
  }

  const fieldError = (field: string) =>
    errors[field] ? (
      <p className="text-xs text-destructive mt-2 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 shrink-0" /> {errors[field]}
      </p>
    ) : null

  const inputClass = (field: string) =>
    `w-full bg-background border rounded-lg px-4 py-3 text-foreground focus:outline-none transition-colors ${
      errors[field] ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
    }`

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-background border-b border-border p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-primary">Step {step} of 4</span>
          <span className="text-sm text-muted-foreground">
            {step === 1 && "Company Details"}
            {step === 2 && "Business Context"}
            {step === 3 && "Project Scope"}
            {step === 4 && "Review"}
          </span>
        </div>
        <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-8 md:p-12">
        {/* Honeypot — hidden from people, tempting to bots. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </div>

        {step === 1 && (
          <FadeIn>
            <h3 className="text-2xl font-bold font-heading mb-8">Tell us about your organization</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={`${id}-fullName`} className="block text-sm font-medium text-foreground mb-2">
                    Your Name *
                  </label>
                  <input
                    id={`${id}-fullName`}
                    type="text"
                    autoComplete="name"
                    className={inputClass("fullName")}
                    placeholder="Jane Doe"
                    value={formData.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                  {fieldError("fullName")}
                </div>
                <div>
                  <label htmlFor={`${id}-companyName`} className="block text-sm font-medium text-foreground mb-2">
                    Company Name *
                  </label>
                  <input
                    id={`${id}-companyName`}
                    type="text"
                    autoComplete="organization"
                    className={inputClass("companyName")}
                    placeholder="Acme Corp"
                    value={formData.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                  />
                  {fieldError("companyName")}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={`${id}-industry`} className="block text-sm font-medium text-foreground mb-2">
                    Industry *
                  </label>
                  <select
                    id={`${id}-industry`}
                    className={`${inputClass("industry")} appearance-none`}
                    value={formData.industry}
                    onChange={(e) => update("industry", e.target.value)}
                  >
                    <option value="">Select Industry</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance &amp; Banking</option>
                    <option value="Government">Government</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldError("industry")}
                </div>
                <div>
                  <label htmlFor={`${id}-companySize`} className="block text-sm font-medium text-foreground mb-2">
                    Company Size
                  </label>
                  <select
                    id={`${id}-companySize`}
                    className={`${inputClass("companySize")} appearance-none`}
                    value={formData.companySize}
                    onChange={(e) => update("companySize", e.target.value)}
                  >
                    <option value="">Select Size</option>
                    <option value="1-50">1 - 50</option>
                    <option value="51-200">51 - 200</option>
                    <option value="201-1000">201 - 1,000</option>
                    <option value="1000+">1,000+</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor={`${id}-email`} className="block text-sm font-medium text-foreground mb-2">
                  Business Email *
                </label>
                <input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  className={inputClass("email")}
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => update("email", e.target.value)}
                />
                {fieldError("email")}
              </div>
            </div>
          </FadeIn>
        )}

        {step === 2 && (
          <FadeIn>
            <h3 className="text-2xl font-bold font-heading mb-8">What challenges are you facing?</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor={`${id}-challenges`} className="block text-sm font-medium text-foreground mb-2">
                  Primary Business Challenge *
                </label>
                <textarea
                  id={`${id}-challenges`}
                  className={`${inputClass("challenges")} h-32 resize-none`}
                  placeholder="E.g., We spend too much time manually processing insurance claims..."
                  value={formData.challenges}
                  onChange={(e) => update("challenges", e.target.value)}
                />
                {fieldError("challenges")}
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Our consultants review this before your call.
                </p>
              </div>
            </div>
          </FadeIn>
        )}

        {step === 3 && (
          <FadeIn>
            <h3 className="text-2xl font-bold font-heading mb-8">Project Scope &amp; Timelines</h3>
            <div className="space-y-6">
              <div>
                <span className="block text-sm font-medium text-foreground mb-4">Estimated Budget Range *</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Under $50k", "$50k - $100k", "$100k - $250k", "$250k+"].map((budget) => (
                    <button
                      key={budget}
                      type="button"
                      aria-pressed={formData.budget === budget}
                      onClick={() => update("budget", budget)}
                      className={`p-4 rounded-xl border text-left transition-colors ${
                        formData.budget === budget
                          ? "border-primary bg-primary/5 text-primary font-semibold"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
                {fieldError("budget")}
              </div>

              <div>
                <span className="block text-sm font-medium text-foreground mb-4">Target Timeline</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["ASAP", "1-3 Months", "Exploring (3M+)"].map((timeline) => (
                    <button
                      key={timeline}
                      type="button"
                      aria-pressed={formData.timeline === timeline}
                      onClick={() => update("timeline", timeline)}
                      className={`p-3 rounded-lg border text-center transition-colors text-sm ${
                        formData.timeline === timeline
                          ? "border-primary bg-primary/5 text-primary font-semibold"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      }`}
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {step === 4 && (
          <FadeIn>
            <h3 className="text-2xl font-bold font-heading mb-8">Review &amp; Submit</h3>
            <div className="bg-background rounded-xl p-6 border border-border space-y-4 mb-8 text-sm">
              {[
                { label: "Name", value: formData.fullName },
                { label: "Company", value: formData.companyName },
                { label: "Email", value: formData.email },
                { label: "Industry", value: formData.industry },
                { label: "Budget", value: formData.budget },
                { label: "Timeline", value: formData.timeline },
                { label: "Challenge", value: formData.challenges },
              ].map((row, i, rows) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 gap-4 ${
                    i < rows.length - 1 ? "border-b border-border pb-4" : ""
                  }`}
                >
                  <span className="text-muted-foreground font-medium">{row.label}</span>
                  <span className="col-span-2 text-foreground font-semibold break-words">
                    {row.value || "Not provided"}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {submitError && (
          <div className="mt-8 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              step === 1
                ? "opacity-0 pointer-events-none"
                : "text-muted-foreground hover:text-foreground hover:bg-background border border-border"
            }`}
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center"
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center shadow-lg disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending Request...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Submit Discovery Request
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
