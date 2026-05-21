---
title: AI Offense Before Defense
description: Security leaders should turn offensive AI tools on their own systems before threat actors do. The defenders who move first win — because they have something attackers don't: context.
---

# AI Offense Before Defense

> The same AI model produces very different results based on the context you feed it. Attackers have less context about you. As defenders, we have a lot. Use it first — or someone else will.

---

## The Defenders' Advantage No One Talks About

Yinon Costica, co-founder of Wiz (now part of Google), articulated something most security leaders haven't internalised yet:

> "If, as defenders, we take the first movers' advantage and we use the AI against ourselves, with the context we have, we actually stand a chance to win. But we need to act fast."

The logic is simple and powerful. AI models are shaped by context. Attackers have limited context about your environment. Defenders have deep knowledge — network architecture, API surfaces, codebases, access patterns, operational technology assets. That context asymmetry is the defenders' advantage. But it only holds if you exploit it first.

<div class="highlight-box">
<strong>The principle:</strong> Before threat actors probe your attack surface with AI, do it yourself. You know where the weak points are. You have the context they don't. Use it.
</div>

---

## Wiz's Answer: Red, Green, Blue

Wiz has introduced three AI security agents designed to operationalise this exact philosophy:

<div class="agent-grid">

<div class="agent-card agent-red">
<div class="agent-badge">🔍 Red Agent</div>
<strong>Offensive — Find it first</strong>

Probes deep into your IT estate. Identifies exposed APIs, end-of-life edge networking, OT assets, and unknown attack surfaces. Runs penetration tests on everything it finds. This is the "use AI against yourself" agent.
</div>

<div class="agent-card agent-green">
<div class="agent-badge">🩹 Green Agent</div>
<strong>Triage — Accelerate the bottleneck</strong>

Automates what takes human teams ages: vulnerability triage, severity assessment, and prioritisation. The bottleneck in most security workflows isn't detection — it's deciding what matters first.
</div>

<div class="agent-card agent-blue">
<div class="agent-badge">🛡️ Blue Agent</div>
<strong>Investigative — Close the loop</strong>

Does the detective work. Correlates signals, traces attack paths, and produces evidence that human analysts would take days to assemble. Cuts the investigation gap between detection and response.
</div>

</div>

> "These three agents together form a layer that is autonomous and automated. It's not revolutionary in that it aligns closely to how security teams have been working for many years — but now it allows each team to automate their workflows." — Yinon Costica

The point is not that agents replace red, green, or blue teams. The point is that defenders can now scale the same offensive techniques against their own systems at a speed and breadth that manual teams cannot match.

---

## The Speed Problem

Costica was candid about the challenge: speed. Attackers are not waiting. The tools to automate offensive security are becoming widely available. The question is whether defenders use them first.

<div class="flow-diagram">
<div class="flow-step"><strong>Attacker AI</strong> — scans your attack surface, finds exposures, crafts exploits</div>
<div class="flow-arrow"></div>
<div class="flow-step"><strong>Defender AI</strong> — scans the same surface, with full context, finds the same exposures first</div>
<div class="flow-arrow"></div>
<div class="flow-step"><strong>The delta</strong> — whoever runs this loop first owns the high ground</div>
</div>

The same infrastructure, the same exposures. The difference is who sees them first and what they do about it. Right now, most defenders are not running this loop at all.

---

## The $32bn Signal: Wiz + Google

Google's $32bn acquisition of Wiz — its largest purchase to date — signals a shift in how the industry thinks about security. The two organisations are building toward a unified security platform that:

- Retains Wiz's brand and multi-cloud support (AWS, Azure, Oracle Cloud)
- Integrates Wiz Defend detections with Google Security Operations and Mandiant Threat Defence
- Adds agent studio support for AWS Agentcore, Azure Copilot Studio, Salesforce Agentforce, and Gemini Enterprise Agent
- Extends to edge integrations with Apigee, Cloudflare AI Security, and Vercel

The acquisition is not just about tools. It's about velocity. Wiz's agent framework is designed to close the gap between finding a risk and shipping a fix — from detection to code fix to redeployment, automated.

---

## Beyond the Perimeter: Agents Change Security

AI agents are no longer experiments. They are being positioned as ecosystems that can reason, act, and run across real enterprise workflows.

This changes security fundamentally. Traditional models protect the perimeter. Agents don't have a perimeter. They dynamically call APIs, chain tools, and operate across systems and teams.

<div class="compare-grid">
<div class="compare-col bad">
<h4>Old Model: Perimeter Security</h4>
<ul>
<li>Firewall at the boundary</li>
<li>Static access control lists</li>
<li>Agent = another user with permissions</li>
<li>Alerts after something goes wrong</li>
<li>One breach path = one investigation</li>
</ul>
</div>
<div class="compare-col good">
<h4>New Model: Agent-Aware Security</h4>
<ul>
<li>Identity and context per agent</li>
<li>Dynamic, fine-grained permissions</li>
<li>Continuous monitoring of agent actions</li>
<li>Adversarial testing before deployment</li>
<li>Audit trails on every decision and action</li>
</ul>
</div>
</div>

