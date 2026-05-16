---
title: What is an AI Agent?
description: The shift from predictor to actor. Anatomy of an AI agent, the Think→Act→Observe loop, and why agents are fundamentally different from autocomplete.
---

# What is an AI Agent?

> The shift from "finish my sentence" to "go do the job."

## The Intuition

**Old AI** = a very smart autocomplete. You ask, it predicts. No awareness, no plan, no actions.

**An Agent** = a junior employee you give a goal to. They don't need you to tell every step. They reason, use tools, check results, and adjust — until the job is done.

## Shortest Definition

> **Agent = LLM in a loop + Tools to accomplish an objective**

An LLM alone is stateless and passive. An Agent adds:

- A **loop** around the LLM (Think → Act → Observe → repeat)
- **Tools** to interact with the real world
- **Memory** so it remembers what it already did
- **Orchestration** to manage when to think vs act

## The Anatomy

| Component | Role | Analogy |
|---|---|---|
| **Model** | Reasons, decides, plans | The brain |
| **Tools** | APIs, databases, code execution | The hands |
| **Orchestration** | Runs the Think→Act→Observe loop | The nervous system |
| **Deployment** | Monitoring, logging, auth | The body |

## The Think → Act → Observe Loop

```
Think   →  What do I need to do next?
Act     →  Call a tool / take an action  
Observe →  What happened? Update my understanding
Repeat  →  Until objective is complete
```

## Production Trap

::: warning Common Mistake
Treating the loop as synchronous when it should be async. Every tool call adds latency. Design for it from day one — don't bolt on async later.
:::

## Recall Hook

> Agent = LLM + Loop + Tools. Everything else is implementation detail.

---

*Next: [Agent Taxonomy →](/guide/agent-taxonomy)*

<div class="contribute-cta">

**Know something that should be here?** [Contribute to this page on GitHub](https://github.com/sac34333/aiharness/edit/main/docs/guide/what-is-agent.md) — all additions are reviewed before publishing.

</div>
