---
title: What Is an AI Agent?
description: From LLM autocomplete to autonomous actors. The shift from predictor to agent, the anatomy of an agent system, and the Think→Act→Observe loop.
---

# PART 1 — What Is an AI Agent?

> Every section follows the same 4-part structure: **The Intuition** → **The Technical Reality** → **The Production Trap** → **The Recall Hook**

> **Reference note**: Several examples in this guide use [Google ADK](https://adk.dev/) — an open-source agent development framework — to illustrate production patterns. The principles apply across frameworks.

---

## 1.1 The Shift: Predictor → Actor

### The Intuition

Old AI = a **very smart autocomplete**. You ask, it predicts. It has no awareness of the world, no plan, no actions. It's a parrot.

An Agent = a **junior employee** you give a goal to. They don't need you to tell them every step. They reason, use tools, check results, and adjust — until the goal is done.

> The shift is from *"finish my sentence"* to *"go do the job."*

### The Technical Reality

An LLM alone is stateless and passive. An Agent adds:
- A **loop** around the LLM (Think → Act → Observe → repeat)
- **Tools** the LLM can call to interact with the real world
- **Memory** so it remembers what it already did
- **Orchestration** to manage when to think vs. when to act

**Shortest definition you will ever need:**
> `Agent = LLM in a loop + Tools to accomplish an objective`

### The Production Trap

People think "agent" = "just add a prompt." It's not. An agent is a **complete application** with state management, tool execution, failure handling, and observability. Treat it like building a microservice, not writing a prompt.

### Recall Hook

> **Agent = Employee, not Autocomplete.** It has a mission, uses tools, and reports back.

---

## 1.2 The Anatomy of an Agent

```
+-----------------------------------------------------------+
|                         AI AGENT                          |
|                                                           |
|  MODEL (Brain)      TOOLS (Hands)    ORCHESTRATION        |
|  Reasons/plans      APIs, DBs,       Manages the loop,   |
|  Decides            Code exec,       memory, state,      |
|  Generates          Search, HITL     planning strategy   |
|                                                           |
|  DEPLOYMENT (The Body)                                    |
|  Monitoring  Logging  Scaling  A2A APIs                   |
+-----------------------------------------------------------+
```

### Body Analogy

| Component | Body Part | What it does |
|---|---|---|
| **Model** | Brain | Reasons, decides, plans |
| **Tools** | Hands | Acts on the world |
| **Orchestration** | Nervous System | Manages the Think→Act→Observe loop |
| **Deployment** | Body + Legs | Gets the agent out into the world |

### Each Component in Detail

**MODEL (The Brain)**
- The LLM. Its quality determines the agent ceiling.
- Choosing by benchmarks alone = path to failure. Test on *your* task metrics.
- **Model Routing** (production pattern): Use Gemini 2.5 Pro for complex planning → route to Gemini 2.5 Flash for simple summarization. Same agent, 70% lower cost.
- **Agent Ops rule**: models are superseded every 6 months. You need a CI/CD pipeline to swap brains without architectural overhaul.

**TOOLS (The Hands)**
- *Retrieving*: RAG (docs), NL2SQL (databases) — grounds responses in facts, kills hallucinations
- *Executing*: Wrapped APIs (send email, update CRM), code execution in sandboxes
- *Human-in-the-Loop*: `ask_for_confirmation()` — agent pauses, human approves, then resumes
- Tools are exposed via **Function Calling**. Standards: OpenAPI spec, MCP protocol.
- **Native tools**: Gemini has Google Search built-in as a native tool (baked into the LLM call itself).

**ORCHESTRATION (The Nervous System)**
- Runs the Think→Act→Observe loop
- Manages *how* the agent reasons: Chain-of-Thought, ReAct (Reason + Act interleaved)
- Manages *memory*: what the agent knows right now (short-term) vs. what it should remember across sessions (long-term)
- Design choice: No-code builders (fast, limited) vs. code-first frameworks like **ADK** (full control, production-grade)

**CoT vs ReAct — the two reasoning modes:**

| | Chain-of-Thought (CoT) | ReAct |
|---|---|---|
| **What it does** | Internal reasoning only | Reasoning + tool calls interleaved |
| **Best for** | Logic, planning, static tasks | Live data, real-world actions |
| **Example** | Drafting a plan, solving a puzzle | Booking a flight, checking a stock price |

> Modern agents use both — CoT for internal reasoning, ReAct when external actions are needed.

**DEPLOYMENT (The Body)**
- Not just "put it on a server" — monitoring, logging, rate limiting, auth
- Agents talk to users via GUI or to **other agents via A2A protocol**

### Recall Hook

> **Brain · Hands · Nervous System · Body** — model, tools, orchestration, deployment.

---

## 1.3 The Think → Act → Observe Loop

### The Intuition

Imagine a detective:
1. Gets the **mission** (solve the case)
2. **Scans** available evidence
3. **Thinks** through the strategy
4. **Acts** (interviews a suspect, checks records)
5. **Observes** the result — updates their mental model
6. Loops until the case is solved

That is exactly the agent loop.

### The Technical Reality

<div class="flow-diagram">
<div class="flow-step">🎯 <strong>1. MISSION</strong> — User goal arrives</div>
<div class="flow-arrow"></div>
<div class="flow-step">🔍 <strong>2. SCAN</strong> — Load context + memory</div>
<div class="flow-arrow"></div>
<div class="flow-step">🧠 <strong>3. THINK</strong> — LLM reasons, makes plan</div>
<div class="flow-arrow"></div>
<div class="flow-step">⚡ <strong>4. ACT</strong> — Call a tool / API</div>
<div class="flow-arrow"></div>
<div class="flow-step">👁️ <strong>5. OBSERVE</strong> — Get result, update state → <em>loop back to THINK until done</em></div>
<div class="flow-arrow"></div>
<div class="flow-step">✅ <strong>6. REPORT</strong> — Final answer to user</div>
</div>

The orchestration layer manages this loop. Each cycle:
- The model sees: system prompt + conversation history + tool results so far
- It decides: keep thinking? call a tool? give final answer?
- The loop terminates when the agent decides it is done or a max turn limit is hit

**ReAct Pattern** (most common reasoning strategy):

### The Production Trap

Loops can go infinite. Always set `max_llm_calls`. Also: the agent think step costs tokens every iteration.

### Recall Hook

> **Mission → Scan → Think → Act → Observe → Loop** — the detective cycle.

---

## Sources

- Google ADK Whitepaper: *Introduction to Agents*
- Google ADK Documentation: [adk.dev](https://adk.dev/)

<div class="contribute-cta">

**See something wrong or missing?** [Edit this page on GitHub](https://github.com/sac34333/aiharness/edit/main/docs/guide/what-is-agent.md) — reviewed before publishing.

</div>
