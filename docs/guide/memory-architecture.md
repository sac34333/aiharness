---
title: Memory Architecture for AI Agents
description: The three memory types, ADK state scopes, and proactive memory patterns. Retrospective vs prospective memory with real research from ProMem and PASK (2026).
---

# PART 4 — Memory: The Hardest Part of Agents

> This is where most agent systems fail in production. Memory is not a feature — it is the foundation.

---

## 4.1 The Three Memory Types

```
+------------------------------------------------------------------------+
|                    MEMORY ARCHITECTURE                                  |
|                                                                        |
|  WORKSPACE MEMORY       USER MEMORY          GLOBAL MEMORY             |
|  (Per-conversation)     (Per-user)           (Shared/Long-term)        |
|  +------------------+  +-------------+      +----------------+         |
|  | Global context   |  | Background  |      | Working DB     |         |
|  | Char relations   |  | Personality |      | Learning DB    |         |
|  | Event develop.   |  | Hobbies     |      | Entertainment  |         |
|  +------------------+  | Past demand |      | ...            |         |
|                         +-------------+      +----------------+         |
|                                                      ^                  |
|                                               Retrieved via RAG         |
+------------------------------------------------------------------------+
```

| Memory Type | What it stores | Lifespan | Access method |
|---|---|---|---|
| **Workspace/Session** | Current conversation context, scratchpad | This conversation only | Direct (session.state) |
| **User Memory** | Preferences, personality, past interactions | Across sessions, per-user | Lookup by user_id |
| **Global Memory** | Org-wide knowledge, learned facts, policies | Persistent | RAG / semantic search |

### The Workplace Analogy

- **Workspace Memory** = your desktop right now. Temporary, specific to what you're working on.
- **User Memory** = your manager's notes about you from your last 3 reviews. Persists, personal.
- **Global Memory** = the company wiki. Everyone can query it. Retrieved when relevant.

---

## 4.2 ADK State Scopes — The Right Tool for Each Memory Type

In ADK, `session.state` is a single dictionary — but prefixes control scope and persistence:

```python
# NO PREFIX — lives only in this session (conversation)
session.state['current_intent'] = 'book_flight'
# --> Equivalent to: Workspace Memory (temp scratchpad)

# user: prefix — persists per user across all sessions
session.state['user:preferred_language'] = 'fr'
# --> Equivalent to: User Memory

# app: prefix — shared across ALL users of this app
session.state['app:global_discount_code'] = 'SAVE10'
# --> Equivalent to: Shared config/feature flags

# temp: prefix — lives only within THIS invocation (not even across turns)
session.state['temp:raw_api_response'] = {}
# --> Throwaway scratch space — never persists
```

### Storage Backends

| Service | Persistence | Use When |
|---|---|---|
| `InMemorySessionService` | None (lost on restart) | Development/testing |
| `DatabaseSessionService` | Yes (your Postgres/MySQL) | Self-managed production |
| `VertexAiSessionService` | Yes (Google-managed, scalable) | Google Cloud production |

### Recall Hook

> **No prefix = this chat · user: = this person · app: = everyone · temp: = this one call**

---

## 4.3 Mem0 — Proactive Memory for Production Agents

