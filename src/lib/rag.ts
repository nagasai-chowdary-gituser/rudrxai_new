import { knowledgeBase, KnowledgeEntry } from "@/data/knowledge-base"

/**
 * Simple but effective keyword + TF-IDF-inspired similarity search.
 * No external vector DB needed at this scale (~30 entries).
 */
export function retrieveRelevantKnowledge(query: string, topK: number = 3): KnowledgeEntry[] {
  const queryLower = query.toLowerCase()
  const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 2)

  const scored = knowledgeBase.map(entry => {
    let score = 0

    // Keyword matching (highest weight)
    for (const keyword of entry.keywords) {
      const kwLower = keyword.toLowerCase()
      if (queryLower.includes(kwLower)) {
        score += 10
      }
      // Partial match
      for (const token of queryTokens) {
        if (kwLower.includes(token) || token.includes(kwLower)) {
          score += 3
        }
      }
    }

    // Title matching
    const titleLower = entry.title.toLowerCase()
    for (const token of queryTokens) {
      if (titleLower.includes(token)) {
        score += 5
      }
    }

    // Content matching (lower weight, broader signal)
    const contentLower = entry.content.toLowerCase()
    for (const token of queryTokens) {
      if (contentLower.includes(token)) {
        score += 1
      }
    }

    // Category bonus for direct mention
    if (queryLower.includes(entry.category)) {
      score += 4
    }

    return { entry, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.entry)
}

export function buildRAGContext(entries: KnowledgeEntry[]): string {
  if (entries.length === 0) {
    return "No specific information found. Answer based on general knowledge about Rudrova Labs as an enterprise AI company."
  }

  return entries
    .map(e => `[${e.category.toUpperCase()}] ${e.title}:\n${e.content}`)
    .join("\n\n")
}
