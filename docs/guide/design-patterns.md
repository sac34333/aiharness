---
title: Agent Design Patterns
description: Sequential, Parallel, Loop, Swarm, ReAct, HITL — when to use each pattern in production AI agent systems.
---

# Agent Design Patterns

> The pattern you choose determines your failure modes before you write a line of code.

## The Patterns

### Sequential
One agent, one task at a time. A → B → C.

**Use when:** Tasks are strictly ordered. Each step depends on the previous.  
**Failure mode:** One slow step blocks everything.

### Parallel
Multiple agents run simultaneously, results merged.

**Use when:** Sub-tasks are independent. Speed matters.  
**Failure mode:** One failure can invalidate the whole merge if not handled.

### Loop (ReAct)
Think → Act → Observe → Think again. Continues until objective met.

**Use when:** You don't know how many steps are needed upfront.  
**Failure mode:** Infinite loops. Always set a max_iterations guard.

### Swarm
Multiple specialised agents, dynamic handoffs between them.

**Use when:** Complex tasks need different expertise at different stages.  
**Failure mode:** Context loss at handoff points. Pass full state, not summaries.

### HITL (Human-in-the-Loop)
Agent pauses and asks a human before taking a specific action.

**Use when:** High-stakes, irreversible, or ambiguous decisions.  
**Failure mode:** Asking too often → users ignore it. Asking too rarely → trust is broken when something goes wrong.

## Production Trap

::: danger
Building Swarm when Sequential would work. Every additional agent is another failure surface, another context handoff, another latency hit. Start with the simplest pattern that solves the problem.
:::

## Recall Hook

> Pattern → Failure Mode is the real decision. Not Pattern → Capability.

---

*Next: [Memory Architecture →](/guide/memory-architecture)*
