# AI Agents & Systems — Master Learning Guide
> Covers: Google ADK · Mem0 Memory · KV Cache · Prompt Caching · Multi-Agent Patterns · Production Ops  
> Goal: Build intuition → go technical → recall instantly → apply in production

---

## HOW TO USE THIS GUIDE

Every section follows the same 4-part structure:  
1. **The Intuition** (non-technical analogy) — what it *is*  
2. **The Technical Reality** — how it actually *works*  
3. **The Production Trap** — what breaks at scale  
4. **The Recall Hook** — one sentence to burn it into memory  

---

# PART 1 — WHAT IS AN AI AGENT?

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

**Shortest definition you'll ever need:**
> `Agent = LLM in a loop + Tools to accomplish an objective`

### The Production Trap
People think "agent" = "just add a prompt." It's not. An agent is a **complete application** with state management, tool execution, failure handling, and observability. Treat it like building a microservice, not writing a prompt.

### Recall Hook
> **Agent = Employee, not Autocomplete.** It has a mission, uses tools, and reports back.

---

## 1.2 The Anatomy of an Agent

```
┌─────────────────────────────────────────────────────────────┐
│                         AI AGENT                            │
│                                                             │
│  🧠 MODEL          🛠️ TOOLS         ⚙️ ORCHESTRATION        │
│  (The Brain)       (The Hands)      (The Nervous System)    │
│  Reasons/plans     APIs, DBs,       Manages the loop,       │
│  Decides           Code exec,       memory, state,          │
│  Generates         Search, HITL     planning strategy        │
│                                                             │
│  🚀 DEPLOYMENT (The Body)                                   │
│  Monitoring · Logging · Scaling · A2A APIs                  │
└─────────────────────────────────────────────────────────────┘
```

### The Intuition — Body Analogy

| Component | Body Part | What it does |
|---|---|---|
| **Model** | Brain | Reasons, decides, plans |
| **Tools** | Hands | Acts on the world |
| **Orchestration** | Nervous System | Manages the Think→Act→Observe loop |
| **Deployment** | Body + Legs | Gets the agent out into the world |

### The Technical Reality — Each Component

**MODEL (The Brain)**
- The LLM. Its quality determines the agent's ceiling.
- Choosing by benchmarks alone = path to failure.
- Right approach: test on *your* task's metrics (accuracy on your docs, tool-call reliability on your APIs).
- **Model Routing** (production pattern): Use Gemini 2.5 Pro for complex planning → route to Gemini 2.5 Flash for simple summarization. Same agent, 70% lower cost.
- **Agent Ops rule**: models are superseded every 6 months. You need a CI/CD pipeline to swap brains without architectural overhaul.

**TOOLS (The Hands)**
- *Retrieving*: RAG (docs), NL2SQL (databases) → grounds responses in facts, kills hallucinations
- *Executing*: Wrapped APIs (send email, update CRM), code execution in sandboxes
- *Human-in-the-Loop*: `ask_for_confirmation()` — agent pauses, human approves, then resumes
- Tools are exposed via **Function Calling**. Standards: OpenAPI spec, MCP protocol.
- **Native tools**: Gemini has Google Search built-in as a native tool (not a function call — baked into the LLM call itself).

**ORCHESTRATION (The Nervous System)**
- Runs the Think→Act→Observe loop
- Manages *how* the agent reasons: Chain-of-Thought, ReAct (Reason + Act interleaved)
- Manages *memory*: what the agent knows right now (short-term) vs. what it should remember across sessions (long-term)
- Design choice: No-code builders (fast, limited) vs. code-first frameworks like **ADK** (full control, production-grade)

**DEPLOYMENT (The Body)**
- Not just "put it on a server" — it's monitoring, logging, rate limiting, auth
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
5. **Observes** the result → updates their mental model
6. Loops until the case is solved

That's exactly the agent loop.

### The Technical Reality
```
┌─────────────────────────────────────────────┐
│              AGENT LOOP                     │
│                                             │
│  1. MISSION        User goal arrives        │
│  2. SCAN           Load context + memory    │
│  3. THINK          LLM reasons, makes plan  │
│  4. ACT            Call a tool / API        │
│  5. OBSERVE        Get result, update state │
│  └──────────────── loop until done ────────┘
│  6. REPORT         Final answer to user     │
└─────────────────────────────────────────────┘
```

The orchestration layer manages this loop. Each cycle:
- The model sees: system prompt + conversation history + tool results so far
- It decides: keep thinking? call a tool? give final answer?
- The loop terminates when the agent decides it's done or a max turn limit is hit

**ReAct Pattern** (most common reasoning strategy):
```
Thought: "I need to find the halfway point first"
Action: maps_tool(origin="Mountain View", destination="SF")
Observation: "Halfway point is Millbrae"
Thought: "Now I search for coffee in Millbrae"
Action: search_tool(query="good coffee in Millbrae")
Observation: [results...]
Final Answer: "Try Blue Bottle in Millbrae"
```

### The Production Trap
Loops can go infinite. Always set `max_llm_calls` (ADK default: 500). Also: the agent's "think" step costs tokens every iteration. A poorly-scoped task can burn through budget fast.

### Recall Hook
> **Mission → Scan → Think → Act → Observe → Loop** — the detective cycle.

---

# PART 2 — TAXONOMY: WHAT KIND OF AGENT ARE YOU BUILDING?

## The 5 Levels — From Brain to Self-Evolving System

### The Intuition
Think of hiring: you wouldn't hire a contractor without knowing the job scope. Same here — pick the right level of agent for the complexity of the task.

```
Level 0  ─  The Encyclopedia          Just knowledge, no tools
Level 1  ─  The Connected Expert      Knowledge + can look things up
Level 2  ─  The Strategist            Plans multi-step, chains outputs
Level 3  ─  The Manager               Delegates to a team of specialists
Level 4  ─  The Growing Organization  Builds its own new specialists
```

### Level 0: Core Reasoning System (The Encyclopedia)
- **What**: LLM alone, no tools, no memory
- **What it can do**: Answer from training data
- **Production use**: FAQ chatbot on known, static content
- **Limit**: Knowledge cutoff. Can't act. Can't look things up.

### Level 1: The Connected Problem-Solver
- **What**: LLM + external tools (Search, Calculator, DB queries)
- **What it can do**: Answer about real-time events, current data
- **Production use**: Customer support agent that can look up order status
- **Technique**: Function calling — the LLM decides which tool to use, ADK executes it

### Level 2: The Strategic Problem-Solver
- **What**: LLM + tools + **planning** (multi-step, uses output of step N as input to step N+1)
- **The Key Concept**: **Context Engineering** — the output of one step is shaped into precise input for the next
- **Production example (coffee shop case)**:
  ```
  Step 1: maps_tool("Mountain View", "SF") → "Millbrae"
  Step 2: search_tool("good coffee in Millbrae") ← uses output from step 1
  ```
- **Production use**: Research agent, code review pipeline, document analysis workflows

### Level 3: The Collaborative Multi-Agent System
- **What**: A "Project Manager" agent + specialized sub-agents
- **Why not one giant agent**: Specialization. Each agent has a focused system prompt, relevant tools, and smaller context → cheaper, faster, more reliable
- **Production example — Product Launch**:
  ```
  OrchestratorAgent → MarketingAgent (writes press release)
                     → WebDevAgent (builds landing page)
                     → DataAgent (pulls competitor analysis)
  ```
