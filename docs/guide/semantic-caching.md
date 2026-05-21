---
title: Semantic Caching - Meaning-Level Cache
description: How semantic caching works, the context window problem that breaks naive implementations, similarity threshold tuning, and the LiteLLM production stack.
---

# Part 6c - Semantic Caching: Meaning-Level Cache

> Sources: [Microsoft Azure Cosmos DB Semantic Cache](https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/semantic-cache) · [LiteLLM Proxy Caching](https://docs.litellm.ai/docs/proxy/caching)

---

## The Intuition

Prompt caching says: "If the exact bytes match, reuse the result."
Semantic caching says: "If the *meaning* matches, reuse the result."

```
User 1: "What is the return policy?"
User 2: "How do I return a product?"       <- different words, same intent
User 3: "Can I get a refund on my order?"  <- different words, same intent

Prompt caching:   3 cache misses (all different text)
Semantic caching: 1 cache miss (first one), then 2 hits (same intent)
```

---

## How It Works

```
New request
     |
  Embed query -> vector embedding
     |
  Vector similarity search against cached (query, response) pairs
  similarity score = 0 (no match) to 1 (exact match)
     |
  Score > threshold? -> return cached response (no LLM call)
  Score <= threshold? -> call LLM -> embed and store (query, response) pair
```

---

## The Context Window Problem - Critical Production Gotcha

> Source: Microsoft Azure Cosmos DB Docs

**The problem**: A cache key of just the latest message is dangerously wrong.

Classic failure scenario:
```
User asks: "What is the largest lake in North America?"
-> LLM: "Lake Superior." -> cached

User (same session, next turn) asks: "What is the second largest?"
-> With context: "Lake Huron" -> cached

--- Later, different user, different session ---

New user asks: "What is the largest stadium in North America?"
-> LLM: "Michigan Stadium." -> cached

New user then asks: "What is the second largest?"
-> Semantic cache finds "What is the second largest?" from before
-> Returns "Lake Huron"  <-- WRONG. Context was about lakes, not stadiums.
```

**The fix**: Cache keys must include *context window history*, not just the latest message. Vectorize the sliding window of recent prompts + the new message as the lookup key. This ensures what is returned from cache is contextually correct.

---

## Similarity Score Tuning

This requires trial and error in production:

| Threshold | Effect |
|---|---|
| Too **high** (e.g., 0.99) | Few hits. Cache fills with near-duplicate entries. High LLM spend. |
| Too **low** (e.g., 0.70) | Too many hits. Returns responses for similar but actually different questions. Wrong answers. |
| **Sweet spot** | Typically 0.92–0.97 for general use. Domain-specific embeddings improve this significantly. |

---

## Cache Maintenance

Semantic caches grow large if not pruned:
- **TTL**: Set expiry on cached items (stale answers become dangerous over time)
- **Hit count**: Track how often each item is hit - evict low-hit items, extend TTL of high-hit items
- **Recency filter**: Serve only the most recently cached version of similar questions

---

## LiteLLM - Production Caching Stack

LiteLLM provides a gateway-level caching layer across all model providers (OpenAI, Anthropic, Gemini, Azure, etc.) - one config to cache everything.

**Supported cache backends:**
- In-memory (dev only)
- Disk
- Redis (exact match, production standard)
- Qdrant Semantic Cache (meaning-level)
- Redis Semantic Cache
- S3 / GCS (long-term storage)

```yaml
# config.yaml - exact match + semantic cache setup
model_list:
  - model_name: gpt-4o
    litellm_params:
      model: gpt-4o

litellm_settings:
  cache: true
  cache_params:
    type: redis           # exact prompt cache via Redis
    host: localhost
    port: 6379
    ttl: 600              # 10 minute default TTL
    namespace: "prod.cache"

# For semantic caching, use Qdrant:
# type: qdrant-semantic-cache
# similarity_threshold: 0.95
```

**Per-request cache controls** (dynamic overrides):
```python
# Force fresh response, bypass cache
client.chat.completions.create(
    model="gpt-4o",
    messages=[...],
    extra_body={"cache": {"no-cache": True}}   # skip cache check
)

# Custom TTL for this specific request
extra_body={"cache": {"ttl": 300}}             # cache for 5 minutes only

# Only accept cached responses < 10 minutes old
extra_body={"cache": {"s-maxage": 600}}

# Don't store this response (e.g., PII-sensitive)
extra_body={"cache": {"no-store": True}}
```

**Debug your cache**: `GET /cache/ping` returns health status, Redis version, connection pool info.
**View cache key in response**: check `x-litellm-cache-key` response header.
**Shared auth cache across workers**: `enable_redis_auth_cache: true` - prevents each worker pod from making independent DB lookups on key verification.

---

## Prompt Caching vs. Semantic Caching Tradeoff

| Dimension | Prompt Caching | Semantic Caching |
|---|---|---|
| **What matches** | Exact byte prefix | Embedding similarity |
| **Best for** | System prompts, tools, documents | FAQ queries, repeated user intents |
| **Staleness risk** | Very low (exact = always same context) | Medium-high (similar ≠ same context) |
| **Implementation complexity** | Low (API parameter) | High (vector DB, embedding model, threshold tuning) |
| **Context window issue** | Not applicable | Critical - must include history in key |
| **Cold start** | Every new deployment | Warm-up time to build cache |

---

## Full Four-Layer Production Stack Recap

```
User Request
     |
Layer 1: Semantic Cache  -> miss ->
Layer 2: Exact Prompt Cache -> miss ->
Layer 3: LLM Inference (inside: Layer 4 KV Cache)
```

---

## Recall Hook

> **Semantic cache = meaning-level, needs context window in key, threshold tuning required. LiteLLM = one config to rule all providers. Four-layer stack: Semantic → Exact → LLM → KV.**

---

## Sources

- [Microsoft Azure Cosmos DB - Introduction to Semantic Cache](https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/semantic-cache)
- [LiteLLM Proxy Caching Docs](https://docs.litellm.ai/docs/proxy/caching)

<div class="contribute-cta">

**Tuned a semantic cache in production?** [Share your threshold and embedding model](https://github.com/sac34333/aiharness/edit/main/docs/guide/semantic-caching.md) - domain-specific data is hard to find.

</div>
