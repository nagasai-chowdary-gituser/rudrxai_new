export interface IndustryStatistic {
  value: string
  label: string
  description: string
}

export interface IndustryChallenge {
  problem: string
  impact: string
}

export interface IndustrySolution {
  title: string
  description: string
  businessImpact: string
}

export interface IndustryOutcome {
  metric: string
  label: string
}

export interface IndustryArchitectureNode {
  id: string
  label: string
  type: "input" | "process" | "storage" | "output"
  description?: string
  connections?: string[]
}

export interface IndustryTechStack {
  category: string
  techs: string[]
}

export interface IndustryCaseStudy {
  clientType: string
  description: string
  metric: string
  metricLabel: string
}

export interface IndustryFaq {
  question: string
  answer: string
}

export interface IndustryData {
  id: string
  title: string
  heroSubtitle: string
  heroDescription: string
  overview: string
  statistics: IndustryStatistic[]
  challenges: IndustryChallenge[]
  opportunities: IndustrySolution[]
  outcomes: IndustryOutcome[]
  architecture: IndustryArchitectureNode[]
  techStack: IndustryTechStack[]
  caseStudy: IndustryCaseStudy
  faq: IndustryFaq[]
  roiConfig: {
    defaultEmployees: number
    defaultHourlyRate: number
    defaultHoursPerWeek: number
    /** Fraction, not whole percent — 0.40 means a 40% efficiency gain. */
    efficiencyGainPercentage: number
  }
}
