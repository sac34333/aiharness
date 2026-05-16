---
title: Google ADK — Agent Development Kit
description: Google's open-source Python framework for building production AI agents. Event-driven runtime, agent types, tools, MCP, callbacks.
---

# Google ADK

> Google's open-source Python framework for production AI agents.

```bash
pip install google-adk
```

## What ADK Is

ADK (Agent Development Kit) is Google's framework for building, orchestrating, and deploying multi-agent systems in production. It's opinionated in the right ways — it forces you to think about state scope, tool registration, and agent hierarchy upfront.

## Agent Types in ADK

| Type | Description | Use Case |
|---|---|---|
| **LlmAgent** | LLM-powered, dynamic decisions | Most use cases |
| **SequentialAgent** | Runs sub-agents in order | Pipeline workflows |
| **ParallelAgent** | Runs sub-agents simultaneously | Independent tasks |
| **LoopAgent** | Repeats until condition met | Retry, polling |

## State Scopes

```python
# Session scope — this conversation only
session.state['current_task'] = 'analyse_report'

# User scope — persists across sessions for this user
session.state['user:timezone'] = 'Europe/London'

# App scope — shared across all users
session.state['app:model_version'] = 'gemini-2.0-flash'

# Temp scope — this invocation only, never stored
session.state['temp:api_response'] = raw_data
```

## Tools in ADK

ADK tools are Python functions decorated with `@tool`. They get automatically converted to function calling schemas.

```python
from google.adk.tools import tool

@tool
def search_knowledge_base(query: str, top_k: int = 5) -> list[dict]:
    """Search the internal knowledge base for relevant documents."""
    return vector_db.search(query, limit=top_k)
```

## MCP Integration

ADK supports Model Context Protocol natively — agents can expose and consume MCP tools, enabling interoperability with any MCP-compatible system.

## Production Trap

::: warning
Using `app:` scope for data that should be `user:` scoped. One user's preferences leaking into another user's context is a serious bug that's hard to debug in production.
:::

---

*Next: [Caching Overview →](/guide/caching-overview)*
