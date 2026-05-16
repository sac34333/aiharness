---
title: How to Deploy GenAI Safely
description: The governance framework that makes AI deployment safe without making it useless. Practical rules for teams and organisations.
---

# How to Deploy GenAI Safely

> The goal is not to make AI safe by making it useless. The goal is governance that enables confident deployment.

## The False Choice

Most AI governance conversations present a false choice: deploy fast and accept the risk, or govern carefully and fall behind. This framing is wrong.

Good governance is what makes fast deployment *sustainable*. Without it, you're one incident away from a complete freeze.

## The Framework

### Layer 1: Data Governance

Before any agent touches production, answer these questions:
- What data can this agent access?
- What data should it never access?
- What happens when it accesses data it shouldn't?

Document the answers. Enforce them technically, not just through policy.

### Layer 2: Error Classification

Not all errors are equal. Classify them:

| Error Class | Example | Response |
|---|---|---|
| **Benign** | Slightly wrong tone | Log, monitor |
| **Recoverable** | Wrong information, caught by user | Log, retrain eval |
| **Harmful** | Privacy violation, financial error | Halt, human review, incident report |
| **Catastrophic** | Data exfiltration, system compromise | Immediate shutdown, post-mortem |

Know which class each failure belongs to before you deploy. Design your monitoring to detect each class.

### Layer 3: Human Escalation Paths

For every agent workflow, define:
1. What triggers escalation to a human?
2. Who is the human?
3. What context does the human receive?
4. What happens if no human is available?

If you can't answer all four, the workflow isn't ready for production.

### Layer 4: Audit and Accountability

Every agent action should be logged with:
- Who initiated it (user ID)
- What the agent decided
- What tools it called
- What the outcome was

This isn't optional for enterprise deployment. It's the foundation of trust, compliance, and debugging.

## The Loan Officer Example

A loan officer uses an AI agent to assist with credit decisions. The agent analyses documents and makes a recommendation.

**Without governance:** The agent makes a recommendation. The officer follows it. The reasoning is opaque. A rejected applicant asks why. Nobody can explain it. Regulatory problem.

**With governance:** The agent makes a recommendation *with explicit reasoning*. The officer reviews and signs off. The reasoning is logged. A rejected applicant receives a clear explanation. Audit trail exists. Compliant.

Same capability. Completely different accountability.

## The One Rule

If you only implement one thing: **every consequential agent action requires a human to acknowledge before it executes.**

Define "consequential" for your context. Start conservative. Relax it as trust is earned through evidence.

---

<div class="contribute-cta">

**Have a governance model that works?** [Share the framework](https://github.com/sac34333/aiharness/edit/main/docs/articles/deploy-genai-safely.md) — specific and practical contributions welcome.

</div>
