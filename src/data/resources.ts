import { Resource } from "@/types/resources"

export const resourcesData: Resource[] = [
  {
    id: "orchestrating-multi-agent-systems",
    title: "Orchestrating Multi-Agent Systems in Production",
    summary: "A deep dive into how we use LangGraph and Kubernetes to reliably orchestrate thousands of autonomous agents in enterprise environments.",
    type: "Engineering Blog",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop",
    author: {
      name: "Dr. Sarah Chen",
      role: "Head of AI Engineering",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop"
    },
    publishedAt: "2024-10-12",
    updatedAt: "2024-10-15",
    readingTime: "8 min read",
    tags: ["Agents", "Kubernetes", "Architecture", "LangGraph"],
    content: `
## The Complexity of Multi-Agent Systems

Moving from a single LLM call to a system of autonomous agents introduces significant architectural complexity. In production, agents fail, hallucinate, get stuck in loops, and consume unbounded resources if not properly monitored.

At Rudrova Labs, we orchestrate multi-agent workflows using a custom event-driven architecture built on top of **Kubernetes** and **LangGraph**.

### The Core Architecture

Instead of having agents directly invoke each other (which creates tight coupling and brittle workflows), we use an event bus.

1. **The Planner Agent** breaks down a user request into discrete sub-tasks.
2. **The Execution Agents** subscribe to specific task queues (e.g., \`code_execution\`, \`data_retrieval\`, \`web_search\`).
3. **The Critic Agent** reviews outputs and routes them back for revision if they fail strict validation schemas.

\`\`\`python
# Example: Defining a Supervisor Node in LangGraph
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, Sequence

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next_node: str

def supervisor_node(state: AgentState):
    # LLM logic to decide the next agent
    decision = llm.invoke(supervisor_prompt + state["messages"])
    return {"next_node": decision.worker_name}

workflow = StateGraph(AgentState)
workflow.add_node("supervisor", supervisor_node)
workflow.add_node("researcher", researcher_node)
workflow.add_node("coder", coder_node)

# Conditional routing based on the supervisor's decision
workflow.add_conditional_edges("supervisor", lambda x: x["next_node"])
\`\`\`

### State Management at Scale

When running thousands of these graphs concurrently, state management becomes a bottleneck. We use **Redis** for hot state (active graphs) and **PostgreSQL** for cold state (paused or completed graphs). This allows us to implement "Human-in-the-Loop" patterns.

If an agent wants to execute a destructive action (like dropping a database table), the graph pauses, serializes its state to Postgres, and waits for a webhook from our frontend dashboard approving the action.

### Key Takeaways
- Never let agents invoke each other directly; use an orchestrator or event bus.
- Implement strict timeouts for every agent node.
- Treat state as external to the agent memory for true scalability.
`
  },
  {
    id: "enterprise-rag-whitepaper",
    title: "The Enterprise Guide to Retrieval-Augmented Generation",
    summary: "Learn how to build secure, hallucination-free RAG systems that scale to millions of documents without compromising data privacy.",
    type: "Whitepaper",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
    author: {
      name: "Marcus Reed",
      role: "VP of Product Strategy",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop"
    },
    publishedAt: "2024-09-28",
    updatedAt: "2024-09-28",
    readingTime: "15 min read",
    tags: ["RAG", "Security", "Vector DB", "LLMs"],
    content: `
## Introduction

Retrieval-Augmented Generation (RAG) is the foundational architecture for enterprise AI. By grounding LLMs in proprietary data, enterprises can solve the hallucination problem while maintaining data privacy. However, scaling a prototype into a production system requires addressing several critical challenges.

### 1. Document Ingestion and Chunking

The quality of your RAG system is directly proportional to the quality of your chunks.

- **Naive Chunking:** Splitting text every 500 tokens. This often splits sentences or critical context blocks in half.
- **Semantic Chunking:** Splitting text based on natural boundaries (headers, paragraphs, semantic shifts).

We recommend using a multimodal ingestion pipeline that can handle images, tables, and text within the same document using Vision LLMs to extract table structures into Markdown before chunking.

### 2. Hybrid Search (Vector + BM25)

Vector search is excellent for conceptual queries but terrible for exact keyword matching (e.g., searching for a specific product ID or employee name).

Production systems must implement **Hybrid Search**:
1. Retrieve Top-K results using Dense Vectors (Cosine Similarity).
2. Retrieve Top-K results using Sparse Vectors (BM25 keyword search).
3. Merge and rerank the results using a Cross-Encoder model.

### 3. Security and RBAC

The most overlooked aspect of Enterprise RAG is access control. If an intern asks the chatbot "What is the CEO's salary?", the system must not retrieve that document unless the intern has explicit permissions.

**Metadata Filtering:** Every chunk in the vector database must be tagged with Access Control Lists (ACLs). The query must pre-filter the vector space based on the user's Active Directory token *before* performing the nearest-neighbor search.
`
  },
  {
    id: "build-rag-fastapi",
    title: "Building a Secure RAG API with FastAPI & Pinecone",
    summary: "A step-by-step tutorial on building a production-ready RAG endpoint using FastAPI, LangChain, and Pinecone.",
    type: "Tutorial",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    author: {
      name: "Elena Rodriguez",
      role: "Senior AI Developer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop"
    },
    publishedAt: "2024-11-05",
    updatedAt: "2024-11-05",
    readingTime: "12 min read",
    tags: ["Tutorial", "FastAPI", "Python", "RAG"],
    content: `
## Getting Started

In this tutorial, we will build a robust REST API for a RAG system.

### Prerequisites
- Python 3.11+
- Pinecone API Key
- OpenAI API Key

### Step 1: Setting up FastAPI

First, let's set up our basic FastAPI server and define our request schemas using Pydantic.

\`\`\`python
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Rudrx RAG API")

class QueryRequest(BaseModel):
    query: str
    user_id: str
    filters: dict = {}

class SourceNode(BaseModel):
    text: str
    score: float
    metadata: dict

class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceNode]
\`\`\`

### Step 2: The Retrieval Pipeline

We will use LangChain's \`PineconeVectorStore\` to handle the retrieval. Notice how we pass the \`filters\` dictionary to ensure we only retrieve documents the user is authorized to see.

\`\`\`python
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
vectorstore = PineconeVectorStore(index_name="enterprise-docs", embedding=embeddings)

def retrieve_documents(query: str, filters: dict):
    # Pass metadata filters directly to Pinecone
    results = vectorstore.similarity_search_with_score(
        query, 
        k=5, 
        filter=filters
    )
    return results
\`\`\`

### Conclusion
You now have a secure, scalable RAG endpoint. Next steps would involve adding Redis for rate limiting and semantic caching to reduce API costs!
`
  }
]
