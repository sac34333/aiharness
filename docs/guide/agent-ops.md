---
title: Agent Ops — Running AI in Production
description: Why traditional DevOps fails for agents, eval datasets, LLM-as-judge, CI/CD for AI, OpenTelemetry tracing, and the complete production architecture.
---

# PART 9 — Agent Ops: Production Lifecycle

> Agents in production are not static software. They are living systems that need continuous management.

---

## Why Traditional DevOps Fails

```
Traditional software test:  assert output == expected_output  PASS/FAIL
Agent test:                 Is this response "good"?          depends...
```

Agents are **stochastic** — same input, different output on different runs. You cannot unit-test them like a pure function.

---

## The Agent Ops Stack

### 1. Define Metrics (Business KPIs, Not Just Technical)

- Goal completion rate, user satisfaction, task latency, cost per interaction
- Revenue impact, conversion, retention
- NOT just: tokens per second, uptime

### 2. Build Evaluation Datasets ("Golden Sets")

- Sample from real production interactions
- Cover the full range of use cases + edge cases
- Domain expert review before using as ground truth
- Treat the eval dataset as your most important asset — it is the ground truth for all decisions

### 3. Use an LLM-as-Judge

You cannot assert exact match → use a model to score quality:
```
"Does this answer correctly resolve the user's intent? Score 1-5 with reasoning."
```

Automated scoring at scale. No human reviewer needed for every response.

### 4. Metrics-Driven Deployment

```
Deploy new model/prompt version
      |
Run against full eval set
      |
Compare scores to production version
      |
Go/No-Go decision (score regression = blocker)
```

### 5. Trace with OpenTelemetry

For debugging (not performance dashboards). See:
- Exact prompt sent to the model
- Model reasoning steps
- Tool chosen + parameters passed
- Raw tool results
- Where in the loop the failure happened

Platforms: Google Cloud Trace, LangFuse, Datadog

### 6. Close the Feedback Loop

```
User reports bad answer
      |
Replicate the failure
      |
Add to eval dataset
      |
Every bug becomes a test case
```

---

## The CI/CD for Agents

```
Code change / New model / Prompt update
              |
    Run against eval dataset
              |
    LLM-as-Judge scores comparison
    New version vs. Production version
              |
    Latency + Cost + Quality all pass?
              |
    Deploy to production
              |
    Monitor -> Collect feedback -> Update eval dataset
```

---

## The Complete Production Architecture

```
                        PRODUCTION AI AGENT SYSTEM

+-------------------------------------------------------------------+
|  USER / OTHER SYSTEMS                                             |
|  Web UI  Mobile  A2A client  API                                  |
+----------------------------+--------------------------------------+
                             |
+----------------------------v--------------------------------------+
|  AGENT RUNTIME (ADK / Vertex AI Agent Engine)                     |
|                                                                   |
|  +------------------+  +---------------------------------------+  |
|  |  RUNNER          |  |  SERVICES                             |  |
|  |  (Orchestrator)  |  |  SessionService  -> PostgreSQL/Vertex |  |
|  |  Event Loop      |  |  ArtifactService -> GCS/S3            |  |
|  |  Context mgmt    |  |  MemoryService   -> Mem0/Vector DB    |  |
|  +-------+----------+  +---------------------------------------+  |
|          |                                                        |
|  +-------v-------------------------------------------------+     |
|  |  AGENT PIPELINE                                         |     |
|  |  OrchestratorAgent (Coordinator)                        |     |
|  |  +-- ResearchAgent (SequentialAgent)                    |     |
|  |  |   +-- before_tool_callback (auth check)              |     |
|  |  |   +-- Tool: RAG query                                |     |
|  |  |   +-- Tool: NL2SQL                                   |     |
|  |  +-- DraftAgent (LlmAgent)                              |     |
|  |  |   +-- before_model_callback (PII scrub)              |     |
|  |  |   +-- Tool: document_writer                          |     |
|  |  +-- ReviewAgent (LlmAgent)                             |     |
|  |      +-- after_model_callback (content filter)          |     |
|  +---------------------------------------------------------+     |
+----------------------------+--------------------------------------+
                             |
+----------------------------v--------------------------------------+
|  INFERENCE LAYER                                                  |
|  +----------------------+  +-------------------------------+     |
|  |  CACHING STACK       |  |  MODEL ROUTING                |     |
|  |  Semantic Cache      |  |  Complex -> Gemini 2.5 Pro    |     |
|  |  Prompt Cache        |  |  Simple  -> Gemini 2.5 Flash  |     |
|  |  KV Cache (GPU)      |  |  Images  -> Specialized APIs  |     |
|  +----------------------+  +-------------------------------+     |
+----------------------------+--------------------------------------+
                             |
+----------------------------v--------------------------------------+
|  AGENT OPS                                                        |
|  Eval datasets  LLM judges  OpenTelemetry traces                  |
|  CI/CD pipeline  Model upgrade automation                         |
|  Human feedback loop -> new test cases                            |
+-------------------------------------------------------------------+
```

---

## Key Ops Rules

- **Models rotate every 6 months**. You need a CI/CD pipeline that can swap the model without architectural changes.
- **Every production failure becomes a test case**. The eval dataset grows with every bug.
- **Score regression = deployment blocker**. Treat it like a failing build.
- **Monitor cost per interaction**, not just quality. Quality at 10× cost is not production-ready.

---

## Recall Hook

> **For agents, "testing" means evaluation datasets + LLM judges, not assert statements. Every bug is a new test case.**

---

## Sources

- Google ADK Whitepaper: *Introduction to Agents* — Agent Ops section
- Google ADK Documentation: Evaluation, Tracing
- LangFuse: [langfuse.com](https://langfuse.com)

<div class="contribute-cta">

**Have an eval strategy that actually works in production?** [Share it here](https://github.com/sac34333/aiharness/edit/main/docs/guide/agent-ops.md) — specific frameworks and metrics welcome.

</div>
