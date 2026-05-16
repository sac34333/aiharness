---
title: Agent Taxonomy — 5 Levels of AI Agents
description: From Encyclopedia to Self-Evolving. The 5 levels of AI agent capability and when to use each in production.
---

# Agent Taxonomy

> Know exactly what you're building — and what you're not.

## The 5 Levels

| Level | Name | Capability | Example |
|---|---|---|---|
| **1** | Encyclopedia | Answers questions, no actions | ChatGPT with no tools |
| **2** | Assistant | Takes single actions on request | Booking a calendar slot |
| **3** | Workflow Agent | Multi-step tasks, loops, branching | Customer support resolution |
| **4** | Autonomous Agent | Defines sub-goals, self-corrects | Research + report writing |
| **5** | Self-Evolving | Learns and updates its own behaviour | Experimental — not production-ready |

## What Most Teams Are Actually Building

Level 3. Maybe early Level 4. If someone tells you they're at Level 5 in production, ask for the incident log.

## Production Trap

::: warning
Building a Level 4 agent when a Level 2 would solve the problem. More autonomy = more failure modes. Start simple. Add autonomy only when you have the eval infrastructure to catch failures.
:::

## Recall Hook

> More levels = more loops = more failure modes. Match autonomy to your eval maturity.

---

*Next: [Design Patterns →](/guide/design-patterns)*
