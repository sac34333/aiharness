---
title: Memory Architecture Deep Dive
description: Where most agent systems fail in production. Session memory, user memory, global memory — and the 3 proactive patterns that make memory work.
---

# Memory Architecture Deep Dive

> Memory is not a feature — it's the foundation. Where most agent systems fail in production.

## The Three Memory Types

| Type | Scope | Analogy | Persistence |
|---|---|---|---|
| **Session Memory** | This conversation only | Your desktop right now | Disappears on close |
| **User Memory** | Per user, across sessions | Manager's notes about you | Permanent, per-user |
| **Global Memory** | All users, org-wide | The company wiki | Permanent, shared |

Most AI deployments only implement session memory. That's why agents feel sharp in the moment — and useless the next time you open them.

## Retrospective vs Prospective Memory

Two fundamentally different approaches to retrieval:

**Retrospective** — The user is always the trigger.
- You ask → agent searches memory → agent responds
- Like a filing cabinet: open only when you walk up and ask

**Prospective** — The situation is the trigger.
- Context changes → agent proactively surfaces relevant memory → user already has what they need
- Like a colleague who read your file before picking up the phone

## The Three Proactive Patterns

### Pattern 1: Session-Start Scan

Before the user types a single word, the system reads context signals (time, project, open file) and preloads relevant memories into the system prompt.

**The trick:** Run this async while the UI loads. The user waits for the spinner anyway — use that time.

### Pattern 2: Context-Trigger Scan

Mid-conversation, a lightweight classifier reads each message and decides: does this message need memory retrieval?

- File mentioned → search memory
- Error signal → search memory  
- "ok thanks" → skip search entirely

**The key insight:** Knowing when NOT to fire is as important as knowing when to fire.

### Pattern 3: Scheduled Reflection

After the session ends — when the user is away — an LLM runs over the session and asks:
- What's still unresolved?
- What would this person need when they come back cold?

The answers get stored. Next session open = fast, cheap vector lookup of pre-computed results.

**The trick:** The expensive LLM reasoning happens offline. The user never feels it.

## Production Traps

::: danger Most Common Mistake
Building session memory and calling it "memory." It disappears on close. Users re-explain everything every session. They eventually stop using the product.
:::

::: warning Second Most Common
Searching memory on every message. Costs compound, latency spikes, UX degrades. Put a classifier gate in front.
:::

## ADK State Scopes

```python
# NO PREFIX — lives only in this session
session.state['current_intent'] = 'book_flight'

# user: prefix — persists per user across all sessions  
session.state['user:preferred_language'] = 'fr'

# app: prefix — shared across ALL users
session.state['app:global_discount_code'] = 'SAVE10'

# temp: prefix — lives only within THIS invocation
session.state['temp:raw_api_response'] = {...}
```

---

*Next: [Google ADK →](/guide/google-adk)*

<div class="contribute-cta">

**Built a memory pattern that works in production?** [Share it here](https://github.com/sac34333/aiharness/edit/main/docs/guide/memory-architecture.md) — all contributions reviewed before publishing.

</div>
