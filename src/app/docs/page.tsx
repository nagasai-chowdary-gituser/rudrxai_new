import { Navbar } from "@/components/layout/navbar"
import { Container } from "@/components/layout/container"
import Link from "next/link"
import { Search, ChevronRight, Terminal, Box, Code2, ShieldCheck } from "lucide-react"
import { MdxContent } from "@/components/resources/mdx-content"

const docsSidebar = [
  {
    title: "Getting Started",
    links: [
      { name: "Introduction", href: "#" },
      { name: "Quickstart", href: "#" },
      { name: "Authentication", href: "#" }
    ]
  },
  {
    title: "Core Concepts",
    links: [
      { name: "Agents & Workflows", href: "#" },
      { name: "State Management", href: "#" },
      { name: "Vector Search", href: "#" }
    ]
  },
  {
    title: "API Reference",
    links: [
      { name: "Completions API", href: "#" },
      { name: "Embeddings API", href: "#" },
      { name: "Files API", href: "#" }
    ]
  }
]

const dummyDocsContent = `
## Rudrx Inference API

The Rudrx API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

### Authentication

The Rudrx API uses API keys to authenticate requests. You can view and manage your API keys in the [Rudrx Dashboard](#).

Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.

Authentication to the API is performed via HTTP Bearer Auth. Provide your API key as the bearer token value.

\`\`\`bash
curl https://api.rudrx.ai/v1/chat/completions \\
  -H "Authorization: Bearer k_live_YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "rudrx-enterprise-v2",
    "messages": [
      {"role": "user", "content": "Analyze this financial data."}
    ]
  }'
\`\`\`

### Rate Limits

We enforce rate limits to ensure stability and fairness for all users on the platform. The standard enterprise tier allows for 10,000 requests per minute (RPM).

If you exceed a rate limit, the API will return a \`429 Too Many Requests\` error.
`

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Search Header */}
      <div className="pt-20 border-b border-border bg-surface/30 sticky top-0 z-30 backdrop-blur-md">
        <Container className="flex items-center h-16">
          <div className="flex-1 max-w-md bg-background border border-border rounded-md px-3 py-1.5 flex items-center shadow-sm">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Search documentation... (Press '/')" 
              className="bg-transparent border-none text-sm focus:outline-none w-full text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto text-sm font-medium">
            <Link href="#" className="text-muted-foreground hover:text-foreground">API Status</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">Support</Link>
          </div>
        </Container>
      </div>

      <Container className="flex-1 flex w-full max-w-7xl">
        
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 py-10 pr-8 border-r border-border">
          <nav className="space-y-8">
            {docsSidebar.map((section, i) => (
              <div key={i}>
                <h4 className="font-heading font-semibold text-sm text-foreground mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link href={link.href} className={`text-sm transition-colors ${i === 0 && j === 0 ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 py-10 lg:pl-12 lg:pr-8 min-w-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/docs" className="hover:text-foreground">Docs</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Getting Started</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Introduction</span>
          </div>
          
          <h1 className="text-4xl font-bold font-heading mb-6 text-foreground">Introduction</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Welcome to the Rudrova Labs documentation. Build secure, enterprise-grade AI agents and RAG pipelines using our unified API.
          </p>
          
          {/* Quickstart Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            <Link href="#" className="p-6 rounded-xl border border-border bg-surface hover:border-primary/50 transition-colors group">
              <Terminal className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">Quickstart Guide</h3>
              <p className="text-sm text-muted-foreground">Get your first API call running in under 5 minutes.</p>
            </Link>
            <Link href="#" className="p-6 rounded-xl border border-border bg-surface hover:border-primary/50 transition-colors group">
              <Box className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">SDKs & Libraries</h3>
              <p className="text-sm text-muted-foreground">Official libraries for Python, Node.js, and Go.</p>
            </Link>
            <Link href="#" className="p-6 rounded-xl border border-border bg-surface hover:border-primary/50 transition-colors group">
              <Code2 className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">API Reference</h3>
              <p className="text-sm text-muted-foreground">Detailed endpoint documentation and schemas.</p>
            </Link>
            <Link href="#" className="p-6 rounded-xl border border-border bg-surface hover:border-primary/50 transition-colors group">
              <ShieldCheck className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">Security Models</h3>
              <p className="text-sm text-muted-foreground">Learn about RBAC and zero-data retention.</p>
            </Link>
          </div>

          <hr className="border-border mb-12" />

          {/* Dummy MDX Content */}
          <MdxContent content={dummyDocsContent} />
          
        </main>
        
        {/* Right Sidebar (On this page) */}
        <aside className="hidden xl:block w-56 shrink-0 py-10 pl-8">
          <div className="sticky top-28">
            <h4 className="font-heading font-semibold text-xs text-foreground uppercase tracking-wider mb-4">On this page</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-primary font-medium">Authentication</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Rate Limits</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Errors</a></li>
            </ul>
          </div>
        </aside>
        
      </Container>
    </div>
  )
}
