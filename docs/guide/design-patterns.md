---
title: Multi-Agent Design Patterns
description: Sequential, Parallel, Loop, Coordinator, Swarm, ReAct, Human-in-the-Loop. When to use which pattern, with Google ADK code examples.
---

# PART 3 — Multi-Agent Design Patterns

---

## The Intuition

Every engineering org has an org chart. Multi-agent systems are just org charts for AI. Pick the structure that matches your workflow.

```
SEQUENTIAL   -->  Assembly line. Step A must finish before Step B starts.
PARALLEL     -->  Multiple teams working on different tasks simultaneously.
LOOP         -->  Quality cycle. Run --> Check --> Repeat until good enough.
REVIEW       -->  Generator + Critic. Writer + Editor.
COORDINATOR  -->  Project manager dispatches work to specialists.
SWARM        -->  All agents collaborate peer-to-peer, refining together.
REACT        -->  Single agent, iterative think-->act-->observe loop.
HITL         -->  Human approval gates at critical decision points.
```

---

## When to Use Which Pattern

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

---

## In Google ADK

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

---

## Pattern Details

### Sequential (Assembly Line)

Each agent's output becomes the next agent's input. State flows through `session.state`.

**When**: Tasks where order is non-negotiable. Document pipelines, data transformation, research-then-draft flows.

**Cost**: Total latency = sum of all agent latencies. Not suitable for time-sensitive workflows with many steps.

---

### Parallel (Fan-Out)

All sub-agents run simultaneously. Results are merged into session state.

**When**: Gathering data from independent sources (competitor analysis, multi-source research). All inputs are independent — no agent needs another's output.

**Cost**: Total latency = latency of the *slowest* agent (not the sum). Major win for data-gathering steps.

---

### Loop (Quality Cycle)

Same agent runs repeatedly until a quality condition is met or `max_iterations` is hit.

**When**: Code that must pass tests. Content that must hit a readability score. Any task with a measurable quality gate.

::: warning
Always set `max_iterations`. An unconstrained loop is a runaway cost bug.
:::

---

### Coordinator / Hierarchical

An orchestrator LlmAgent dynamically decides which specialist to call based on the current state.

**When**: Projects with genuinely varied subtasks that can't be predicted upfront. The coordinator handles routing decisions; specialists handle execution.

---

### Human-in-the-Loop (HITL)

The agent pauses at a defined checkpoint and waits for a human to approve before continuing.

**When**: Irreversible actions (send email, execute payment, delete record), compliance requirements, low-confidence decisions.

**Implementation in ADK**: Agent calls a tool that blocks on human input. The session is paused and resumed when approval arrives.

---

## Recall Hook

> **Assembly line → Parallel teams → Quality loop → Manager → Peer network** — match the pattern to the workflow shape.

---

## Sources

- Google ADK Whitepaper: *Introduction to Agents*
- Google ADK Documentation: SequentialAgent, ParallelAgent, LoopAgent

<div class="contribute-cta">

**Have a pattern that is not listed here?** [Add it](https://github.com/sac34333/aiharness/edit/main/docs/guide/design-patterns.md) — production-validated patterns only.

</div>
