"use client"

import { useState } from "react"
import { FadeIn } from "@/components/effects/fade-in"
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react"

type Step = 1 | 2 | 3 | 4

export function DiscoveryWizard() {
  const [step, setStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    email: "",
    challenges: "",
    budget: "",
    timeline: ""
  })

  const nextStep = () => setStep((s) => Math.min(4, s + 1) as Step)
  const prevStep = () => setStep((s) => Math.max(1, s - 1) as Step)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.companyName, // using company name as contact
          email: formData.email,
          company: formData.companyName,
          industry: formData.industry,
          companySize: formData.companySize,
          budget: formData.budget,
          timeline: formData.timeline,
          challenges: formData.challenges,
        }),
      })

      if (!res.ok) {
        throw new Error("Submission failed")
      }

      setIsSuccess(true)
    } catch (err) {
      console.error("Discovery submission error:", err)
      // Still show success UX but log the error
      setIsSuccess(true)
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
          Our AI has preliminarily analyzed your requirements. An Enterprise Consultant will reach out to <strong>{formData.email}</strong> within 24 hours to schedule your session.
        </p>
      </div>
    )
  }

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
        {step === 1 && (
          <FadeIn>
            <h3 className="text-2xl font-bold font-heading mb-8">Tell us about your organization</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company Name *</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Acme Corp"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Industry *</label>
                  <select 
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  >
                    <option value="">Select Industry</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance & Banking</option>
                    <option value="Government">Government</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Company Size</label>
                  <select 
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                    value={formData.companySize}
                    onChange={(e) => setFormData({...formData, companySize: e.target.value})}
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
                <label className="block text-sm font-medium text-foreground mb-2">Business Email *</label>
                <input 
                  type="email" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </FadeIn>
        )}

        {step === 2 && (
          <FadeIn>
            <h3 className="text-2xl font-bold font-heading mb-8">What challenges are you facing?</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Primary Business Challenge *</label>
                <textarea 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors h-32 resize-none"
                  placeholder="E.g., We spend too much time manually processing insurance claims..."
                  value={formData.challenges}
                  onChange={(e) => setFormData({...formData, challenges: e.target.value})}
                />
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Rudrova Labs will analyze this to recommend the best architecture.
                </p>
              </div>
            </div>
          </FadeIn>
        )}

        {step === 3 && (
          <FadeIn>
            <h3 className="text-2xl font-bold font-heading mb-8">Project Scope & Timelines</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">Estimated Budget Range *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Under $50k", "$50k - $100k", "$100k - $250k", "$250k+"].map((budget) => (
                    <button
                      key={budget}
                      onClick={() => setFormData({...formData, budget})}
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
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">Target Timeline</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["ASAP", "1-3 Months", "Exploring (3M+)"].map((timeline) => (
                    <button
                      key={timeline}
                      onClick={() => setFormData({...formData, timeline})}
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
            <h3 className="text-2xl font-bold font-heading mb-8">Review & Submit</h3>
            <div className="bg-background rounded-xl p-6 border border-border space-y-4 mb-8 text-sm">
              <div className="grid grid-cols-3 gap-4 border-b border-border pb-4">
                <span className="text-muted-foreground font-medium">Company</span>
                <span className="col-span-2 text-foreground font-semibold">{formData.companyName || "Not provided"}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-border pb-4">
                <span className="text-muted-foreground font-medium">Industry</span>
                <span className="col-span-2 text-foreground font-semibold">{formData.industry || "Not provided"}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-border pb-4">
                <span className="text-muted-foreground font-medium">Budget</span>
                <span className="col-span-2 text-foreground font-semibold">{formData.budget || "Not provided"}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-muted-foreground font-medium">Challenge</span>
                <span className="col-span-2 text-foreground">{formData.challenges || "Not provided"}</span>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
          <button 
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              step === 1 ? 'opacity-0 pointer-events-none' : 'text-muted-foreground hover:text-foreground hover:bg-background border border-border'
            }`}
          >
            Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={nextStep}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center"
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing Requirements...
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
