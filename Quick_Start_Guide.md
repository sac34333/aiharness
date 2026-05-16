# Quick Start: AI-Powered Development Setup

## What You Need to Do (In Order)

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: UNDERSTAND THE CHANGE (30 minutes)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Read: AI4IT_SDLC_Setup_Guide.md                            │
│       → Parts 1-3 (Architecture, Changes, Developer Setup) │
│                                                             │
│ Key insight: Shift from "vague in, vague out" to           │
│              "structure in, reliable out"                  │
│                                                             │
│ NEW CONCEPT: Specialized Agents                           │
│       Each agent is an expert in one domain:              │
│       - PaymentServiceAgent (payment processing)          │
│       - QAAutomationAgent (testing)                       │
│       - DevSecOpsAgent (security + deployment)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: SETUP (3-5 days)                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Use: Implementation_Checklist_Templates.md                 │
│      → "CHECKLIST: Week 1 Setup"                          │
│                                                             │
│ PHASE A: Shared Knowledge Bases (Days 1-2)               │
│  ✓ /CLAUDE.md (code standards, security, quality)        │
│  ✓ /PATTERNS.md (REST, async, DB, testing examples)      │
│  ✓ /ARCHITECTURE.md (service map, integrations)          │
│  ✓ /TESTING.md (test strategies, frameworks)             │
│  ✓ /DEVOPS.md (Helm, secrets, OpenShift, CI/CD)          │
│                                                             │
│ PHASE B: Agent Infrastructure (Days 3-5)                 │
│  ✓ /.agents/ directory structure                         │
│  ✓ /.agents/AGENTS.md (registry of agents)               │
│  ✓ /.mcp/config.json (GitLab & Jira integration)         │
│                                                             │
│  ✓ Create component agents:                              │
│    - PaymentServiceAgent/AGENT.md + SKILL.md            │
│    - UserServiceAgent/AGENT.md + SKILL.md               │
│    - OrderServiceAgent/AGENT.md + SKILL.md              │
│                                                             │
│  ✓ Create specialist agents:                             │
│    - QAAutomationAgent/AGENT.md + SKILL.md              │
│    - DevSecOpsAgent/AGENT.md + SKILL.md                │
│                                                             │
│  ✓ Wire up VS Code agent selector                        │
│    (.vscode/agents.json or .instructions.md)            │
│                                                             │
│ Estimated effort: 2-3 person-days                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: TEAM TRAINING (1-2 hours)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Show your team:                                            │
│  1. What agents are and why they matter                   │
│  2. How to select an agent in VS Code                     │
│  3. What each agent knows (SKILL.md)                      │
│  4. When to use which agent                               │
│  5. Walk through one real example                         │
│                                                             │
│ Reference: AI4IT_SDLC_Setup_Guide.md Part 2 & 6          │
│           (Agent structure and skills)                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: FIRST REAL TASKS (1-2 days)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Test different agents with real tasks:                    │
│                                                             │
│ A) TEST PaymentServiceAgent:                              │
│    Claude: Selects PaymentServiceAgent in VS Code        │
│    Reads: CLAUDE.md + PATTERNS.md + DEVOPS.md +          │
│            PaymentServiceAgent/SKILL.md                   │
│    Task: "Add new payment method to gateway"             │
│    Result: Implements in payment-service/ correctly      │
│                                                             │
│ B) TEST QAAutomationAgent:                               │
│    Claude: Selects QAAutomationAgent                     │
│    Reads: TESTING.md + QAAutomationAgent/SKILL.md       │
│    Task: "Add integration tests for payment API"        │
│    Result: Tests written per TESTING.md strategy        │
│                                                             │
│ C) TEST DevSecOpsAgent:                                  │
│    Claude: Selects DevSecOpsAgent                        │
│    Reads: DEVOPS.md + DevSecOpsAgent/SKILL.md          │
│    Task: "Validate Helm charts, scan for secrets"       │
│    Result: Security scan done per DEVOPS.md             │
│                                                             │
│ Result: See quality difference vs old way                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: ONGOING (Next 3+ weeks)                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ✓ All NEW tasks assign to appropriate agent              │
│ ✓ Agent selector becomes standard in VS Code             │
│ ✓ Impact map review before implementation                │
│ ✓ Collect team feedback on agent knowledge               │
│ ✓ Refine SKILL.md files with lessons learned             │
│ ✓ Create remaining agents (other 3 services, etc.)       │
│                                                             │
│ Reference: AI4IT_SDLC_Setup_Guide.md Part 7              │
│           (Implementation Roadmap)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Document Guide: Which Document to Use When

### 📖 AI4IT_SDLC_Setup_Guide.md
**When to read:**
- You're new to this approach
- You need to understand the WHY
- You're presenting to stakeholders
- You need to explain the architecture

