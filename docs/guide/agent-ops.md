---
title: Agent Ops & Production Architecture
description: Eval datasets, LLM judges, CI/CD pipelines, and the full production architecture for multi-agent systems.
---

# Agent Ops & Production Architecture

> Shipping an agent is easy. Keeping it working in production is the real engineering challenge.

## The Eval-First Mindset

You cannot ship without evals. An agent without evals is a system with no feedback loop — you won't know it's failing until a user tells you.

**Minimum viable eval stack:**
1. **Golden dataset** — 50–100 known inputs with expected outputs
2. **LLM judge** — a second model that scores responses on your criteria
3. **Regression gate** — CI fails if eval score drops below threshold

```python
from evals import run_eval_suite

results = run_eval_suite(
    agent=my_agent,
    dataset="golden_set_v3.jsonl",
    judge_model="gemini-2.0-flash",
    pass_threshold=0.85
)

assert results.pass_rate >= 0.85, f"Eval regression: {results.pass_rate:.2%}"
```

## CI/CD for Agents

```
PR opened
  → Unit tests (tool mocking)
  → Eval suite runs (LLM judge)
  → Score gates checked
  → Canary deploy (5% traffic)
  → Monitor 24h
  → Full deploy
```

## The Full Production Architecture

```
User → API Gateway → Auth / Rate Limit
                  ↓
           Orchestrator Agent
          /         |         \
    Tool A      Tool B      Sub-Agent
                              |
                         Tool C / Tool D
                  ↓
           Memory Layer (Mem0 / ADK state)
                  ↓
           Observability (traces, evals, costs)
```

## Observability Stack

Every production agent needs:
- **Trace ID** per conversation
- **Span tracking** per tool call (latency, success/fail)
- **Token tracking** per request (input, output, cached)
- **Eval score** per response (async, via LLM judge)
- **Cost tracking** per user / per feature

## Production Trap

::: danger
Deploying without a rollback plan. Agents fail in ways that are hard to detect — not with 500 errors, but with subtly wrong answers. You need the ability to swap the agent version instantly. Always keep v(n-1) deployable.
:::

## Time to Restore

Track "Time to Restore Service" specifically for AI-generated changes. If an agent hallucinates a configuration error, your pipeline should revert it automatically or with a single click.

---

*Next: [Developer Mindset →](/guide/developer-mindset)*