- **Communication**: Agents share state via session.state or A2A protocol

### Level 4: The Self-Evolving System
- **What**: System creates new tools or new agents *on the fly* when it detects a capability gap
- **Production use**: Very experimental. Research/internal automation. Not for customer-facing prod yet.
- **The key skill**: Agent identifies "I don't have a tool for this" and generates one dynamically

### Recall Hook
> **Encyclopedia → Expert → Strategist → Manager → Self-Growing Org** — pick your level before you write a line of code.

---

# PART 3 — MULTI-AGENT DESIGN PATTERNS

### The Intuition
Every engineering org has an org chart. Multi-agent systems are just org charts for AI. Pick the structure that matches your workflow.

```
SEQUENTIAL   →  Assembly line. Step A must finish before Step B starts.
PARALLEL     →  Multiple teams working on different tasks simultaneously.
LOOP         →  Quality cycle. Run → Check → Repeat until good enough.
REVIEW       →  Generator + Critic. Writer + Editor.
COORDINATOR  →  Project manager dispatches work to specialists.
SWARM        →  All agents collaborate peer-to-peer, refining together.
REACT        →  Single agent, iterative think→act→observe loop.
HITL         →  Human approval gates at critical decision points.
```

### When to Use Which Pattern (Production Decision Guide)

| Use Case | Pattern | Why |
|---|---|---|
| ETL pipeline: Extract → Clean → Load | Sequential | Order matters |
| Gather competitor data from 5 sources simultaneously | Parallel | Speed, independent tasks |
| Code generation that must pass tests | Loop | Quality gate |
| Content generation with quality control | Review/Critique | Generator + critic |
| Complex project with many subtasks | Coordinator/Hierarchical | Delegation at scale |
| Research synthesis from many specialists | Swarm | Collective refinement |
| Any standard chat agent | ReAct | Default pattern |
| Financial transactions, medical decisions | HITL | Legal/compliance requirement |

### In Google ADK
```python
# Sequential — runs agents in order
SequentialAgent(sub_agents=[ResearchAgent, DraftAgent, ReviewAgent])

# Parallel — runs agents simultaneously  
ParallelAgent(sub_agents=[Source1Agent, Source2Agent, Source3Agent])

# Loop — runs until condition met
LoopAgent(sub_agent=RefineAgent, max_iterations=5)

# Dynamic routing — LLM decides next agent
RouterAgent(sub_agents=[BillingAgent, SupportAgent, SalesAgent])
```

### Recall Hook
> **Assembly line → Parallel teams → Quality loop → Manager → Peer network** — match the pattern to the workflow shape.

---

# PART 4 — MEMORY: THE HARDEST PART OF AGENTS

> This is where most agent systems fail in production. Memory is not a feature — it's the foundation.

## 4.1 The Three Memory Types (From the Architecture Diagram)

```
┌──────────────────────────────────────────────────────────────────┐
│                    MEMORY ARCHITECTURE                           │
│                                                                  │
│  WORKSPACE MEMORY        USER MEMORY          GLOBAL MEMORY      │
│  (Per-conversation)      (Per-user)           (Shared/Long-term) │
│  ┌─────────────────┐    ┌─────────────┐      ┌───────────────┐  │
│  │ Global context  │    │ Background  │      │ Working DB    │  │
│  │ Char relations  │    │ Personality │      │ Learning DB   │  │
│  │ Event develop.  │    │ Hobbies     │      │ Entertainment │  │
│  └─────────────────┘    │ Past demand │      │ ...           │  │
│                         └─────────────┘      └───────────────┘  │
│                                                      ↑           │
│                                               Retrieved via RAG  │
└──────────────────────────────────────────────────────────────────┘
```

| Memory Type | What it stores | Lifespan | Access method |
|---|---|---|---|
| **Workspace/Session** | Current conversation context, scratchpad | This conversation only | Direct (session.state) |
| **User Memory** | Preferences, personality, past interactions | Across sessions, per-user | Lookup by user_id |
| **Global Memory** | Org-wide knowledge, learned facts, policies | Persistent | RAG / semantic search |

### The Intuition — The Workplace Analogy
- **Workspace Memory** = your desktop right now. Temporary, specific to what you're working on.
- **User Memory** = your manager's notes about you from your last 3 reviews. Persists, personal.
- **Global Memory** = the company wiki. Everyone can query it. Retrieved when relevant.

---

## 4.2 ADK State Scopes — The Right Tool for Each Memory Type

### The Technical Reality
In ADK, `session.state` is a single dictionary — but prefixes control scope and persistence:

```python
# NO PREFIX — lives only in this session (conversation)
session.state['current_intent'] = 'book_flight'
# → Equivalent to: Workspace Memory (temp scratchpad)

# user: prefix — persists per user across all sessions
session.state['user:preferred_language'] = 'fr'
# → Equivalent to: User Memory

# app: prefix — shared across ALL users of this app
session.state['app:global_discount_code'] = 'SAVE10'
# → Equivalent to: Shared config/feature flags

# temp: prefix — lives only within THIS invocation (not even across turns)
session.state['temp:raw_api_response'] = {...}
# → Throwaway scratch space — never persists
```

### Storage Backends (Session Services)

| Service | Persistence | Use When |
|---|---|---|
| `InMemorySessionService` | None (lost on restart) | Development/testing |
| `DatabaseSessionService` | Yes (your Postgres/MySQL) | Self-managed production |
| `VertexAiSessionService` | Yes (Google-managed, scalable) | Google Cloud production |

### Recall Hook
> **No prefix = this chat · user: = this person · app: = everyone · temp: = this one call**

---

## 4.3 Mem0 — Proactive Memory for Production Agents