**Key sections:**
- Part 1: Architecture overview
- Part 2: What changes in workflow
- Part 3: Developer setup details
- Part 7: Implementation roadmap

---

### 📋 Implementation_Checklist_Templates.md
**When to use:**
- You're setting up the project
- You're creating documents/configs
- You need templates to copy/paste
- You're training your team

**Key sections:**
- CHECKLIST: Week 1 Setup
- TEMPLATE 1: Jira Task Template
- TEMPLATE 2: Impact Map Template
- TEMPLATE 3: CLAUDE.md
- TEMPLATE 4: Quick Reference Card

---

### 🚀 This Document (Quick Start)
**When to use:**
- You want the 30-second version
- You need a visual roadmap
- You're asking "where do I start?"

---

## Role-Based Quick Start

### If you're a **Team Lead / Manager**

**Your job:**
1. Understand the approach (read Part 1-2 of Setup Guide)
2. Prepare documents (use Implementation Checklist Week 1)
3. Train team (use Part 2 examples from Setup Guide)
4. Monitor progress (use Part 8 metrics)

**Time commitment:** ~4 hours setup + 1 hour training

**Documents to prepare:**
- CLAUDE.md (have tech lead help)
- Jira Task Template (copy from Implementation Checklist)
- Team training outline (steal from Setup Guide Part 2)

---

### If you're a **Technical Lead / Architect**

**Your job:**
1. Understand technical architecture (Part 1 of Setup Guide)
2. Create SHARED knowledge bases (CLAUDE.md, PATTERNS.md, ARCHITECTURE.md, TESTING.md, DEVOPS.md)
3. Design and create agents (AGENT.md + SKILL.md for each)
4. Set up MCP configs and agent selector in VS Code

**Time commitment:** 2-3 days

**Key documents to create:**
- CLAUDE.md (MOST CRITICAL - shared standards)
- PATTERNS.md (code examples everyone uses)
- ARCHITECTURE.md (system overview)
- TESTING.md (test strategies)
- DEVOPS.md (deployment processes)
- Agent files:
  - `.agents/payment-service-agent/AGENT.md + SKILL.md`
  - `.agents/qa-automation-agent/AGENT.md + SKILL.md`
  - `.agents/devsecops-agent/AGENT.md + SKILL.md`
  - (and more for other services)

**Questions to answer BEFORE building agents:**
```
1. What are our TOP 3 code patterns?
2. What mistakes do developers make most?
3. What are the gotchas in our codebase?
4. Where's the best example code?
5. What does a payment service expert need to know?
6. What does a QA automation expert need to know?
7. What does a DevSecOps expert need to know?
```

---

### If you're a **Developer**

**Your job:**
1. Learn the new process
2. Use templates for new tasks
3. Provide feedback

**Time commitment:** 30 mins learning + ongoing usage

**Read first:**
- Part 2 (What changes in workflow) from Setup Guide
- Quick Reference Card from Implementation Checklist
- Your project's CLAUDE.md (once created)

**When starting a task:**
1. Read Jira task (use new template)
2. If planning: understand Impact Map format
3. Implement following CLAUDE.md patterns
4. Run checks before PR

---

### If you're **Setting Up CI/CD Integration** (DevOps)

**Your job:**
1. Understand MCP architecture (Part 1 of Setup Guide)
2. Configure MCP servers (GitLab, Jira in .mcp/config.json)
3. Ensure quality gates work (SonarQube, Hadolint)
4. Monitor observability

**Time commitment:** 1-2 days

**Key documents:**
- TEMPLATE 3: .mcp/config.json in Implementation Checklist
- Part 5 (Infrastructure Setup) in Setup Guide

---

## The 5-Minute Explanation for Your Team

Use this in a meeting:

```
OLD WAY (Problem):
─────────────────
Dev: "Implement CSV export"
Claude: *guesses which service* → *guesses file paths* 
        → *invents API pattern*
Result: Wrong service, wrong files, need to refactor

NEW WAY (Solution):
──────────────────
Dev: "Let me think about this with Claude"
Claude: Scans actual code → Creates map of what changes where
Dev: Approves the plan → Creates Jira task with REAL file paths
Claude: Implements exactly what the task specifies
Result: Right service, right files, works first try

HOW TO DO THIS:
───────────────
1. Create CLAUDE.md with your code patterns
2. Use structured Jira task template
3. Always start with planning phase (5-10 mins review)
4. Implement from template (no guessing)

PAYOFF:
───────
✓ Code reviews: faster (1-2 rounds instead of 3-5)
✓ Code quality: better (fewer SonarQube issues)
✓ Developer speed: 20-30% faster
✓ AI reliability: much more predictable
```

---

## Common Questions & Answers

