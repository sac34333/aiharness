---
title: Caching Overview — Three Layers of AI Caching
description: The three distinct caching layers in AI systems — KV Cache, Prompt Caching, and Semantic Caching — and how they interact in production.
---

# Caching Overview

> Caching is where most AI cost optimisation happens. Three layers. Very different tradeoffs.

## The Three Layers

| Layer | What's Cached | Where | Cost Saving |
|---|---|---|---|
| **KV Cache** | Attention key/value matrices | GPU memory (inside the model) | Inference speed + compute |
| **Prompt Cache** | Tokenised prompt prefixes | API provider (Claude, Gemini) | Token charges |
| **Semantic Cache** | Full prompt→response pairs | Your infrastructure | API calls entirely |

They are independent and complementary. A production system should use all three.

## Mental Model

Think of it as three concentric circles:

- **KV Cache** — inside the engine room. You don't control it directly, but you design for it.
- **Prompt Cache** — at the API boundary. You structure prompts to maximise cache hits.
- **Semantic Cache** — in your own infrastructure. You decide what to store and when to serve it.

---

*Go deeper:*
- [KV Cache →](/guide/kv-cache)
- [Prompt Caching (Claude & Gemini) →](/guide/prompt-caching)
- [Semantic Caching →](/guide/semantic-caching)