> Source: [Mem0 Blog — Proactive Memory in AI Agents: A Developer's Guide](https://mem0.ai/blog/proactive-memory-in-ai-agents-a-developer-s-guide) (May 1, 2026)

Mem0 is a memory orchestration layer that solves a fundamental gap: **agents today have excellent retrospective recall ("what did we discuss?") but zero prospective recall ("surface this when the context changes").**

### The Core Insight: Prospective vs Retrospective Memory

**Retrospective (what most agents have)**: User asks → agent searches memory → responds. *The user is always the trigger.*

**Prospective (what Mem0 enables)**: Context changes → agent fires relevant memories *before* the user has to re-explain. Like a colleague who brings up last week's decision *when you open the right file*, not when you ask.

> The cognitive science term is **prospective memory** — memory attached to a future context trigger, not a past query. "When I see auth.py, surface the OAuth blocker from last week."

---

### The Research Behind This (2026)

**ProMem** (arXiv:2601.04463 — Yang et al., Jan 2026) identifies two structural failures in standard memory extraction:
1. **Feed-forward extraction**: Memory is summarized *before* the agent knows what future tasks will need. Critical specifics get dropped because the extraction pass does not know they will matter later.
2. **One-off extraction**: Single-pass. If something is missed, it is gone. No self-correction.

ProMem's fix: a **two-stage self-questioning loop** — Stage 1 extracts obvious facts, Stage 2 asks "What questions could a future user ask that I didn't capture?" then goes back to the transcript to answer those gaps.

**PASK** (arXiv:2604.08000 — Xie et al., Apr 2026) addresses the *surfacing* side. Its central finding:
> Most models are good at either intervening OR staying silent — but not both. **Knowing when NOT to fire is as important as knowing when to fire.**

PASK proposes a streaming **IntentFlow classifier** trained to make a binary `DEMAND / NO_DEMAND` decision on every turn — reading the current message *in context of recent history*, not just keyword matching.

---

### Three Proactive Memory Patterns

#### PATTERN 1 — Session-Start Scan

```
Session opens -> Context probe (time, open file, project name)
             -> Mem0.search(query shaped around context signals)
             -> Inject into system prompt
             -> User speaks -> Agent already has context loaded
```

The query is not "find all memories" — it is a *precise probe shaped around what you know about right now*.

```python
def session_start_scan(memory, user_id, context, limit=3):
    hour = datetime.now().hour
    time_of_day = "morning" if hour < 12 else "afternoon" if hour < 17 else "evening"
    query = "What was this user recently working on or blocked by"
    if context.get("project"):
        query += f" in project {context['project']}"
    if context.get("open_file"):
        query += f" related to {context['open_file']}"
    query += f"? It is {time_of_day}."
    return memory.search(query, filters={"user_id": user_id}, top_k=limit)

# The difference:
# Reactive agent: "Hey, back on auth service. Where were we?" -> searches now
# Proactive agent: ALREADY loaded "blocked on OAuth token refresh in auth.py,
#                  identified await chain as cause. Project moved to Postgres."
```

**Production use**: Support agent that already knows the user's tier, last 3 tickets, and current blocker *before they say a word*. No new infrastructure — one async search call while the UI loads.

---

#### PATTERN 2 — Context-Trigger Scan

```
User message -> Intent classifier (LLM prompt, OUTSIDE Mem0)
            |
        DEMAND? --> Mem0.search(targeted query) -> Surface mid-conversation
        NO_DEMAND? --> Skip search, continue normally
```

**Trigger signals that indicate DEMAND:**
- File reference: user mentions or opens a specific file
- Error detected: "exception", "failed", "broken" appears
- Tool invocation: about to deploy, run tests, do migration
- Topic shift: conversation moves to a clearly different domain

**The PASK finding**: Use a classifier, not keyword detection. Keywords miss context shifts that lack obvious signals and false-positive on resolved issues.

```python
def detect_intent(chat, message, history):
    # Recent history + message -> LLM classifies DEMAND/NO_DEMAND
    # Returns: {decision: "DEMAND", query: "database.py pool config"}
    # or:      {decision: "NO_DEMAND", query: null}
    ...

# Regex fallback for obvious signals (file extensions, error words)
_DEMAND_PATTERNS = [
    r"\b[\w\-]+\.(py|ts|js|sql|yaml)\b",  # file reference
    r"\b(error|bug|blocker|failing)\b",         # error signals
    r"\bwhere we left off\b",                   # continuation signal
]
```

**Key insight**: Memory search is *not free*. Firing it on every turn is wrong. The classifier is a gating layer — you pay for retrieval only when the conversation actually needs it.

---

#### PATTERN 3 — Scheduled Reflection Scan

```
[AFTER SESSION — async, offline]        [NEXT SESSION — zero LLM cost]
Session ends                            New session opens
-> Mem0.get_all()                       -> Mem0.search("[PROACTIVE]")
-> Reflection LLM reasons over          -> Inject pre-computed results
  all memories (OUTSIDE Mem0)             into system prompt
-> Identify unresolved blockers,        -> User speaks, agent is ready
  pending tasks, forgotten decisions
-> Mem0.add([PROACTIVE] tags)
```

The ProMem self-questioning applied here: the reflection LLM asks:
- "What unresolved blockers should surface at next session start?"
- "What decisions made today should be remembered for next week?"
- "What context would this user need if they come back cold?"

```python
def run_reflection(memory, chat, user_id):
    """Runs after session ends, asynchronously. NOT in the live conversation."""
    envelope = memory.get_all(user_id=user_id)
    memories = envelope.get("results", [])  # Note: paginated envelope
    # Reflection LLM pre-computes what to surface next session
    memory.add(
        [{"role": "system", "content": f"[PROACTIVE] {item}"} for item in items],
        user_id=user_id,
        metadata={"type": "proactive_hint"}
    )

def on_reflection_session_open(memory, user_id):
    """At next session start — zero LLM call needed."""
    return memory.search("[PROACTIVE]", user_id=user_id, limit=3)
```

**The cost inversion**: Expensive reasoning happens *offline*. At session start, you just do a cheap lookup of pre-computed answers. The user gets instant context at zero inference cost.

---

### Production Failure Modes

| Failure | Cause | Fix |
|---|---|---|
| **Noise injection** | Session-start scan with too broad a query surfaces irrelevant memories | Use precision probe queries + relevance threshold — discard below threshold |
| **Over-proactivity fatigue** | Agent volunteers memories on every turn | Rate-limit: one injection at session start, one per significant context shift |
| **Latency at session start** | Search round-trip before first response | Run scan async while UI loads — memories arrive before first message |
| **Extraction completeness vs. cost** | ProMem self-questioning loop costs more tokens | Gate reflection depth on session length + importance signals |

### The Open Problem (2026)

The prospective memory primitive — memory with an **attached trigger condition that fires when the condition is met** — does not exist yet as a first-class primitive in any production memory system. Current patterns (tagging pre-computed hints with metadata) approximate it. A formal `prospective_memory` type is the next frontier.

### Recall Hook

> **Retrospective = user triggers · Prospective = context triggers · Three patterns: Preload → Gate → Reflect offline**

---

## 4.4 ADK Context Types — Which One Do You Use Where?

The framework injects the *right* type of context depending on *where* your code runs. ADK chooses for you — but you need to know each one:

```
+--------------------------------------------------------------------+
|             CONTEXT TYPE QUICK REFERENCE                           |
|                                                                    |
|  ReadonlyContext   -> Dynamic instruction providers                |
|  CallbackContext  -> Guardrails, logging, state mutation           |
|  ToolContext      -> Tool functions (+ auth, memory search)        |
|  InvocationContext -> Core agent logic (_run_async_impl)           |
+--------------------------------------------------------------------+
```

| Context | Read State | Write State | Artifacts | Auth/Memory | Where used |
|---|---|---|---|---|---|
| ReadonlyContext | Yes | No | No | No | Dynamic instructions |
| CallbackContext | Yes | Yes | Yes | No | Guardrail callbacks |
| ToolContext | Yes | Yes | Yes | Yes | Tool functions |
| InvocationContext | Yes | Yes | Yes | Yes | Core agent logic |

**InvocationContext (`ctx`) — what's inside:**
```python
ctx.session          # Full conversation (history + state)
ctx.agent            # Which agent is running
ctx.invocation_id    # Unique ID for this run
ctx.artifact_service # Save/load files
ctx.end_invocation   # Set True to force-stop everything
```

### Recall Hook

> **Read-only for instructions · Callback for guardrails · Tool for actions · Invocation for core logic**

---

## Sources

- [Mem0 Blog — Proactive Memory in AI Agents: A Developer's Guide](https://mem0.ai/blog/proactive-memory-in-ai-agents-a-developer-s-guide) (May 1, 2026)
- ProMem: arXiv:2601.04463 — *"Beyond Static Summarization: Proactive Memory Extraction for LLM Agents"* (Yang et al., Jan 2026)
- PASK: arXiv:2604.08000 — *"Toward Intent-Aware Proactive Agents with Long-Term Memory"* (Xie et al., Apr 2026)
- Google ADK Documentation: Session State, Context Types

<div class="contribute-cta">

**Implemented proactive memory in production?** [Share what worked](https://github.com/sac34333/aiharness/edit/main/docs/guide/memory-architecture.md) — real patterns from real systems welcome.

</div>
