import { TrustCenterData } from "@/types/trust"

export const trustData: TrustCenterData = {
  hero: {
    title: "Enterprise Security Built Into Every Solution",
    subtitle: "We prioritize the security, privacy, and responsible use of AI so you can deploy with confidence."
  },
  certifications: [
    {
      name: "GDPR Compliant",
      status: "Achieved",
      description: "Full compliance with EU data protection regulations, ensuring user privacy and data rights."
    },
    {
      name: "SOC 2 Type II",
      status: "Roadmap",
      description: "We are actively building our infrastructure to meet AICPA Trust Services Criteria."
    },
    {
      name: "ISO 27001",
      status: "Roadmap",
      description: "Information Security Management System (ISMS) implementation is currently underway."
    },
    {
      name: "HIPAA Ready Architecture",
      status: "In Progress",
      description: "Our dedicated healthcare deployments are designed to handle PHI securely."
    }
  ],
  articles: [
    {
      id: "data-encryption",
      title: "Data Encryption & Protection",
      category: "Security",
      content: "All data ingested by Rudrova Labs is encrypted both in transit (using TLS 1.3) and at rest (using AES-256). We utilize zero-trust architecture principles across our entire ecosystem."
    },
    {
      id: "access-control",
      title: "Role-Based Access Control (RBAC)",
      category: "Security",
      content: "We provide granular RBAC that integrates directly with your existing Identity Providers (Okta, Azure AD, Google Workspace) via SAML 2.0 and OIDC."
    },
    {
      id: "data-ownership",
      title: "Zero Data Retention Policies",
      category: "Privacy",
      content: "Your data remains yours. We do not use your proprietary enterprise data to train our foundational models. For strict environments, we offer zero-retention API endpoints."
    },
    {
      id: "bias-reduction",
      title: "Bias Reduction & Fairness",
      category: "Responsible AI",
      content: "Our AI systems undergo rigorous evaluation against standard benchmark datasets to identify and mitigate biases before they are deployed in production workflows."
    },
    {
      id: "human-oversight",
      title: "Human-in-the-Loop Architecture",
      category: "Responsible AI",
      content: "We design AI Agents with strict operational boundaries. Destructive actions or high-stakes decisions automatically pause the workflow and require manual human approval."
    },
    {
      id: "infrastructure-monitoring",
      title: "Infrastructure & Monitoring",
      category: "Infrastructure",
      content: "Rudrova Labs operates on isolated containerized environments within AWS and Azure. We employ 24/7 automated threat detection, anomalous behavior alerting, and regular penetration testing."
    },
    {
      id: "incident-response",
      title: "Incident Response",
      category: "Incident Response",
      content: "We maintain a dedicated security response team available 24/7. In the unlikely event of a security incident, our SLA guarantees immediate notification and a transparent post-mortem process."
    }
  ]
}
