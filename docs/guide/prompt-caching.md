---
title: Prompt Caching — Claude & Gemini
description: API-level prompt prefix caching with Claude and Gemini. How to structure prompts for maximum cache hits and token cost reduction.
---

# Prompt Caching — Claude & Gemini

> API-level caching that reduces token charges. You control this directly.

## How It Works

Both Claude (Anthropic) and Gemini (Google) cache tokenised prompt prefixes on their infrastructure. If your next request starts with the same prefix, the cached version is used — dramatically cheaper.

**Typical savings: 50–90% on input token costs for repeated prefixes.**

## Claude: Cache Control

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "<your_system_prompt_here>",
            "cache_control": {"type": "ephemeral"}  # mark for caching
        }
    ],
    messages=[{"role": "user", "content": "User question here"}]
)
```

## Gemini: Explicit Caching

Gemini supports explicit cache creation with a TTL:

```python
import google.generativeai as genai

cache = genai.caching.CachedContent.create(
    model='models/gemini-1.5-flash-001',
    contents=[large_document],
    ttl=datetime.timedelta(minutes=60),
)

model = genai.GenerativeModel.from_cached_content(cached_content=cache)
```

## Design Rule: Stable Prefix First

Structure every prompt with stable content first, dynamic content last:

```
[CACHED]  System prompt
[CACHED]  Large document / knowledge base
[CACHED]  Few-shot examples
─────────────────────────────
[NOT CACHED]  Current user message
```

## Production Trap

::: danger
Putting dynamic content (timestamps, user IDs, session tokens) at the start of your prompt. This breaks caching entirely — every request becomes a cache miss.
:::

---

*Next: [Semantic Caching →](/guide/semantic-caching)*
