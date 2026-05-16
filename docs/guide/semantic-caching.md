---
title: Semantic Caching
description: Vector similarity-based caching for LLM responses. Skip the API call entirely when the question is semantically equivalent to a previous one.
---

# Semantic Caching

> Skip the API call entirely. If you've answered this before, serve the cached response.

## What Is Semantic Caching?

Instead of exact-match caching, semantic caching uses vector similarity. Two questions that mean the same thing — even if worded differently — hit the same cache entry.

- "What's the capital of France?" → cache miss → call LLM → cache response
- "Which city is France's capital?" → **cache hit** → serve cached response

**No LLM call. No token charges. Milliseconds instead of seconds.**

## The Stack (LiteLLM + Redis)

```python
import litellm
from litellm.caching import Cache

litellm.cache = Cache(
    type="redis",
    host="localhost",
    port=6379,
    similarity_threshold=0.85  # tune per use case
)

response = litellm.completion(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What is an AI agent?"}],
    caching=True
)
```

## Tuning the Similarity Threshold

| Threshold | Behaviour | Risk |
|---|---|---|
| **0.95+** | Very strict, few hits | Safe but low savings |
| **0.85–0.95** | Balanced | Good starting point |
| **< 0.85** | Aggressive, many hits | Risk of wrong cache hits |

Start at 0.90. Tune based on your domain's vocabulary similarity.

## What Not to Cache

- Anything time-sensitive ("what's today's date?")
- Anything user-specific ("what are my orders?")
- Anything with side effects ("send the email")

## Production Trap

::: warning
Caching responses for queries that include user-specific context. If two users ask "what's my balance?" and hit the same cache, you've just shown one user another user's data. **Namespace your cache keys by user ID.**
:::

---

*Next: [Security & Interop →](/guide/security-interop)*
