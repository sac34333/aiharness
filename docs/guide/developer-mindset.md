---
title: Developer Mindset for AI Systems
description: The mental model shift required to build AI systems. From deterministic bricklayer to probabilistic director. Prompts as code. Evals as tests.
---

# PART 10 — The Developer Mindset Shift

> From the Google ADK whitepaper — the most important mental model.

---

## The Fundamental Shift

**Old paradigm (bricklayer)**: You define every logical step precisely. Code is deterministic.

**New paradigm (director)**: You set the scene (system prompt), cast the roles (tools/agents), provide context (data). Your job is to guide an autonomous actor to deliver the performance.

```
BRICKLAYER                          DIRECTOR
"Step 1: do X"                      "You are a helpful agent.
"Step 2: if Y, do Z"                 Your goal is X.
"Step 3: else do W"                  You have these tools.
"Step 4: format as..."               Make good decisions."
```

---

## The Determinism Table

| Traditional Software | AI Systems |
|---|---|
| Deterministic output | Probabilistic output |
| Tests pass or fail | Evals score on a spectrum |
| Fix bugs by reading code | Fix failures by improving prompts + data |
| Version control = code | Version control = code + prompts + evals |
| Deploy once, monitor for errors | Deploy continuously, monitor for quality drift |

---

## Prompts Are Code

Treat prompts with the same rigour as code:
- Version control them
- Review them in PRs
- Test them against eval datasets
- Document why they changed

A prompt change is a behaviour change. Merge it like one.

---

## Comprehensive Evaluations Outweigh the Prompt

> "The caveat: Comprehensive evaluations outweigh the prompt. You can't just write a good prompt and ship. You must measure, evaluate, and iterate on agent behavior systematically."
> — Google ADK Whitepaper

A good prompt with no evals is a guess. A mediocre prompt with rigorous evals is a system you can improve.

The eval dataset is the most important asset in an AI product. It is the ground truth for all decisions. Build it from day one, grow it with every production failure.

---

## The Non-Determinism Trap

::: warning Common Mistake
Building integration tests that assert exact output. "The agent should respond with exactly: 'Your order has been processed.'" This will be brittle and fail constantly. Test *semantics*, not *strings*.
:::

---

## What Good Looks Like

A mature AI engineering team:
- Ships eval improvements **before** shipping prompt improvements
- Has a golden dataset that grows with every production failure
- Treats a score drop in CI as a blocker, not a warning
- Can answer "what changed?" when quality drops in production
- Has a CI/CD pipeline that can swap models without architectural overhaul (because models are superseded every 6 months)

---

## Recall Hook

> **You are not writing code that does things. You are writing specifications that guide a probabilistic system. The discipline is different. The rigour is the same.**

---

## Sources

- Google ADK Whitepaper: *Introduction to Agents* — The Director vs. Bricklayer analogy
- See also: [Agent Ops — Evals, CI/CD, Production](/guide/agent-ops)

<div class="contribute-cta">

**What mental model shift made the biggest difference for your team?** [Add it to this page](https://github.com/sac34333/aiharness/edit/main/docs/guide/developer-mindset.md) — reviewed before publishing.

</div>
