"use client"

import { useState, useEffect } from "react"
import { Search, Sparkles, ArrowRight, Command, X } from "lucide-react"
import { resourcesData } from "@/data/resources"
import Link from "next/link"

export function AiSearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("")
  
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])
  
  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  const filteredResults = query.length > 2 
    ? resourcesData.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) || 
        r.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : []

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 bg-background/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input 
            type="text"
            className="flex-1 bg-transparent border-none py-5 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            placeholder="Ask Rudrova Labs or search resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="p-2 rounded-md hover:bg-background text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Suggestion Area */}
        {query.length > 3 && filteredResults.length > 0 && (
          <div className="p-4 bg-primary/5 border-b border-border">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium mb-1">AI Summary generated for &quot;{query}&quot;</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on our knowledge base, we recommend exploring our architectural guides on multi-agent systems and enterprise RAG. These documents cover the specific security models and infrastructure you are searching for.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Command className="w-8 h-8 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Start typing to search across blogs, tutorials, and whitepapers.</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">No results found for &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Resources
              </div>
              {filteredResults.map((result) => (
                <Link 
                  key={result.id}
                  href={`/resources/${result.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-background transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                      {result.title}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {result.type} • {result.readingTime}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 border-t border-border bg-background flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Powered by Rudrova Labs Semantic Search</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 bg-surface border border-border rounded font-sans">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  )
}
