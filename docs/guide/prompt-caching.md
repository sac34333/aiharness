---
title: Prompt Caching - Provider-Level Caching
description: Claude cache_control, Gemini CachedContent, the 5 hard-won lessons from Claude Code, and Gemini's service tiers including Flex at 50% discount.
---

# Part 6b - Prompt Caching: Provider-Level Caching

> Source: [Claude Code Blog - Prompt Caching is Everything](https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything) (Apr 30, 2026)
> Source: [Google Gemini API Caching Docs](https://ai.google.dev/gemini-api/docs/caching.md.txt)

---

## The Intuition

KV cache is inside the inference server - transparent to you. **Prompt caching** is exposed to *you as a developer* via the API. You structure your prompt so the stable parts are a shared prefix, and every request that matches it pays ~1/10th the input token price.

> "It is often said in engineering that 'cache rules everything around me', and the same rule holds for agents." - Claude Code team

At Claude Code, prompt cache hit rate is monitored like uptime. They declare **SEVs (incidents)** when it drops too low. A few percentage points of cache miss rate dramatically affects cost and latency.

---

## The System Prompt Layout - The Core Rule

<div class="layer-stack">
<div class="layer">
  <div class="layer-num">1</div>
  <div class="layer-content">
    <strong>BASE SYSTEM INSTRUCTIONS + TOOLS</strong>
    <span>Globally cached - static, never changes between sessions. Cache hits here.</span>
  </div>
</div>
<div class="layer">
  <div class="layer-num">2</div>
  <div class="layer-content">
    <strong>CLAUDE.md / Memory / Project context</strong>
    <span>Cached per project - same within one project, changes project-to-project.</span>
  </div>
</div>
<div class="layer">
  <div class="layer-num">3</div>
  <div class="layer-content">
    <strong>SESSION STATE (env, MCP config, output style)</strong>
    <span>Cached per session - stable within a conversation.</span>
  </div>
</div>
<div class="layer layer-miss" style="background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-border);border-radius:8px;padding:1rem 1.25rem;margin-top:0.25rem;">
  <div class="layer-num" style="background:#999;">4</div>
  <div class="layer-content">
    <strong>MESSAGES (user messages, tool results, assistant responses)</strong>
    <span>Grows each turn - NOT cached. No cache benefit here.</span>
  </div>
</div>
</div>

**The core rule**: Prefix match, byte-for-byte, from the start. Any change *anywhere* in the prefix invalidates everything after it. Order is everything.

---

## The 5 Claude Code Lessons (All Hard-Won in Production)

### Lesson 1: Lay Out Your Prompt for Caching

Static first, dynamic last. They have broken this before by:
- Putting a timestamp in the static system prompt
- Shuffling tool order non-deterministically
- Updating tool parameter schemas

### Lesson 2: Use Messages for Updates, Not System Prompt Changes

If information becomes outdated (current time, file state, mode change), inserting it into the *next user message* via a `<system-reminder>` tag preserves the cache. Editing the system prompt = cache miss on every subsequent request.

### Lesson 3: Never Change Tools or Models Mid-Session

- Tools are part of the cached prefix. Add/remove a tool mid-conversation → cache invalidated for the *entire conversation*.
- **Claude Code's solution for Plan Mode**: Instead of swapping tool sets, they keep ALL tools in every request and use `EnterPlanMode` / `ExitPlanMode` as *tools the model calls itself*. Tool definitions never change.
- **Deferred loading**: For MCP tools, send lightweight stubs with `defer_loading: true`. The full schema loads only when selected. Stable stubs = stable prefix = cache preserved.
- **Don't switch models mid-session**: Prompt caches are *unique to each model*. Switching from Opus to Haiku at turn 50 means rebuilding the entire cache for Haiku from scratch - more expensive than Opus answering a simple question on a cache hit.

### Lesson 4: Fork Operations Must Share the Parent's Prefix

When running a side computation (compaction, summarization), use *identical* system prompt + tools as the parent.

```
WRONG - new system prompt = no cache hit = expensive:
POST /messages
  system: "Summarize the following conversation"  <- different prefix, no hit
  messages: [full conversation history]            <- pay full price for all

CORRECT - same prefix = cache hit = cheap:
POST /messages
  system: [exact same system prompt as parent]    <- cache hit! 1/10 price
  tools: [exact same tool list as parent]         <- cache hit!
  messages: [full conversation] + ["Summarize"]   <- only pay for new tokens
```

### Lesson 5: Monitor Your Cache Hit Rate Like You Monitor Uptime

Set up alerts. Treat drops as incidents. Measure it constantly.

---

## Compaction - How Claude Code Handles Long Conversations

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin:1.5rem 0;">
<div style="background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-border);border-radius:8px;padding:1rem;font-size:0.85rem;">
<strong style="display:block;margin-bottom:0.5rem;color:var(--vp-c-text-1);">BEFORE</strong>
<span style="color:var(--vp-c-text-2);font-size:0.75rem;">context nearly full</span>
<ul style="margin:0.75rem 0 0;padding-left:1.1rem;color:var(--vp-c-text-2);">
<li>System + Tools</li>
<li>user message 1</li>
<li>assistant + tools</li>
<li>user message 2</li>
<li>... many turns ...</li>
<li>[compaction buffer]</li>
</ul>
</div>
<div style="background:#FEF9E7;border:1px solid #D97757;border-radius:8px;padding:1rem;font-size:0.85rem;">
<strong style="display:block;margin-bottom:0.5rem;color:#D97757;">FORKED COMPACTION CALL</strong>
<ul style="margin:0.75rem 0 0;padding-left:1.1rem;color:var(--vp-c-text-2);">
<li>System + Tools (same prefix)</li>
<li>Full conversation</li>
<li style="color:#D97757;">cache hit = 1/10 price</li>
<li>+ "Summarize this"</li>
<li>→ Summary ~20k tokens</li>
</ul>
</div>
<div style="background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-border);border-radius:8px;padding:1rem;font-size:0.85rem;">
<strong style="display:block;margin-bottom:0.5rem;color:var(--vp-c-text-1);">AFTER</strong>
<span style="color:var(--vp-c-text-2);font-size:0.75rem;">context cleared</span>
<ul style="margin:0.75rem 0 0;padding-left:1.1rem;color:var(--vp-c-text-2);">
<li>System + Tools</li>
<li>compact_boundary</li>
<li>Conversation summary</li>
<li>Re-attached files</li>
<li>room for new turns</li>
</ul>
</div>
</div>

The forked call uses the exact parent prefix → cache hit → you pay 1/10th price for the largest part. Only the new compaction prompt is billed at full rate.

---

## Pricing Model

| Action | Price |
|---|---|
| Cache write (first time) | 1.25× normal |
| Cache read (every hit) | 0.10× normal |
| Break-even point | ~2 requests |
| After 10 requests | ~90% cost reduction on cached tokens |

---

## Google Gemini Caching - Implicit vs. Explicit

### Implicit Caching (Gemini 2.5+, auto-enabled)

Zero configuration. Google automatically passes on cost savings if your request hits existing caches. Check hits via `response.usage_metadata.cached_token_count`.

**Tip**: Put large, common content at the *beginning* of your prompt. Send requests with similar prefixes in a short time window to increase hit chances.

### Explicit Caching (manual, cost-saving guarantee)

```python
from google import genai
from google.genai import types

client = genai.Client()

# Step 1: Create a cache (5-minute TTL)
cache = client.caches.create(
    model="gemini-3-flash-preview",
    config=types.CreateCachedContentConfig(
        system_instruction="You are an expert analyzing transcripts.",
        contents=[document],    # the large stable document
        ttl="300s",             # cache for 5 minutes
        display_name="my-doc-cache"
    )
)

# Step 2: Use it in every request
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Please summarize this transcript",
    config=types.GenerateContentConfig(cached_content=cache.name)
)
print(response.usage_metadata)  # shows cached_token_count
```

**Best for**: Chatbots with extensive system instructions, repetitive video/PDF analysis, recurring queries against large document sets.

---

## Gemini Inference Service Tiers

| Tier | Price | Latency | Reliability | Best for |
|---|---|---|---|---|
| **Standard** | Full price | Seconds–minutes | High | General day-to-day apps |
| **Priority** | 75–100% premium | Seconds | Highest (non-sheddable) | Customer chatbots, real-time fraud detection |
| **Flex** | 50% of standard | 1–15 min target | Best-effort (sheddable) | Multi-step agent workflows, background CRM, offline evals |
| **Batch** | 50% of standard | Up to 24 hours | High throughput | Pre-processing datasets, regression suites, bulk embeddings |
| **Context Cache** | 90% discount + storage | Faster time-to-first-token | N/A | Recurring queries over same content |

> **Flex is the sleeper for agent workflows**: 50% discount, synchronous interface (no async code changes needed), and most multi-step agent chains are not latency-sensitive enough to need Priority pricing.

---

## Recall Hook

> **Stable top, dynamic bottom. Never change tools mid-session. Monitor cache hit rate like uptime. Fork operations must share the parent's prefix exactly. Gemini Flex = 50% off for agent workflows.**

---

## Sources

- [Claude Code - Prompt Caching is Everything](https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything) (Apr 30, 2026)
- [Google Gemini API Caching Docs](https://ai.google.dev/gemini-api/docs/caching.md.txt)
- [Google Gemini API Optimization & Service Tiers](https://ai.google.dev/gemini-api/docs/optimization.md.txt)

<div class="contribute-cta">

**Have prompt cache hit rate data from production?** [Share it](https://github.com/sac34333/aiharness/edit/main/docs/guide/prompt-caching.md) - real numbers are rare.

</div>
