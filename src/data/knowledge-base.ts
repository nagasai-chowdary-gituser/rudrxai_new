export interface KnowledgeEntry {
  id: string
  category: string
  title: string
  content: string
  keywords: string[]
}

export const knowledgeBase: KnowledgeEntry[] = [
  // ======== COMPANY ========
  {
    id: "company-overview",
    category: "company",
    title: "About Rudrova Labs",
    content: "Rudrova Labs is an enterprise AI company that builds intelligent systems, AI agents, automation platforms, and software for businesses and governments. We specialize in production-grade AI solutions including multi-agent orchestration, voice AI, RAG knowledge systems, document intelligence, and AI strategy consulting. We serve Fortune 500 companies, governments, healthcare providers, financial institutions, and innovative startups.",
    keywords: ["rudrx", "about", "company", "who", "what do you do", "overview"]
  },
  {
    id: "company-mission",
    category: "company",
    title: "Mission & Vision",
    content: "Our mission is to make enterprise AI accessible, reliable, and production-ready. We believe every organization deserves AI that works — not just demos. Our vision is to be the most trusted AI engineering partner for enterprises worldwide.",
    keywords: ["mission", "vision", "values", "goal", "purpose"]
  },

  // ======== PRODUCTS ========
  {
    id: "product-agents",
    category: "products",
    title: "Rudrx Agents",
    content: "Rudrx Agents is our multi-agent orchestration platform. It allows enterprises to deploy AI agents that can reason, plan, use tools, and collaborate with each other. Agents can handle complex workflows like customer support, data processing, research, and decision-making. Built on LangGraph and custom orchestration layers.",
    keywords: ["agents", "multi-agent", "orchestration", "autonomous", "AI agent", "langchain", "langgraph"]
  },
  {
    id: "product-voice",
    category: "products",
    title: "Rudrx Voice",
    content: "Rudrx Voice is our enterprise Voice AI platform. It provides real-time speech-to-text, text-to-speech, voice agents, and conversational AI over phone and web. Used in healthcare for patient triage, in customer support for call centers, and in government for citizen services. Supports 50+ languages.",
    keywords: ["voice", "speech", "audio", "call center", "phone", "tts", "stt", "conversational"]
  },
  {
    id: "product-knowledge",
    category: "products",
    title: "Rudrx Knowledge",
    content: "Rudrx Knowledge is our RAG (Retrieval-Augmented Generation) platform. It connects your enterprise data — documents, databases, APIs — to LLMs for accurate, grounded AI responses. Supports PDF, Word, Excel, emails, Confluence, SharePoint, and custom databases. Enterprise-grade with access controls and audit logging.",
    keywords: ["knowledge", "rag", "retrieval", "documents", "search", "enterprise search", "knowledge base"]
  },
  {
    id: "product-vision",
    category: "products",
    title: "Rudrx Vision",
    content: "Rudrx Vision is our computer vision and image intelligence platform. It handles document OCR, image classification, visual inspection, and video analysis. Used in manufacturing for quality control, in healthcare for medical imaging, and in retail for inventory management.",
    keywords: ["vision", "image", "ocr", "computer vision", "visual", "image recognition"]
  },
  {
    id: "product-flow",
    category: "products",
    title: "Rudrx Flow",
    content: "Rudrx Flow is our AI workflow automation engine. It connects AI models to business processes — automating approvals, routing, data extraction, and decision-making. Think Zapier but with AI intelligence built in. Integrates with SAP, Salesforce, HubSpot, Slack, and 100+ enterprise tools.",
    keywords: ["flow", "automation", "workflow", "process", "automate", "integration", "zapier"]
  },
  {
    id: "product-documents",
    category: "products",
    title: "Rudrx Documents",
    content: "Rudrx Documents is our intelligent document processing (IDP) platform. It extracts structured data from contracts, invoices, forms, and legal documents with 99%+ accuracy. Supports handwriting recognition, table extraction, and multi-language processing.",
    keywords: ["documents", "document processing", "idp", "extraction", "contracts", "invoices", "forms"]
  },

  // ======== SOLUTIONS ========
  {
    id: "solution-ai-agents",
    category: "solutions",
    title: "AI Agents Solution",
    content: "We build custom AI agents for enterprises that can autonomously handle complex tasks — from customer support to data analysis to research. Our agents use tool calling, memory, planning, and multi-agent collaboration to deliver results. Deployed on-premise or in your cloud.",
    keywords: ["ai agents", "solution", "custom agents", "enterprise agents"]
  },
  {
    id: "solution-rag",
    category: "solutions",
    title: "RAG & Knowledge Systems",
    content: "We design and deploy RAG (Retrieval-Augmented Generation) architectures that connect your enterprise data to AI. This includes vector databases, embedding pipelines, chunking strategies, hybrid search, and re-ranking. We support Pinecone, Weaviate, Qdrant, and ChromaDB.",
    keywords: ["rag", "knowledge", "retrieval", "vector database", "embeddings", "search"]
  },
  {
    id: "solution-document-intelligence",
    category: "solutions",
    title: "Document Intelligence",
    content: "Our Document Intelligence solution automates the extraction, classification, and processing of unstructured documents. From contracts and invoices to medical records and legal filings — we build AI that reads, understands, and extracts structured data.",
    keywords: ["document", "intelligence", "extraction", "classification", "unstructured data"]
  },
  {
    id: "solution-consulting",
    category: "solutions",
    title: "AI Strategy Consulting",
    content: "Our AI Strategy Consulting service helps enterprises define their AI roadmap, identify high-impact use cases, and build the technical foundation for AI adoption. Includes technology assessment, vendor evaluation, team training, and governance frameworks.",
    keywords: ["consulting", "strategy", "roadmap", "assessment", "advisory"]
  },

  // ======== PRICING ========
  {
    id: "pricing-overview",
    category: "pricing",
    title: "Pricing Overview",
    content: "Rudrova Labs offers affordable fixed-price solutions: Business Websites from ₹3,999–₹9,999, AI Chatbots from ₹4,999–₹19,999, AI Dashboards from ₹2,999–₹9,999, Voice AI Agents from ₹5,999–₹29,000, and Custom Platforms at custom quote. All projects include design, development, testing, deployment, and 30 days support. Contact us for a free quote.",
    keywords: ["pricing", "cost", "price", "how much", "budget", "tier", "plan", "starter", "growth", "enterprise"]
  },
  {
    id: "pricing-starter",
    category: "pricing",
    title: "Starter Tier",
    content: "The Starter plan (from ₹3,999) includes: Business Website, Mobile Responsive Design, SEO Optimization, Contact Form, Hosting Setup, and 30 Days Post-Launch Support. Ideal for small businesses and personal brands.",
    keywords: ["starter", "mvp", "pilot", "small project", "proof of concept"]
  },
  {
    id: "pricing-growth",
    category: "pricing",
    title: "Growth Tier",
    content: "The Growth plan (from ₹9,999) includes everything in Starter plus: AI Chatbot, Dashboard, CRM Integration, Analytics, and Priority Support. Ideal for growing businesses and SMEs.",
    keywords: ["growth", "production", "scale", "enterprise system"]
  },

  // ======== INDUSTRIES ========
  {
    id: "industry-healthcare",
    category: "industries",
    title: "Healthcare AI",
    content: "We serve healthcare organizations with AI solutions for patient triage, medical document processing, clinical decision support, voice-powered patient interactions, and HIPAA-compliant data systems. Our healthcare clients have reduced administrative costs by 60% and improved patient outcomes.",
    keywords: ["healthcare", "medical", "hospital", "patient", "hipaa", "clinical"]
  },
  {
    id: "industry-finance",
    category: "industries",
    title: "Finance & Banking AI",
    content: "We build AI systems for financial services including contract analysis, fraud detection, regulatory compliance automation, risk assessment, and intelligent document processing. Our solutions are SOC2 and PCI-DSS compliant.",
    keywords: ["finance", "banking", "financial", "trading", "compliance", "fraud", "risk"]
  },
  {
    id: "industry-government",
    category: "industries",
    title: "Government AI",
    content: "We partner with government agencies to deploy AI for citizen services, document processing, policy analysis, and public safety. Our government solutions meet FedRAMP, FISMA, and Section 508 accessibility requirements.",
    keywords: ["government", "public sector", "federal", "state", "municipality", "citizen"]
  },

  // ======== ENGAGEMENT ========
  {
    id: "engagement-discovery",
    category: "engagement",
    title: "Discovery Workshop",
    content: "Our Discovery Workshop is a complimentary 30-minute session where our AI consultants analyze your business challenges, identify high-impact AI use cases, and present a preliminary architecture recommendation. No commitment required. Book at rudrovalabs.com/discovery.",
    keywords: ["discovery", "workshop", "meeting", "call", "consultation", "book", "schedule", "appointment"]
  },
  {
    id: "engagement-process",
    category: "engagement",
    title: "Delivery Process",
    content: "Our delivery process: 1) Discovery — analyze business requirements; 2) Architecture — design scalable technical foundation; 3) Proposal — fixed-scope with guaranteed timelines; 4) Development — agile sprints with weekly demos; 5) Deployment — seamless rollout with zero downtime. Every project includes a dedicated PM and weekly progress reports.",
    keywords: ["process", "delivery", "how do you work", "methodology", "agile", "timeline"]
  },

  // ======== TRUST & SECURITY ========
  {
    id: "trust-security",
    category: "trust",
    title: "Security & Compliance",
    content: "Rudrova Labs maintains enterprise-grade security: SOC2 Type II compliant, HIPAA compliant, GDPR compliant, ISO 27001 certified. All data is encrypted at rest and in transit. We support on-premise deployment, private cloud, and air-gapped environments. Regular penetration testing and security audits.",
    keywords: ["security", "compliance", "soc2", "hipaa", "gdpr", "encryption", "privacy", "data protection"]
  },

  // ======== CONTACT ========
  {
    id: "contact-info",
    category: "contact",
    title: "Contact Information",
    content: "You can reach Rudrova Labs at: Email: rudrovalabs@gmail.com | Phone: +91 7989317347 | Office: Remote — Global. For inquiries, visit our contact page. We respond within 24 hours.",
    keywords: ["contact", "email", "phone", "address", "reach", "talk to", "get in touch"]
  },
]
