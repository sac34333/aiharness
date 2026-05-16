---
title: Google ADK — Agent Development Kit Deep Dive
description: The ADK runtime architecture, event loop, LlmAgent vs WorkflowAgent vs CustomAgent, tools, MCP integration, and callbacks as guardrails.
---

# PART 5 — Google ADK Deep Dive

---

## 5.1 The ADK Philosophy

ADK is built on two principles that differentiate it from simpler frameworks:

**1. Event-Driven Architecture**
Every action is an immutable **Event**: user messages, agent replies, tool calls, state changes. The system processes events one by one in an Event Loop. This makes the system auditable, debuggable, and resumable.

**2. Compute / Memory Separation**
```
Agent logic (Compute)  <-->  Session Service (Memory)
     ^                           ^
  Stateless                  Persistent
  Can crash               Survives crash
  Can scale               Single source of truth
```
If a server crashes mid-workflow, ADK resumes from the last saved state. This is not magic — it is disciplined separation of concerns.

---

## 5.2 The Runtime Architecture

```
                        ADK RUNTIME
+----------------------------------------------------------+
|                                                          |
|  User                                                    |
|   | (1) "Help me do X" + session_id                     |
|   v                                                      |
|  RUNNER (Orchestrator)     <-->  SERVICES                |
|  +---------------------+         |- SessionService       |
|  |   Event Processor   |         |- ArtifactService      |
|  +--------+------------+         +- MemoryService        |
|           |                           ^                  |
|         (2) Event Loop          STORAGE (DB/Cloud)       |
|      Ask v        ^ Yield                                |
|  EXECUTION LOGIC                                         |
|  |- Agent logic                                          |
|  |- LLM invocations                                      |
|  |- Callbacks                                            |
|  +- Tools                                                |
|                                                          |
|  (3) Stream<Event> --> User                              |
+----------------------------------------------------------+
```

### The Event Loop — The Most Critical Concept in ADK

```
EXECUTE -> YIELD -> PAUSE -> PROCESS -> RESUME -> EXECUTE...

1. Agent runs logic
2. Needs to do something (send message, call tool, update state)
3. Agent YIELDS an Event — it STOPS running
4. Runner takes the event, persists state via SessionService
5. Runner RESUMES the agent
6. Agent continues with the freshly persisted state
```

**Why this matters in production**: Step 4 is where state is saved to a database. If the server dies between step 3 and 5, the state is already persisted — you replay from the last event.

---

## 5.3 Agent Types — Which One to Use

### The Intuition

```
LlmAgent        = The creative employee (unpredictable, flexible)
WorkflowAgent   = The process robot (predictable, deterministic)
CustomAgent     = The specialist contractor (anything you can code)
```

---

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

---

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

---

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

Use when: your routing logic is too complex for a RouterAgent, or you need to mix deterministic and LLM-driven steps in ways WorkflowAgents cannot express.

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

::: warning Critical
The docstring is not documentation for you — it is the tool specification for the LLM. Write it for the model: *when to use this*, *what each param means*, *what format to expect*.
:::

---

### MCP (Model Context Protocol) — Enterprise Integration

```
Your Agent
    |
McpToolset <-- connects to --> MCP Server (e.g., "Salesforce MCP Server")
                                   |
                              list_tools() -> dynamically discovered
                              call_tool()  -> executed on server
```

MCP is how you connect to enterprise systems (Salesforce, ServiceNow, SAP) without writing custom tool code for each. The MCP server exposes them; ADK discovers and uses them automatically.

Think of it like USB-C — one port standard for all devices.

---

## 5.5 Callbacks — Your Guardrails

### The Intuition

Callbacks are **security checkpoints** at key execution stages. Like a TSA checkpoint — they run before/after critical operations and can *block* execution.

```
before_agent_callback   -> Agent is about to start. Check user permissions?
before_model_callback   -> About to call LLM. Scrub PII from input?
after_model_callback    -> LLM responded. Filter toxic content?
before_tool_callback    -> About to execute tool. Is user authorized?
after_tool_callback     -> Tool returned data. Log it? Sanitize it?
```

### Control Mechanism

```python
def guard_pii(callback_context: CallbackContext, request: LlmRequest):
    if contains_pii(request.user_input):
        # Return a response --> BLOCKS the actual LLM call
        return LlmResponse(text="I can't process personal information.")
    return None  # Return None --> ALLOWS execution to continue
```

**Return None = proceed. Return anything = override.**

### Production Use Cases

- `before_model_callback`: PII scrubbing, prompt injection detection
- `before_tool_callback`: Authorization check (is this user allowed to call DELETE?)
- `after_model_callback`: Content safety filtering on output
- `after_tool_callback`: Audit logging for compliance

### Recall Hook

> **Return None = let it through. Return object = intercept and replace.**

---

## Sources

- Google ADK Documentation: [ai.google.dev/adk](https://ai.google.dev/adk)
- Google ADK Whitepaper: *Introduction to Agents*

<div class="contribute-cta">

**Have a production ADK pattern worth sharing?** [Add it here](https://github.com/sac34333/aiharness/edit/main/docs/guide/google-adk.md) — reviewed before publishing.

</div>
