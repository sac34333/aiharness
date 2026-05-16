---
title: Caching — The Economics of AI at Scale
description: The four caching layers that make production AI systems economically viable. Overview of KV Cache, Prompt Caching, and Semantic Caching.
---

# PART 6 — Caching: The Economics of AI at Scale

> Caching is not a performance trick — it is what makes production AI systems economically viable.

---

## The Four-Layer Stack

Every production AI request passes through up to four caching layers:

```
User Request
     |
+----------------------------------------------------+
| LAYER 1: Semantic Cache (vector DB)                |
| Meaning-level match. Fast if similar queries repeat|
| Danger: must include context window in cache key.  |
+--------------------+-------------------------------+
                     | miss
+----------------------------------------------------+
| LAYER 2: Exact Prompt Cache (Redis/API-level)      |
| Byte-exact prefix match. Free via API (Claude/Gemini|
| Gemini explicit TTL. Claude: structure prompt right.|
+--------------------+-------------------------------+
                     | miss
+----------------------------------------------------+
| LAYER 3: LLM Inference                             |
| Actual model call. Most expensive. Unavoidable miss.|
+--------------------+-------------------------------+
                     | (inside the server, transparent)
+----------------------------------------------------+
| LAYER 4: KV Cache (GPU HBM -> CPU RAM -> S3)       |
| Prefix reuse at inference time. Paged KV for single |
| node. LMCache + tiered storage for multi-node.     |
+----------------------------------------------------+
```

---

## Why This Matters

> "Training made the headlines. Inference pays the power bill." — NetApp/HPCWire 2026

Each layer cuts cost at a different level:
- **KV Cache** (Layer 4): GPU compute you did not pay for twice
- **Prompt Cache** (Layer 2): ~10% of input token price on cache hits
- **Semantic Cache** (Layer 1): Full LLM call avoided for similar queries
- Together: 80-90% cost reduction on repeated workloads at scale

---

## Which Layer to Implement First

| Your situation | Start here |
|---|---|
| Single inference server, running vLLM | Layer 4 (KV) — it's automatic |
| Multiple inference nodes behind a load balancer | Layer 4 with LMCache |
| Long system prompts sent on every request (Claude/Gemini) | Layer 2 (Prompt caching) |
| FAQ-style queries with many users asking similar questions | Layer 1 (Semantic cache) |

---

## The Full Guide

- [KV Cache — GPU-Level Inference Caching](/guide/kv-cache)
- [Prompt Caching — Provider-Level Caching (Claude + Gemini)](/guide/prompt-caching)
- [Semantic Caching — Meaning-Level Cache + LiteLLM Stack](/guide/semantic-caching)

---

## Sources

- *Training made the headlines. Inference pays the power bill.* — NetApp/HPCWire 2026

<div class="contribute-cta">

**Seeing caching numbers from production?** [Add them here](https://github.com/sac34333/aiharness/edit/main/docs/guide/caching-overview.md) — real cost data is rare and valuable.

</div>