For telecom operators, this is especially urgent. Agents may span customer care, network operations, IT, partner ecosystems, and multiple regulatory regions — all with different compliance constraints. The old approach doesn't scale to agents that act, not just assist.

---

## Governance Is Now the Bottleneck

The shift is clear: the problem is no longer "can we build agents?" It's "can we run them safely at scale?"

Most organisations now know how to create agents. Far fewer are comfortable running large numbers of them across live systems. Governance frameworks built for human workflows or static software were not designed for autonomous systems that run continuously and make decisions.

The questions that matter now:

- **Which agents** can access what systems and data?
- **What actions** are they authorised to take, and where are the boundaries?
- **How are decisions logged**, audited, and stopped if something goes wrong?
- **Who is accountable** when an agent makes a consequential decision?

<div class="highlight-box">
<strong>The uncomfortable truth:</strong> 70% of European public sector IT leaders say their teams cannot keep pace with the technology they are already deploying. The skills gap will kill AI security deployments faster than any technical limitation.
</div>

---

## Adversarial Testing: Confidence Must Be Earned

Here is the part most security leaders skip. Offensive AI tools are not inherently robust just because they are built for security.

AI models behave probabilistically. Their outputs vary depending on context, input structure, and interaction history. A tool that looks reliable in a controlled demo can become unpredictable when:

- It is actively manipulated by an attacker
- It receives inputs outside known conditions
- It operates in noisy, complex, real-world environments

<div class="layer-stack">
<div class="layer">
<div class="layer-num">1</div>
<div class="layer-content">
<strong>Basic safeguards fail fast</strong>
<span>Adversarial exercises show that standard guardrails are bypassed quickly</span>
</div>
</div>
<div class="layer">
<div class="layer-num">2</div>
<div class="layer-content">
<strong>Failures are not benign</strong>
<span>Manipulated models can leak data, misclassify events, or take unintended actions at scale</span>
</div>
</div>
<div class="layer">
<div class="layer-num">3</div>
<div class="layer-content">
<strong>Guardrails ≠ resilience</strong>
<span>A model that stays "on-rails" in a demo may fail under novel inputs or chained attacks</span>
</div>
</div>
<div class="layer">
<div class="layer-num">4</div>
<div class="layer-content">
<strong>Evidence replaces trust</strong>
<span>Confidence comes from adversarial testing that reflects real threat conditions — not from vendor claims</span>
</div>
</div>
</div>

The most promising AI security use cases are those that **augment human decision-making** — triage assistance, pattern recognition at scale, investigative support. Measurable gains, properly constrained, and tested under pressure.

By contrast, fully autonomous decision-making or broad unsupervised control introduces risk faster than it reduces it.

---

## Tiered Autonomy: People Still Matter

The encouraging trend is a focus on balance. Full autonomy delivers efficiency, but not every decision should be hands-off.

<div class="tier-table">

| Tier | Agent Role | Human Role | Risk Level |
|---|---|---|---|
| **Routine** | Handle within strict guardrails | Monitor, seasonal review | Low |
| **Elevated** | Recommend, surface context | Approve, apply judgment | Medium |
| **Critical** | Assist, provide evidence | Decide, own the outcome | High |

</div>

Tiered autonomy lets organisations move faster while staying in control. Designing for this balance early matters. Retrofitting it later is much harder.

---

## What to Do Now

**1. Turn AI against your own systems first.**
Run red-team AI against your own attack surface, code, and APIs before threat actors do. You have the context advantage. Use it.

**2. Map which agents can access what, and draw hard lines.**
Agent identity, fine-grained permissions, and continuous monitoring are now core requirements — not optional add-ons.

**3. Test your AI security tools adversarially.**
Don't just test whether they work. Test how they behave when they are stressed, manipulated, or fed inputs outside known conditions. Resilience is demonstrated, not claimed.

**4. Build governance before you need it at scale.**
Define which agents exist, what they can access, what decisions they can make, and how that behaviour changes over time. Retroactive governance is nearly impossible.

**5. Design tiered autonomy from day one.**
Not every decision should be autonomous. Define which tier each workflow sits in — routine, elevated, or critical — and build escalation paths accordingly.

---

## The Bottom Line

AI is being used on both sides of security. The defenders' advantage is context — but it only holds if you exploit it before attackers do.

Confidence in AI-powered security is not assumed. It is earned through adversarial testing, evidence, and proof under pressure. The goal for CISOs is not trust. It is evidence-backed confidence.

Vendors who can demonstrate genuine resilience under adversarial scrutiny will stand apart from those relying on claims alone. Proof, not hype, is the most valuable security control of all.

---

<div class="contribute-cta">

**Running adversarial AI tests against your own systems?** [Share what you're learning](https://github.com/sac34333/aiharness/edit/main/docs/articles/ai-offense-before-defense.md) — real deployment experience makes this more useful.

</div>