### Q: Do we HAVE to do the planning phase (impact map)?
**A:** Yes, if you want good results. It's 10 minutes that saves 2 hours of refactor. 
Skip it only for trivial changes (<20 lines).

---

### Q: What if we're already in the middle of a project?
**A:** Start with new tasks. Gradually apply to existing ones. 
No need to refactor old stuff.

---

### Q: Do we need ALL these documents?
**A:** Minimum required:
- [ ] CLAUDE.md (absolutely critical)
- [ ] Jira Task Template (required for new tasks)
- [ ] MCP config (needed for Claude to see your code)

Nice to have:
- [ ] PATTERNS.md (helps onboarding)
- [ ] Impact Map template (for planning)
- [ ] Quick Reference Card (desk copy)

---

### Q: How long does this setup take?
**A:** 
- Reading & understanding: 1 hour
- Setting up documents: 1-2 days
- Team training: 1 hour
- First task with new process: 1-2 days
- **Total: 1-2 weeks to full adoption**

---

### Q: Will Claude in VS Code understand our MCP servers?
**A:** Yes. Once you set up `.mcp/config.json` and authenticate, 
Claude Code can read GitLab repos, query Jira tickets, etc.

---

### Q: What about old code that doesn't follow these patterns?
**A:** Start enforcing for NEW code. Old code doesn't need refactoring. 
Over time, codebase becomes more consistent.

---

## Your First Week Action Plan

### Monday
- [ ] Read Setup Guide Parts 1-3 (1 hour)
- [ ] Identify who's on the implementation team

### Tuesday-Wednesday
- [ ] Draft SHARED KNOWLEDGE BASES (4 hours):
  - [ ] CLAUDE.md (standards, security, quality)
  - [ ] PATTERNS.md (REST, async, DB, testing examples)
  - [ ] ARCHITECTURE.md (service map)
  - [ ] TESTING.md (test strategies)
  - [ ] DEVOPS.md (Helm, secrets, deployment)

- [ ] Start AGENT design (with tech lead):
  - [ ] What should PaymentServiceAgent know?
  - [ ] What should QAAutomationAgent know?
  - [ ] What should DevSecOpsAgent know?

### Thursday
- [ ] Set up `.agents/` directory
- [ ] Set up `/.mcp/config.json`
- [ ] Create 1-2 agent files (AGENT.md + SKILL.md)
- [ ] Test MCP connections

### Friday
- [ ] Share all documents with team
- [ ] Create example agent task
- [ ] Schedule team training for next week
- [ ] Retrospective: what's missing?

### Next Week
- [ ] Complete remaining agents
- [ ] Team training (1-2 hours)
- [ ] Set up agent selector in VS Code
- [ ] Run first agent task (pilot)
- [ ] Collect feedback

---

## Success Looks Like

**Week 2:**
- All new Jira tasks use template
- Team starting to reference CLAUDE.md
- First impact map reviewed and approved

**Week 4:**
- Code quality improving (fewer SonarQube issues on new code)
- PR review cycles down to 1-2 rounds
- Team asking good questions about architecture

**Week 8:**
- Claude understanding your patterns automatically
- New developers finding CLAUDE.md useful for onboarding
- Development velocity noticeably faster

---

## Next Steps

1. **Read the full guides** (1-2 hours):
   - AI4IT_SDLC_Setup_Guide.md
   - Implementation_Checklist_Templates.md

2. **Gather your team** (30 mins):
   - Tech lead, dev manager, 2-3 senior developers
   - Discuss: "Does this approach make sense for us?"

3. **Start setup** (3-5 days):
   - Use the Week 1 checklist
   - Focus on CLAUDE.md first
   - Set up MCP integration

4. **Train team** (1 hour):
   - Show old way vs new way
   - Walk through one example
   - Answer questions

5. **Run pilot task** (1-2 days):
   - First full impact map → review → implementation
   - Get real feedback

6. **Iterate** (ongoing):
   - Refine templates based on feedback
   - Create more SKILLS
   - Monitor metrics

---

## Need Help?

If you get stuck:

1. **"Where do I start?"** → Read the sections labeled "Immediate (This Week)" in Setup Guide Part 10

2. **"What does CLAUDE.md look like?"** → Copy TEMPLATE 3 from Implementation Checklist and customize

3. **"How do we structure this task?"** → Copy TEMPLATE 1 (Jira Task Template) from Implementation Checklist

4. **"What's the process again?"** → Look at Setup Guide Part 2 "Concrete Example for Your Project"

---

## Key Mindset Shift

**FROM:**
"Let me describe the requirement and hope AI gets it right"

**TO:**
"Let me structure the environment so AI reliably gets it right"

**The difference:**
- Vague prompts → Vague results
- Structured environment → Reliable results

**Your job is to design the environment, not give perfect prompts.**