> Source: [Mem0 Blog — Proactive Memory in AI Agents](https://mem0.ai/blog/proactive-memory-in-ai-agents-a-developer-s-guide) (May 1, 2026)

Mem0 is a memory orchestration layer that solves a fundamental gap: **agents today have excellent retrospective recall ("what did we discuss?") but zero prospective recall ("surface this when the context changes").**

### The Core Insight: Prospective vs Retrospective Memory

**Retrospective (what most agents have)**: User asks → agent searches memory → responds. *The user is always the trigger.*

**Prospective (what Mem0 enables)**: Context changes → agent fires relevant memories *before* the user has to re-explain. Like a colleague who brings up last week's decision *when you open the right file*, not when you ask.

> The cognitive science term is **prospective memory** — memory attached to a future context trigger, not a past query. "When I see auth.py, surface the OAuth blocker from last week."

### The Research Behind This (2026)

**ProMem** (arXiv:2601.04463 — Yang et al., Jan 2026) identifies two structural failures in standard memory extraction:
1. **Feed-forward extraction**: Memory is summarized *before* the agent knows what future tasks will need. Critical specifics get dropped because the extraction pass doesn't know they'll matter later.
2. **One-off extraction**: Single-pass. If something is missed, it's gone. No self-correction.

ProMem's fix: a **two-stage self-questioning loop** — Stage 1 extracts obvious facts, Stage 2 asks "What questions could a future user ask that I didn't capture?" then goes back to the transcript to answer those gaps.

**PASK** (arXiv:2604.08000 — Xie et al., Apr 2026) addresses the *surfacing* side. Its central finding:
> Most models are good at either intervening OR staying silent — but not both. **Knowing when NOT to fire is as important as knowing when to fire.**

PASK proposes a streaming **IntentFlow classifier** trained to make a binary `DEMAND / NO_DEMAND` decision on every turn — reading the current message *in context of recent history*, not just keyword matching.

### Three Patterns You Must Know

#### PATTERN 1 — Session-Start Scan
```
Session opens → Context probe (time, open file, project name) 
             → Mem0.search(query shaped around context signals)
             → Inject into system prompt 
             → User speaks → Agent already has context loaded
```

**The key**: The query is not "find all memories" — it's a *precise probe shaped around what you know about right now*.

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
# Reactive agent: "Hey, back on auth service. Where were we?" → searches now
# Proactive agent: ALREADY loaded "blocked on OAuth token refresh in auth.py,
#                  identified await chain as cause. Project moved to Postgres."
```

**Production use**: Support agent that already knows the user's tier, last 3 tickets, and current blocker *before they say a word*. No new infrastructure — one async search call while the UI loads.

#### PATTERN 2 — Context-Trigger Scan
```
User message → Intent classifier (LLM prompt, OUTSIDE Mem0)
            ↓
        DEMAND? ─→ Mem0.search(targeted query) → Surface mid-conversation
        NO_DEMAND? ─→ Skip search, continue normally
```

**Trigger signals that indicate DEMAND:**
- File reference: user mentions or opens a specific file
- Error detected: "exception", "failed", "broken" appears
- Tool invocation: about to deploy, run tests, do migration
- Topic shift: conversation moves to a clearly different domain

**The PASK finding that makes this practical**: Use a classifier, not keyword detection. Keywords miss context shifts that lack obvious signals and false-positive on resolved issues.

```python
def detect_intent(chat, message, history) -> Intent:
    # Recent history + message → LLM classifies DEMAND/NO_DEMAND
    # Returns: {decision: "DEMAND", query: "database.py pool config"}
    # or:      {decision: "NO_DEMAND", query: null}
    ...

# Regex fallback for obvious signals (file extensions, error words)
# ensures classifier stays reliable when LLM hedges on clear cases
_DEMAND_PATTERNS = [
    r"\b[\w\-]+\.(py|ts|js|sql|yaml)\b",  # file reference
    r"\b(error|bug|blocker|failing)\b",     # error signals
    r"\bwhere we left off\b",               # continuation signal
]
```

**Key insight**: Memory search is *not free*. Firing it on every turn is wrong. The classifier is a gating layer — you pay for retrieval only when the conversation actually needs it.

#### PATTERN 3 — Scheduled Reflection Scan
```
[AFTER SESSION — async, offline]        [NEXT SESSION — zero LLM cost]
Session ends                            New session opens
→ Mem0.get_all()                        → Mem0.search("[PROACTIVE]")
→ Reflection LLM reasons over           → Inject pre-computed results
  all memories (OUTSIDE Mem0)             into system prompt
→ Identify unresolved blockers,         → User speaks, agent is ready
  pending tasks, forgotten decisions
→ Mem0.add([PROACTIVE] tags)
```

**The ProMem self-questioning applied here**: The reflection LLM asks:
- "What unresolved blockers should surface at next session start?"
- "What decisions made today should be remembered for next week?"
- "What context would this user need if they come back cold?"

```python
def run_reflection(memory, chat, user_id):
    """Runs after session ends, asynchronously. NOT in the live conversation."""
    envelope = memory.get_all(user_id=user_id)
    memories = envelope.get("results", [])  # Note: paginated envelope
    # Reflection LLM pre-computes what to surface next session
    # Stores results tagged with [PROACTIVE] metadata
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

### Production Failure Modes (From the Mem0 Blog)

| Failure | Cause | Fix |
|---|---|---|
| **Noise injection** | Session-start scan with too broad a query surfaces irrelevant memories | Use precision probe queries + relevance threshold — discard below threshold rather than inject |
| **Over-proactivity fatigue** | Agent volunteers memories on every turn — becomes an interruption | Rate-limit: one injection at session start, one per significant context shift. Not one per turn |
| **Latency at session start** | Search round-trip before first response | Run scan async while UI loads — user sees loading state, memories arrive before first message |
| **Extraction completeness vs. cost** | ProMem's self-questioning loop costs more tokens | Gate reflection depth on session length + importance signals. Short sessions: skip. Long high-stakes sessions: always reflect |

### The Open Problem (2026)
The prospective memory primitive — memory with an **attached trigger condition that fires when the condition is met** — doesn't exist yet as a first-class primitive in any production memory system. Current patterns (tagging pre-computed hints with metadata) *approximate* it. A formal `prospective_memory` type is the next frontier.

### Recall Hook
> **Retrospective = user triggers · Prospective = context triggers · Three patterns: Preload → Gate → Reflect offline**

---

## 4.4 ADK Context Types — Which One Do You Use Where?

The framework injects the *right* type of context depending on *where* your code runs. You don't choose — ADK chooses for you. But you need to know each one:

```
┌────────────────────────────────────────────────────────────────────┐
│             CONTEXT TYPE QUICK REFERENCE                           │
│                                                                    │
│  ReadonlyContext    → Dynamic instruction providers                │
│  CallbackContext   → Guardrails, logging, state mutation           │
│  ToolContext       → Tool functions (+ auth, memory search)        │
│  InvocationContext → Core agent logic (_run_async_impl)            │
└────────────────────────────────────────────────────────────────────┘
```

| Context | Read State | Write State | Artifacts | Auth/Memory | Where used |
|---|---|---|---|---|---|
| ReadonlyContext | ✅ | ❌ | ❌ | ❌ | Dynamic instructions |
| CallbackContext | ✅ | ✅ | ✅ | ❌ | Guardrail callbacks |
| ToolContext | ✅ | ✅ | ✅ | ✅ | Tool functions |
| InvocationContext | ✅ | ✅ | ✅ | ✅ | Core agent logic |

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

# PART 5 — GOOGLE ADK DEEP DIVE

## 5.1 The ADK Philosophy

ADK is built on two principles that differentiate it from simpler frameworks:

**1. Event-Driven Architecture**
Every action is an immutable **Event**:  user messages, agent replies, tool calls, state changes. The system processes events one by one in an Event Loop. This makes the system auditable, debuggable, and resumable.

**2. Compute / Memory Separation**
```
Agent logic (Compute)  ←→  Session Service (Memory)
     ↑                           ↑
  Stateless                  Persistent
  Can crash               Survives crash
  Can scale               Single source of truth
```
If a server crashes mid-workflow, ADK resumes from the last saved state. This is not magic — it's disciplined separation of concerns.

---

## 5.2 The Runtime Architecture (The ADK Engine)

```
                        ADK RUNTIME
┌────────────────────────────────────────────────────────┐
│                                                        │
│  User                                                  │
│   │ (1) "Help me do X" + session_id                   │
│   ↓                                                    │
│  RUNNER (Orchestrator)      ←→  SERVICES               │
│  ┌─────────────────────┐        ├─ SessionService      │
│  │   Event Processor   │        ├─ ArtifactService     │
│  └────────┬────────────┘        └─ MemoryService       │
│           │                          ↑                  │
│         (2) Event Loop         ↕  STORAGE (DB/Cloud)   │
│      Ask ↓        ↑ Yield                              │
│  EXECUTION LOGIC                                       │
│  ├─ Agent logic                                        │
│  ├─ LLM invocations                                    │
│  ├─ Callbacks                                          │
│  └─ Tools                                              │
│                                                        │
│  (3) Stream<Event> → User                              │
└────────────────────────────────────────────────────────┘
```

### The Event Loop — The Most Critical Concept in ADK

```
EXECUTE → YIELD → PAUSE → PROCESS → RESUME → EXECUTE...

1. Agent runs logic
2. Needs to do something (send message, call tool, update state)
3. Agent YIELDS an Event — it STOPS running
4. Runner takes the event, persists state via SessionService
5. Runner RESUMES the agent
6. Agent continues with the freshly persisted state
```

**Why this matters in production**: Step 4 is where state is saved to a database. If the server dies between step 3 and 5, the state is already persisted — you just replay from the last event.

---

## 5.3 Agent Types — Which One to Use

### The Intuition
```
LlmAgent        = The creative employee (unpredictable, flexible)
WorkflowAgent   = The process robot (predictable, deterministic)  
CustomAgent     = The specialist contractor (anything you can code)
```

### LlmAgent — The Standard Agent
```python
agent = LlmAgent(
    model="gemini-2.0-flash",
    instruction="You are a helpful customer support agent...",
    tools=[lookup_order, escalate_ticket],
    output_key="agent_response"  # auto-saves final answer to session.state
)
```
- Non-deterministic — the LLM decides what to do
- Best for: language tasks, dynamic decisions, tool orchestration

### WorkflowAgents — Deterministic Orchestrators

```python
# Assembly line — order matters
pipeline = SequentialAgent(sub_agents=[
    ResearchAgent,   # runs first
    DraftAgent,      # runs second, gets research in state
    ReviewAgent      # runs third, gets draft in state
])

# Parallel — gather data simultaneously
fetcher = ParallelAgent(sub_agents=[
    DataSourceAgent1,
    DataSourceAgent2,
    DataSourceAgent3
])

# Quality loop — iterate until condition
refiner = LoopAgent(
    sub_agent=CodeRefineAgent,
    max_iterations=5
)
```

### CustomAgent — Full Control
```python
class MyOrchestrator(BaseAgent):
    async def _run_async_impl(self, ctx: InvocationContext):
        # Arbitrary Python logic — conditionals, loops, anything
        if ctx.session.state.get('user_tier') == 'enterprise':
            async for event in self.enterprise_agent.run_async(ctx):
                yield event
        else:
            async for event in self.standard_agent.run_async(ctx):
                yield event
```

---

## 5.4 Tools and MCP

### Function Tools — The Standard
```python
def lookup_order(order_id: str, tool_context: ToolContext) -> dict:
    """
    Looks up the status of a customer order.
    Use this when the user asks about their order, package, or shipment.
    
    Args:
        order_id: The order number (e.g., "ORD-12345")
    """
    # The docstring IS the tool definition the LLM reads
    result = db.query(order_id)
    tool_context.state['last_lookup'] = order_id  # update session state
    return result
```
**Critical**: The docstring is not documentation for you — it's the tool specification for the LLM. Write it for the model: *when to use this*, *what each param means*, *what format to expect*.

### MCP (Model Context Protocol) — Enterprise Integration
```
Your Agent
    ↓
McpToolset ← connects to → MCP Server (e.g., "Salesforce MCP Server")
                               ↓
                          list_tools() → dynamically discovered
                          call_tool()  → executed on server
```

MCP is how you connect to **enterprise systems** (Salesforce, ServiceNow, SAP) without writing custom tool code for each. The MCP server exposes them; ADK discovers and uses them automatically.

---

## 5.5 Callbacks — Your Guardrails

### The Intuition
Callbacks are **security checkpoints** at key execution stages. Like a TSA checkpoint — they run before/after critical operations and can *block* execution.

```
before_agent_callback   → Agent is about to start. Check user permissions?
before_model_callback   → About to call LLM. Scrub PII from input?
after_model_callback    → LLM responded. Filter toxic content?
before_tool_callback    → About to execute tool. Is user authorized?
after_tool_callback     → Tool returned data. Log it? Sanitize it?
```

### Control Mechanism
```python
def guard_pii(callback_context: CallbackContext, request: LlmRequest):
    if contains_pii(request.user_input):
        # Return a response → BLOCKS the actual LLM call
        return LlmResponse(text="I can't process personal information.")
    return None  # Return None → ALLOWS execution to continue
```

**Return None = proceed. Return anything = override.**

### Production use cases
- `before_model_callback`: PII scrubbing, prompt injection detection
- `before_tool_callback`: Authorization check (is this user allowed to call DELETE?)
- `after_model_callback`: Content safety filtering on output
- `after_tool_callback`: Audit logging for compliance

### Recall Hook
> **Return None = let it through. Return object = intercept and replace.**

---

# PART 6 — CACHING: THE ECONOMICS OF AI AT SCALE

> Caching is not a performance trick — it's what makes production AI systems economically viable.

## 6.1 KV Cache — The Foundation

> Sources: NetApp Engineering Blog (Mar 2026) · NVIDIA Developer Blog (Sep 2025) · HPCWire (May 2026)

### The Intuition
Imagine you're answering questions about a 500-page book. Without a cache, you re-read the entire book from page 1 every time someone asks a new question. That's what an LLM does without KV cache — it recomputes attention over the *entire* context on every single new token it generates.

### The Technical Reality

In a transformer's attention mechanism, every token attends to all previous tokens:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q \cdot K^T}{\sqrt{d_k}}\right) \cdot V$$

For each new token, the model needs K and V tensors for all previous tokens. Without caching, these are recomputed every time.

```
WITHOUT KV CACHE:                    WITH KV CACHE:
                                                    
[token 1][token 2]...[token N]       KV Cache (GPU HBM)
         ↓                           ┌──────────────────────┐
  Compute K,V for                    │ K₁,V₁ K₂,V₂ ... Kₙ,Vₙ│ (stored)
  ALL tokens every step              └──────────────────────┘
  O(n²) per token generated               ↓ retrieve (fast!)
  GPU overloaded                    New token → compute only K_new, V_new
  High latency                      → append to cache
  High cost                         O(n) per token generated
```

**What's cached**: Static prefix (system prompt + tools) is computed once and cached forever. Dynamic suffix (user messages, tool results) are appended each turn.

### KV Cache at Scale — The Memory Budget Problem

**Real numbers** (from NVIDIA blog): Llama 3 70B with a 128k token context window for a *single user* consumes ~40 GB of KV cache. At batch size 10 users → 400 GB. That's more than most GPUs have.

```
KV CACHE FIXED MEMORY POOL
┌────────────────────────────────────────────────┐
│  [user1 K/V blocks] [user2 K/V blocks] [...] │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← FULL │
└────────────────────────────────────────────────┘
              ↓ when full
   K/V EVICTIONS (LRU policy)
   Evicted user's next request → CACHE MISS
   Cache miss → full recompute → latency spike
```

**vLLM's Paged KV Cache**: Borrowed from OS virtual memory. KV tensors stored in fixed-size pages instead of contiguous blocks. Key win: **Shared Prefix Pages** — 1000 users sharing the same RAG context → stored *once* as shared prefix pages → massive memory efficiency.

### The Multi-Node Problem: Where Scale Gets Really Hard

> Source: NetApp — "Engineering Inference: KV Cache, Shared Storage, and the Economics of AI" (2026)

**Single vLLM node**: clean, automatic prefix reuse, boringly simple.

**Add a second node behind a load balancer**: the rules change completely.

```
MULTI-NODE PROBLEM:
Load Balancer
      │
      ├──── vLLM Node 1 ── KV Cache (private, GPU-local)
      └──── vLLM Node 2 ── KV Cache (private, GPU-local)

User A's turn 1 → routed to Node 1 → KV computed, cached locally
User A's turn 2 → routed to Node 2 → Node 2 has ZERO cache for User A
                                    → FULL RECOMPUTE, wasted GPU cycles
```

**LMCache** solves this by treating KV cache as *shared infrastructure* rather than private per-node memory:

```
              Load Balancer
                    │
         ┌──────────┴──────────┐
    vLLM Node 1           vLLM Node 2
    LMCache Connector     LMCache Connector
         └──────────┬──────────┘
                    │
        SHARED KV CACHE TIERS:
        ┌────────────────────────────────────┐
        │  GPU HBM  │  CPU RAM  │  S3/ONTAP  │
        │  (hot)    │  (warm)   │  (cold)    │
        └────────────────────────────────────┘
```

**Critical config**: Use `kv_role: "kv_both"` (not just prefill OR decode). Decode-only caching creates subtle mismatches between what was cached during prefill and what's needed during generation.

**NetApp finding**: Adding the S3 tier shows *virtually no downside* because S3 and CPU tiers operate synergistically — S3 catches overflow from CPU RAM without hurting latency for hot entries.

### NVIDIA Unified Memory: Hardware-Level Solution (GH200 / Grace Blackwell)

> Source: NVIDIA Developer Blog (Sep 2025)

The OOM problem made concrete:
- Llama 3 70B in FP16 → needs ~140 GB GPU memory. GH200 has 96 GB → OOM error.
- Solution: **NVLink-C2C** — 900 GB/s interconnect between CPU (480 GB LPDDR) and GPU (96 GB HBM), creating a single unified address space. 7× the bandwidth of PCIe Gen 5.

```python
import rmm
import torch
from rmm.allocators.torch import rmm_torch_allocator

# Enable unified memory — GPU can now transparently spill to CPU RAM
rmm.reinitialize(managed_memory=True)
torch.cuda.memory.change_current_allocator(rmm_torch_allocator)

# Now loads without OOM — hardware handles data movement automatically
pipe = pipeline("text-generation", model="meta-llama/Llama-3.1-70B")
```

### The Economics Argument

> "Training made the headlines. Inference pays the power bill." — NetApp/HPCWire 2026

KV cache reuse + quantization together change the economics:
- **Reused KV block** = GPU compute you didn't pay for twice
- **CPU/S3 offload** = memory pressure not pushed onto expensive accelerators
- **Unified memory** = serve larger models without OOM, without buying more GPUs

The companies that win won't throw the most GPUs at the problem — they'll engineer smarter inference paths.

### Recall Hook
> **Single node: vLLM Paged KV. Multi-node: LMCache + shared tiers (GPU→CPU→S3). Hardware limit: NVIDIA unified memory. Economics: inference > training costs now.**

---

## 6.2 Prompt Caching — API-Level Caching

> Source: [Claude Code Blog — Prompt Caching is Everything](https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything) (Apr 30, 2026)

### The Intuition
KV cache is inside the inference server — transparent to you. **Prompt caching** is exposed to *you as a developer* via the API. You structure your prompt so the stable parts are a shared prefix, and every request that matches it pays ~1/10th the input token price.

> "It is often said in engineering that 'cache rules everything around me', and the same rule holds for agents." — Claude Code team

At Claude Code, prompt cache hit rate is monitored like uptime. They declare **SEVs (incidents)** when it drops too low. A few percentage points of cache miss rate dramatically affects cost and latency.

### The System Prompt Layout — From the Claude Code Images

```
┌──────────────────────────────────────────────────────────────────┐
│  1. BASE SYSTEM INSTRUCTIONS + TOOLS    ← globally cached        │
│     (static, never changes between sessions)                     │
├──────────────────────────────────────────────────────────────────┤
│  2. CLAUDE.md / Memory / Project context ← cached per project    │
│     (same within one project, changes project-to-project)        │
├──────────────────────────────────────────────────────────────────┤
│  3. SESSION STATE (env, MCP config,      ← cached per session    │
│     output style)                                                │
├──────────────────────────────────────────────────────────────────┤
│  4. MESSAGES (user messages, tool        ← GROWS each turn       │
│     results, assistant responses)          NOT cached             │
└──────────────────────────────────────────────────────────────────┘
         ↑ STABLE                               ↑ DYNAMIC
   Cache hits here                        No cache benefit here
```

**The core rule**: Prefix match, byte-for-byte, from the start. Any change *anywhere* in the prefix invalidates everything after it. Order is everything.

### The 5 Claude Code Lessons (All Hard-Won in Production)

**Lesson 1: Lay out your prompt for caching**
Static first, dynamic last. They've broken this before by: putting a timestamp in the static system prompt, shuffling tool order non-deterministically, updating tool parameter schemas.

**Lesson 2: Use messages for updates, not system prompt changes**
If information becomes outdated (current time, file state, mode change), inserting it into the *next user message* via a `<system-reminder>` tag preserves the cache. Editing the system prompt = cache miss on every subsequent request.

**Lesson 3: Never change tools or models mid-session**
- Tools are part of the cached prefix. Add/remove a tool mid-conversation → cache invalidated for the *entire conversation*.
- **Claude Code's solution for Plan Mode**: Instead of swapping tool sets, they keep ALL tools in every request and use `EnterPlanMode` / `ExitPlanMode` as *tools the model calls itself*. Tool definitions never change.
- **Deferred loading**: For MCP tools, send lightweight stubs with `defer_loading: true`. The full schema loads only when selected. Stable stubs = stable prefix = cache preserved.
- **Don't switch models mid-session**: Prompt caches are *unique to each model*. Switching from Opus to Haiku at turn 50 means rebuilding the entire cache for Haiku from scratch — more expensive than Opus answering a simple question on a cache hit.

**Lesson 4: Fork operations must share the parent's prefix**
When running a side computation (compaction, summarization), use *identical* system prompt + tools as the parent. If you use a different "summarize this" system prompt, the prefixes diverge at token 1 and you pay full uncached price for the entire conversation.

```
WRONG — new system prompt = no cache hit = expensive:
POST /messages
  system: "Summarize the following conversation"  ← different prefix, no hit
  messages: [full conversation history]            ← pay full price for all of this

CORRECT — same prefix = cache hit = cheap:
POST /messages
  system: [exact same system prompt as parent]    ← cache hit! 1/10 price
  tools: [exact same tool list as parent]         ← cache hit!
  messages: [full conversation] + ["Summarize"]   ← only pay for new tokens
```

**Lesson 5: Monitor your cache hit rate like you monitor uptime**
Set up alerts. Treat drops as incidents. Measure it constantly.

### Compaction — From the Image

```
BEFORE (context nearly full):    FORKED COMPACTION CALL:    AFTER:
┌─────────────────────┐         ┌──────────────────────┐   ┌─────────────────────────┐
│ System + Tools      │         │ System + Tools       │   │ System + Tools          │
│ user message 1      │         │ Full conversation    │   │ compact_boundary ◄──────│
│ assistant + tools   │   →     │ (all messages)       │ → │ Conversation summary    │
│ user message 2      │         │   ↓ cache hit=1/10   │   │ Re-attached files       │
│ ... many turns ...  │         │ + "Summarize this"   │   │ room for new turns      │
│ [compaction buffer] │         │ → Summary (~20k max) │   │                         │
└─────────────────────┘         └──────────────────────┘   └─────────────────────────┘
```

The forked call uses the exact parent prefix → cache hit → you pay 1/10th price for the largest part. Only the new compaction prompt is billed at full rate. Compaction buffer must be reserved in advance so there's room for the summary output tokens.

### Pricing Model

| Action | Price |
|---|---|
| Cache write (first time) | 1.25× normal |
| Cache read (every hit) | 0.10× normal |
| Break-even point | ~2 requests |
| After 10 requests | ~90% cost reduction on cached tokens |

### Recall Hook
> **Stable top, dynamic bottom. Never change tools mid-session. Monitor cache hit rate like uptime. Fork operations must share the parent's prefix exactly.**

---

## 6.3 Google Gemini Caching — Implicit vs. Explicit

> Source: [Google Gemini API Caching Docs](https://ai.google.dev/gemini-api/docs/caching.md.txt) + [Optimization Tiers](https://ai.google.dev/gemini-api/docs/optimization.md.txt)

### Two Modes

**Implicit Caching** (Gemini 2.5+, auto-enabled):
- Zero configuration. Google automatically passes on cost savings if your request hits existing caches based on common prompt prefixes.
- No guarantee of savings — best-effort.
- Tip: Put large, common content at the *beginning* of your prompt. Send requests with similar prefixes in a short time window to increase hit chances.
- Check hits: `response.usage_metadata.cached_token_count`

**Explicit Caching** (manual, cost-saving guarantee):
You create a cache object, get a TTL, and reference it by name in subsequent requests.

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

# Step 2: Use it in every request — only pay for the new question tokens
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Please summarize this transcript",
    config=types.GenerateContentConfig(cached_content=cache.name)
)
print(response.usage_metadata)  # shows cached_token_count
```

**Best for**: Chatbots with extensive system instructions, repetitive video/PDF analysis, recurring queries against large document sets, code repository analysis.

### Gemini Inference Service Tiers — The Full Pricing Picture

| Tier | Price | Latency | Reliability | Best for |
|---|---|---|---|---|
| **Standard** | Full price | Seconds–minutes | High | General day-to-day apps |
| **Priority** | 75–100% premium | Seconds | Highest (non-sheddable) | Customer chatbots, real-time fraud detection, production copilots |
| **Flex** | 50% of standard | 1–15 min target | Best-effort (sheddable) | Multi-step agent workflows, background CRM, offline evals |
| **Batch** | 50% of standard | Up to 24 hours | High throughput | Pre-processing datasets, regression suites, bulk embeddings |
| **Context Cache** | 90% discount + prorated storage | Faster time-to-first-token | N/A | Recurring queries over same content |

> **Flex is the sleeper for agent workflows**: 50% discount, synchronous interface (no async code changes needed), and most multi-step agent chains aren't latency-sensitive enough to need Priority pricing.

### Recall Hook
> **Gemini implicit = automatic savings, no config. Explicit = guaranteed savings with TTL. Flex tier = 50% off for agent workflows not requiring instant response.**

---

## 6.4 Semantic Caching — Caching at the Meaning Level

> Sources: [Microsoft Azure Cosmos DB Semantic Cache](https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/semantic-cache) · [LiteLLM Proxy Caching](https://docs.litellm.ai/docs/proxy/caching)

### The Intuition
Prompt caching says: "If the exact bytes match, reuse the result."  
Semantic caching says: "If the *meaning* matches, reuse the result."

```
User 1: "What is the return policy?"
User 2: "How do I return a product?"       ← different words, same intent
User 3: "Can I get a refund on my order?"  ← different words, same intent

Prompt caching:   3 cache misses (all different text)
Semantic caching: 1 cache miss (first one), then 2 hits (same intent neighborhood)
```

### How It Works
```
New request
     ↓
  Embed query → vector embedding
     ↓
  Vector similarity search against cached (query, response) pairs
  similarity score = 0 (no match) to 1 (exact match)
     ↓
  Score > threshold? → return cached response (no LLM call)
  Score ≤ threshold? → call LLM → embed and store (query, response) pair
```

### The Context Window Problem (Critical Production Gotcha)

> Source: Microsoft Azure Cosmos DB Docs

**The problem**: A cache key of just the latest message is dangerously wrong.

Classic failure scenario:
```
User asks: "What is the largest lake in North America?"
→ LLM: "Lake Superior." → cached

User (same session, next turn) asks: "What is the second largest?"
→ With context: "Lake Huron" → cached

--- Later, different user, different session ---

New user asks: "What is the largest stadium in North America?"
→ LLM: "Michigan Stadium." → cached

New user then asks: "What is the second largest?"
→ Semantic cache finds "What is the second largest?" from before
→ Returns "Lake Huron" ← WRONG. The context was about lakes, not stadiums.
```

**The fix**: Cache keys must include *context window history*, not just the latest message. Vectorize the sliding window of recent prompts + the new message as the lookup key. This ensures what's returned from cache is contextually correct.

### Similarity Score Tuning

This requires trial and error in production:

| Threshold | Effect |
|---|---|
| Too **high** (e.g., 0.99) | Few hits. Cache fills with near-duplicate entries for slightly different phrasings. High LLM spend. |
| Too **low** (e.g., 0.70) | Too many hits. Returns responses for semantically similar but actually different questions. Wrong answers. |
| **Sweet spot** | Typically 0.92–0.97 for general use. Domain-specific fine-tuning of embeddings improves this significantly. |

### Cache Maintenance

Semantic caches grow large if not pruned. Techniques:
- **TTL**: Set expiry on cached items (stale answers become dangerous over time)
- **Hit count**: Track how often each item is hit — evict low-hit items, extend TTL of high-hit items
- **Recency filter**: Serve only the most recently cached version of similar questions (`WHERE c.lastUpdated > @someDate ORDER BY c.lastUpdated DESC`)

### LiteLLM — Production Caching Stack

> Source: LiteLLM Proxy Docs

LiteLLM provides a gateway-level caching layer across all model providers (OpenAI, Anthropic, Gemini, Azure, etc.) — one config to cache everything.

**Supported cache backends:**
- In-memory (dev only)
- Disk
- Redis (exact match, production standard)
- Qdrant Semantic Cache (meaning-level)
- Redis Semantic Cache
- S3 / GCS (long-term storage)

```yaml
# config.yaml — exact match + semantic cache setup
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
**Shared auth cache across workers**: `enable_redis_auth_cache: true` — prevents each worker pod from making independent DB lookups on key verification.

### Full Production Caching Stack (All Four Layers)

```
User Request
     ↓
┌─────────────────────────────────────────────────────┐
│ LAYER 1: Semantic Cache (vector DB)                 │
│ Meaning-level match. Fast if RAG prompts repeat.    │
│ Danger: must include context window in cache key.   │
└─────────────────┬───────────────────────────────────┘
                  ↓ miss
┌─────────────────────────────────────────────────────┐
│ LAYER 2: Exact Prompt Cache (Redis/API-level)       │
│ Byte-exact prefix match. Free via API (Claude/Gemini│
│ Gemini explicit TTL. Claude: structure prompt right.│
└─────────────────┬───────────────────────────────────┘
                  ↓ miss
┌─────────────────────────────────────────────────────┐
│ LAYER 3: LLM Inference                              │
│ Actual model call. Most expensive. Unavoidable miss.│
└─────────────────┬───────────────────────────────────┘
                  ↓ (inside the server, transparent to you)
┌─────────────────────────────────────────────────────┐
│ LAYER 4: KV Cache (GPU HBM → CPU RAM → S3)          │
│ Prefix reuse at inference time. Paged KV for single │
│ node. LMCache + tiered storage for multi-node.      │
└─────────────────────────────────────────────────────┘
```

### Prompt Caching vs. Semantic Caching Tradeoff Summary

| Dimension | Prompt Caching | Semantic Caching |
|---|---|---|
| **What matches** | Exact byte prefix | Embedding similarity |
| **Best for** | System prompts, tools, documents | FAQ queries, repeated user intents |
| **Staleness risk** | Very low (exact = always same context) | Medium-high (similar ≠ same context) |
| **Implementation complexity** | Low (API parameter) | High (vector DB, embedding model, threshold tuning) |
| **Context window issue** | Not applicable | Critical — must include history in key |
| **Cold start** | Every new deployment | Warm-up time to build cache |

### Recall Hook
> **Semantic cache = meaning-level, needs context window in key, threshold tuning required. LiteLLM = one config to rule all providers. Four-layer stack: Semantic → Exact → LLM → KV.**

## 7.1 The Three Security Concerns

```
1. ROGUE ACTIONS     — Agent does something harmful (deletes data, spends money)
2. DATA DISCLOSURE   — Agent leaks sensitive info to wrong party
3. PROMPT INJECTION  — Malicious content in tool results hijacks agent behavior
```

## 7.2 Defense-In-Depth (Two Layers)

```
LAYER 1: Deterministic Guardrails (hardcoded rules, outside LLM)
         → "No purchase over $100 without human approval"
         → "Never call DELETE endpoints"
         → Implemented as: before_tool_callback, policy engines

LAYER 2: Reasoning-Based Defenses (AI reviewing AI)
         → Specialized "guard model" reviews agent's plan before execution
         → Flags risky steps: "This action will delete all user data — block?"
         → Slower but catches complex, context-dependent threats
```

## 7.3 Agent Identity — The New Security Principal

### The Intuition
Before agents: two things have permissions — **humans** (via login) and **services** (via service accounts).  
After agents: a third category — **autonomous actors** that need their own identity, separate from the user who started them AND the developer who built them.

```
OLD WORLD:                          NEW WORLD:
Human User → OAuth/SSO              Human User → OAuth/SSO
Service    → IAM Service Account    Service    → IAM Service Account
                                    Agent      → Agent Identity (SPIFFE)
                                               → own least-privilege permissions
```

**Why separate from the user**: A user might have admin access. The agent they start should only have the permissions needed for *this specific task*. If the agent is compromised (prompt injection), you've limited the blast radius.

```
SalesAgent     → CRM read/write access
HRAgent        → HR system read only
FinanceAgent   → Reporting read, no transaction write

If SalesAgent is hijacked → can only touch CRM, nothing else
```

## 7.4 Principle of Least Privilege for Agents

Apply it to everything:
- Tools (which APIs can this agent call?)
- Data (which tables/buckets can it access?)
- Other agents (which sub-agents can it spawn?)
- Context (which parts of session state can it read?)

### Recall Hook
> **Agents are a third security principal — not user, not service. Give them their own identity and minimum permissions.**

---

# PART 8 — AGENT INTEROPERABILITY

## 8.1 A2A Protocol — Agent-to-Agent Communication

### The Intuition
When two companies' systems need to talk, they use standard APIs. When two agents need to talk — possibly built by different teams, in different languages, on different clouds — they need **A2A**.

```
Agent A (Python, Google Cloud)  ←→  A2A Protocol  ←→  Agent B (Node.js, AWS)
         ↓                                                       ↓
    Agent Card (JSON)                                    Agent Card (JSON)
    "I do order processing"                              "I do shipping"
    "Call me at this URL"                                "Call me at this URL"
    "I need OAuth2"                                      "I need API key"
```

### How It Works
1. **Discovery**: Each agent publishes an **Agent Card** (JSON) — its capabilities, URL, auth requirements
2. **Communication**: Task-based (async). Client sends a task, server streams updates back.
3. **Why not REST**: REST is request-response. Agents need async, streaming, long-running tasks.

### In ADK
```python
# Turn any local agent into an A2A microservice
a2a_server = to_a2a(my_local_agent)  # Generates Agent Card + API endpoint

# Connect to a remote agent
remote = RemoteA2aAgent(agent_card_url="https://shipping-agent.example.com/.well-known/agent.json")
```

## 8.2 MCP — Model Context Protocol

### The Intuition
Before MCP: every AI system needed custom integration code for every tool (Salesforce plugin, GitHub plugin, etc.)  
After MCP: one standard. If a tool has an MCP server, any MCP-compatible agent can use it.

```
ADK Agent
    ↓
McpToolset
    ↓
MCP Server (standard interface) → Salesforce, GitHub, Linear, PostgreSQL...
```

Think of it like USB-C — one port standard for all devices.

---

# PART 9 — AGENT OPS (PRODUCTION LIFECYCLE)

> Agents in production are not static software. They're living systems that need continuous management.

## 9.1 Why Traditional DevOps Fails

```
Traditional software test:  assert output == expected_output  ✅/❌
Agent test:                 Is this response "good"?           🤔
```

Agents are **stochastic** — same input, different output on different runs. You can't unit-test them like a pure function.

## 9.2 The Agent Ops Stack

```
1. DEFINE METRICS (business KPIs, not just technical)
   → Goal completion rate, user satisfaction, task latency, cost per interaction
   → Revenue impact, conversion, retention
   
2. BUILD EVALUATION DATASETS ("golden sets")
   → Sample from real production interactions
   → Cover the full range of use cases + edge cases
   → Domain expert review before using as ground truth
   
3. USE AN LLM-AS-JUDGE
   → Can't assert exact match → use a model to score quality
   → e.g., "Does this answer correctly resolve the user's intent? Score 1-5"
   
4. METRICS-DRIVEN DEPLOYMENT
   → Deploy new model/prompt version → run against full eval set
   → Compare scores to production version → Go/No-Go decision
   
5. TRACE WITH OPENTELEMETRY
   → For debugging (not performance dashboards)
   → See: exact prompt sent, model reasoning, tool chosen, params, raw results
   → Platform: Google Cloud Trace, LangFuse, etc.
   
6. CLOSE THE FEEDBACK LOOP
   → User reports bad answer → replicate → add to eval dataset
   → Every bug becomes a test case
```

## 9.3 The CI/CD for Agents

```
Code change / New model / Prompt update
              ↓
    Run against eval dataset
              ↓
    LLM-as-Judge scores comparison
    New version vs. Production version
              ↓
    Latency + Cost + Quality all pass?
              ↓
    Deploy to production
              ↓
    Monitor → Collect feedback → Update eval dataset
```

### Recall Hook
> **For agents, "testing" means evaluation datasets + LLM judges, not assert statements.**

---

# PART 10 — PUTTING IT ALL TOGETHER: PRODUCTION ARCHITECTURE

## The Complete Picture

```
                        PRODUCTION AI AGENT SYSTEM
                        
┌─────────────────────────────────────────────────────────────────┐
│  USER / OTHER SYSTEMS                                           │
│  Web UI · Mobile · A2A client · API                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│  AGENT RUNTIME (ADK / Vertex AI Agent Engine)                   │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────────────────────────────┐  │
│  │  RUNNER         │  │  SERVICES                            │  │
│  │  (Orchestrator) │  │  SessionService  → PostgreSQL/Vertex │  │
│  │  Event Loop     │  │  ArtifactService → GCS/S3            │  │
│  │  Context mgmt   │  │  MemoryService   → Mem0/Vector DB    │  │
│  └────────┬────────┘  └──────────────────────────────────────┘  │
│           │                                                     │
│  ┌────────▼──────────────────────────────────────────────────┐  │
│  │  AGENT PIPELINE                                           │  │
│  │  OrchestratorAgent (Coordinator)                          │  │
│  │  ├─ ResearchAgent (SequentialAgent)                       │  │
│  │  │   ├─ before_tool_callback (auth check)                 │  │
│  │  │   ├─ Tool: RAG query                                   │  │
│  │  │   └─ Tool: NL2SQL                                      │  │
│  │  ├─ DraftAgent (LlmAgent)                                 │  │
│  │  │   ├─ before_model_callback (PII scrub)                 │  │
│  │  │   └─ Tool: document_writer                             │  │
│  │  └─ ReviewAgent (LlmAgent)                                │  │
│  │      └─ after_model_callback (content filter)             │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│  INFERENCE LAYER                                                │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐  │
│  │  CACHING STACK      │  │  MODEL ROUTING                   │  │
│  │  Semantic Cache     │  │  Complex tasks → Gemini 2.5 Pro  │  │
│  │  Prompt Cache       │  │  Simple tasks  → Gemini 2.5 Flash│  │
│  │  KV Cache (GPU)     │  │  Images/Audio  → Specialized APIs│  │
│  └─────────────────────┘  └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│  AGENT OPS                                                      │
│  Eval datasets · LLM judges · OpenTelemetry traces              │
│  CI/CD pipeline · Model upgrade automation                      │
│  Human feedback loop → new test cases                           │
└─────────────────────────────────────────────────────────────────┘
```

---

# QUICK RECALL CARDS

Cut these out mentally. Use them when designing.

```
┌──────────────────────────────────────────────────────────────────┐
│  AGENT ANATOMY                                                   │
│  Brain (Model) · Hands (Tools) · Nervous System (Orchestration) │
│  Body (Deployment)                                               │
├──────────────────────────────────────────────────────────────────┤
│  AGENT LEVELS                                                    │
│  0=Encyclopedia · 1=Expert · 2=Strategist · 3=Manager · 4=Evolves│
├──────────────────────────────────────────────────────────────────┤
│  AGENT LOOP                                                      │
│  Mission → Scan → Think → Act → Observe → Loop → Report         │
├──────────────────────────────────────────────────────────────────┤
│  ADK STATE SCOPES                                                │
│  (none)=this chat · user:=this person · app:=all users · temp:=now│
├──────────────────────────────────────────────────────────────────┤
│  MEM0 PATTERNS (from mem0.ai, ProMem, PASK papers — 2026)       │
│  Retrospective=user triggers · Prospective=context triggers      │
│  Pattern 1: Preload on session open (async, no latency)          │
│  Pattern 2: Gate with intent classifier (DEMAND/NO_DEMAND)       │
│  Pattern 3: Reflect offline after session, retrieve pre-computed │
│  Failure modes: noise injection · over-proactivity · latency     │
├──────────────────────────────────────────────────────────────────┤
│  CACHING — 4 LAYERS (innermost to outermost)                    │
│  KV Cache = GPU-level, token reuse, single-node vLLM Paged      │
│  Multi-node KV = LMCache + tiered GPU→CPU→S3 storage            │
│  Prompt Cache = API-level exact prefix, 0.1x price on hit       │
│  Semantic Cache = vector similarity, needs context window in key │
│  CLAUDE: static top, dynamic bottom. Never change tools/model.  │
│  GEMINI: implicit (auto) vs explicit (TTL). Flex = 50% off.     │
│  LITELLM: Redis (exact) + Qdrant (semantic) + per-request TTL   │
├──────────────────────────────────────────────────────────────────┤
│  ADK CONTEXT TYPES                                               │
│  ReadOnly=instructions · Callback=guardrails ·                  │
│  Tool=actions · Invocation=core logic                            │
├──────────────────────────────────────────────────────────────────┤
│  CALLBACKS                                                       │
│  Return None = proceed. Return object = intercept and replace.   │
├──────────────────────────────────────────────────────────────────┤
│  SECURITY                                                        │
│  Agents = 3rd principal (not user, not service)                  │
│  Least privilege · Deterministic guardrails · Guard models       │
├──────────────────────────────────────────────────────────────────┤
│  AGENT OPS                                                       │
│  Eval datasets + LLM judges (not assert statements)              │
│  Every bug → new test case. Models rotate every 6 months.        │
└──────────────────────────────────────────────────────────────────┘
```

---

# THE DEVELOPER MINDSET SHIFT

> From the Google ADK whitepaper — the most important mental model:

**Old paradigm (bricklayer)**: You define every logical step precisely. Code is deterministic.

**New paradigm (director)**: You set the scene (system prompt), cast the roles (tools/agents), provide context (data). Your job is to guide an autonomous actor to deliver the performance.

```
BRICKLAYER                          DIRECTOR
"Step 1: do X"                      "You are a helpful agent.
"Step 2: if Y, do Z"                 Your goal is X.
"Step 3: else do W"                  You have these tools.
"Step 4: format as..."               Make good decisions."
```

**The caveat**: Comprehensive evaluations outweigh the prompt. You can't just write a good prompt and ship. You must measure, evaluate, and iterate on agent behavior systematically.

---

*Sources — all fetched and verified May 2026:*
- *Google ADK Whitepaper (Introduction to Agents)*
- *[Mem0 — Proactive Memory in AI Agents Developer Guide](https://mem0.ai/blog/proactive-memory-in-ai-agents-a-developer-s-guide) (May 1, 2026)*
- *ProMem: arXiv:2601.04463 — "Beyond Static Summarization: Proactive Memory Extraction for LLM Agents" (Jan 2026)*
- *PASK: arXiv:2604.08000 — "Toward Intent-Aware Proactive Agents with Long-Term Memory" (Apr 2026)*
- *[Claude Code — Prompt Caching is Everything](https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything) (Apr 30, 2026)*
- *[Google Gemini API Caching Docs](https://ai.google.dev/gemini-api/docs/caching.md.txt)*
- *[Google Gemini API Optimization & Service Tiers](https://ai.google.dev/gemini-api/docs/optimization.md.txt)*
- *[NetApp — Engineering Inference: KV Cache, Shared Storage and the Economics of AI](https://community.netapp.com/t5/Tech-ONTAP-Blogs/Engineering-Inference-KV-Cache-Shared-Storage-and-the-Economics-of-AI/ba-p/466018) (Mar 2026)*
- *[NVIDIA — Accelerate LLM Inference and KV Cache Offload with CPU-GPU Memory Sharing](https://developer.nvidia.com/blog/accelerate-large-scale-llm-inference-and-kv-cache-offload-with-cpu-gpu-memory-sharing/) (Sep 2025)*
- *[HPCWire — Why the Race to Expand KV Cache is Critical for AI Inference Success](https://www.hpcwire.com/2026/05/11/why-the-race-to-expand-kv-cache-is-critical-for-ai-inference-success/) (May 2026)*
- *[Microsoft Azure Cosmos DB — Introduction to Semantic Cache](https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/semantic-cache)*
- *[LiteLLM Proxy Caching Docs](https://docs.litellm.ai/docs/proxy/caching)*
