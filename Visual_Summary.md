# Visual Summary: AI4IT/SDLC Setup at a Glance

## The Shift: From Chaos to Structure (with Agents)

```
╔════════════════════════════════════════════════════════════════╗
║                      THE OLD WAY (❌)                          ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Developer:  "Claude, implement CSV export"                  ║
║         ↓                                                     ║
║  Claude:     "I'll guess which service..."                  ║
║         ↓                                                     ║
║  Result:     ❌ Wrong files                                  ║
║              ❌ Wrong patterns                               ║
║              ❌ Wrong service chosen                         ║
║         ↓                                                     ║
║  Fix:        3-5 code review cycles                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

                              👇

╔════════════════════════════════════════════════════════════════╗
║                      THE NEW WAY (✅)                          ║
║                  (with Specialized Agents)                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Developer:  "Select PaymentServiceAgent in VS Code"        ║
║         ↓                                                     ║
║  Agent loads: CLAUDE.md + PATTERNS.md + DEVOPS.md +         ║
║               PaymentServiceAgent/SKILL.md                  ║
║         ↓                                                     ║
║  Developer:  "Implement CSV export task"                    ║
║         ↓                                                     ║
║  Agent:      "I know payment service patterns"              ║
║              "I know I can ONLY modify payment-service/"    ║
║              "I'll follow PATTERNS.md"                      ║
║              "I'll check TESTING.md for tests"              ║
║         ↓                                                     ║
║  Result:     ✅ Right service                                ║
║              ✅ Correct patterns                             ║
║              ✅ Proper tests included                        ║
║              ✅ Follows DEVOPS.md if Helm needed            ║
║         ↓                                                     ║
║  Fix:        1-2 code review cycles                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Your Setup: Shared Knowledge Bases + Specialized Agents

```
SHARED KNOWLEDGE BASES (All Agents Read)
├── 1. CLAUDE.md
│   ├─ Code standards & naming conventions
│   ├─ Security rules (no credentials, K8s secrets)
│   ├─ Quality gates (SonarQube, coverage)
│   └─ Technology stack overview
│
│   ⏱️  TIME TO CREATE: 3-4 hours
│   🎯 IMPACT: CRITICAL - foundation for all agents
│
├── 2. PATTERNS.md
│   ├─ REST endpoint example
│   ├─ Async processing example
│   ├─ Database query example
│   └─ Testing example
│
│   ⏱️  TIME TO CREATE: 2-3 hours
│   🎯 IMPACT: High - agents reference these
│
├── 3. ARCHITECTURE.md
│   ├─ Service inventory (25 microservices)
│   ├─ Key integrations between services
│   └─ Technology decisions
│
│   ⏱️  TIME TO CREATE: 2 hours
│   🎯 IMPACT: Medium - agents understand system
│
├── 4. TESTING.md
│   ├─ Unit test patterns (JUnit, Jest)
│   ├─ Integration test patterns
│   ├─ Coverage requirements (80%+)
│   └─ CI/CD testing strategy
│
│   ⏱️  TIME TO CREATE: 2-3 hours
│   🎯 IMPACT: High - QA agent critical needs this
│
└── 5. DEVOPS.md
    ├─ Helm chart structure
    ├─ Secrets management (K8s)
    ├─ OpenShift deployment
    ├─ Docker best practices (Hadolint)
    └─ CI/CD pipeline overview
    
    ⏱️  TIME TO CREATE: 2-3 hours
    🎯 IMPACT: CRITICAL - DevSecOps agent needs this

────────────────────────────────────────────────────

SPECIALIZED AGENTS (Experts in Their Domain)

├── Component Agents (One Per Major Service)
│   │
│   ├── payment-service-agent/
│   │   ├─ AGENT.md (Identity: Payment Service Specialist)
│   │   │   └─ Scope: /services/payment-service/ ONLY
│   │   └─ SKILL.md (Payment expertise)
│   │       └─ Async patterns, gateway APIs, security
│   │
│   ├── user-service-agent/
│   │   ├─ AGENT.md (Identity: User Service Specialist)
│   │   └─ SKILL.md (Auth patterns, user management)
│   │
│   ├── order-service-agent/
│   │   ├─ AGENT.md (Identity: Order Service Specialist)
│   │   └─ SKILL.md (Order workflows, integrations)
│   │
│   └── ... (similar for other 3 major services)
│
│   ⏱️  TIME PER AGENT: 1-2 hours
│   🎯 IMPACT: High - agents specialized in their domain
│
├── Specialist Agents (By Function)
│   │
│   ├── qa-automation-agent/
│   │   ├─ AGENT.md (Identity: QA Automation Specialist)
│   │   │   └─ Can modify: all test files, CI/CD
│   │   └─ SKILL.md (Testing expertise)
│   │       ├─ JUnit 5, Cypress, coverage tools
│   │       └─ CI/CD testing strategy
│   │
│   └── devsecops-agent/
│       ├─ AGENT.md (Identity: Security & DevOps Specialist)
│       │   └─ Can: validate Helm, scan secrets, deploy
│       └─ SKILL.md (DevOps expertise)
│           ├─ Hadolint, SonarQube, Helm
│           ├─ Secrets management, OpenShift
│           └─ CI/CD pipeline
│
│   ⏱️  TIME PER AGENT: 1-2 hours
│   🎯 IMPACT: CRITICAL - specialized expertise
│
└── Agent Registry
    ├─ .agents/AGENTS.md (list all agents)
    └─ .vscode/agents.json (VS Code selector)
    
    ⏱️  TIME TO CREATE: 1 hour
    🎯 IMPACT: Medium - enables agent selection
```

**TOTAL SETUP TIME: ~2-3 person-days**

---

## The Process: Phase 1 & Phase 2

```
┌──────────────────────────────────────────────────────────────┐
│                    PHASE 1: PLANNING                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Developer:                                                  │
│   "Claude, analyze services/payment-service/ and think      │
│    about how we'd add CSV export"                           │
│                                                              │
│ Claude:                                                     │
│   ✓ Scans ACTUAL code (not guessing)                       │
│   ✓ Traces symbols and patterns                            │
│   ✓ Identifies affected services                           │
│   ✓ Creates IMPACT MAP                                     │
│                                                              │
│ Developer Reviews (10 minutes):                             │
│   "Do we need to change these files? Yes/No?               │
│    Did you miss any services? Are file paths real?"        │
│                                                              │
│ Outcome:                                                   │
│   ✅ APPROVED: Proceed to Phase 2                          │
│   ❌ REJECTED: Claude fixes assumptions and retries        │
│                                                              │
│ KEY BENEFIT:                                                │
│   Catches structural mistakes BEFORE coding starts          │
│   (Saves ~2 hours of refactoring)                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘

                          ↓ APPROVED ↓

┌──────────────────────────────────────────────────────────────┐
│                   PHASE 2: IMPLEMENTATION                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Structured Jira Task Created:                               │
│   ├─ Repository: payment-service (single scope)            │
│   ├─ Files to Modify:                                      │
│   │   ├─ src/main/java/.../PaymentController.java          │
│   │   ├─ src/main/java/.../CsvExportService.java (new)    │
│   │   └─ src/test/java/.../CsvExportServiceTest.java      │
│   ├─ Implementation Notes:                                  │
│   │   ├─ Follow pattern in ReportService.exportJson()     │
│   │   └─ Use existing CSV library                          │
│   ├─ Acceptance Criteria:                                  │
│   │   ├─ GET /api/v1/csv returns valid CSV ☐              │
│   │   ├─ Existing JSON endpoint unchanged ☐               │
│   │   └─ SonarQube: 0 blockers ☐                          │
│   └─ Test Requirements:                                    │
│       ├─ Unit test CSV generation ☐                       │
│       └─ Integration test endpoint ☐                       │
│                                                              │
│ Claude Implements:                                          │
│   ✓ Against THIS specification (not guessing)              │
│   ✓ Following REAL patterns found in code                  │
│   ✓ To REAL file paths                                    │
│                                                              │
│ Developer Reviews PR:                                      │
│   "Does this implement the spec correctly?"               │
│                                                              │
│ Result:                                                    │
│   ✅ Code matches spec                                     │
│   ✅ Follows your patterns                                 │
│   ✅ Works first try                                       │
│   ✅ 1-2 review cycles (not 3-5)                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Timeline: Week by Week (with Agents)

```
WEEK 1: FOUNDATION - Shared Knowledge Bases
├── Monday: Understand approach (read guides) - 1 hour
├── Tue-Wed: Create shared knowledge bases - 8 hours
│   ├─ CLAUDE.md (standards, security, quality)
│   ├─ PATTERNS.md (code examples)
│   ├─ ARCHITECTURE.md (service map)
│   ├─ TESTING.md (test strategies)
│   └─ DEVOPS.md (deployment)
├── Thursday: Set up .agents/ infrastructure - 2 hours
│   ├─ Create .agents/ directory
│   ├─ Create .agents/AGENTS.md (registry)
│   └─ Set up .mcp/config.json
├── Friday: Plan agent design - 1 hour
└── 📊 TOTAL: 12 hours (1.5 person-days)

WEEK 2: AGENTS - Component & Specialist Agents
├── Monday-Tue: Create component agents - 4 hours
│   ├─ payment-service-agent/AGENT.md + SKILL.md
│   ├─ user-service-agent/AGENT.md + SKILL.md
│   └─ order-service-agent/AGENT.md + SKILL.md
├── Wednesday: Create specialist agents - 3 hours
│   ├─ qa-automation-agent/AGENT.md + SKILL.md
│   └─ devsecops-agent/AGENT.md + SKILL.md
├── Thursday: Wire up agent selector - 2 hours
│   └─ .vscode/agents.json or .instructions.md
├── Friday: Test agents with pilots - 2 hours
│   └─ Test 2-3 agents with real tasks
└── 📊 TOTAL: 11 hours (1.5 person-days)

WEEK 3: TEAM ADOPTION - Training & Feedback
├── Monday: Team training - 1-2 hours
│   ├─ What are agents and why?
│   ├─ How to select agents in VS Code
│   ├─ What each agent knows
│   └─ When to use which agent
├── Tue-Wed: Test each agent type - 4 hours
│   ├─ Component agent (PaymentService task)
│   ├─ QA agent (write tests)
│   └─ DevSecOps agent (validate, scan, deploy)
├── Thursday-Fri: Collect feedback, refine - 2 hours
│   ├─ What knowledge was missing?
│   ├─ What patterns weren't clear?
│   └─ Update SKILL.md files
└── 📊 TOTAL: 7-8 hours (1 person-day)

WEEK 4+: FULL ADOPTION - All Tasks Use Agents
├── All NEW tasks assign to appropriate agent
├── Agents load: shared bases + domain SKILL.md
├── Impact map review becomes standard
├── Monitor: SonarQube metrics, PR cycles, velocity
├── Refine: SKILL.md based on lessons learned
└── 📊 PAYOFF: 20-30% velocity gain by week 8
```

---

## Team Roles & Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│ TEAM LEAD / MANAGER                                         │
├─────────────────────────────────────────────────────────────┤
│ ✓ Understand the approach                                   │
│ ✓ Champion the process with team                            │
│ ✓ Allocate time for setup (1-2 days)                        │
│ ✓ Monitor progress (watch SonarQube metrics)               │
│ ✓ Collect team feedback                                     │
│                                                             │
│ Success looks like:                                         │
│   Week 2: Team understands new way                         │
│   Week 4: New code quality improving                       │
│   Week 8: 20-30% velocity gain                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TECH LEAD / ARCHITECT                                       │
├─────────────────────────────────────────────────────────────┤
│ ✓ Create CLAUDE.md (most important!)                       │
│ ✓ Document code patterns with real examples                │
│ ✓ Set up MCP servers                                       │
│ ✓ Create PATTERNS.md                                       │
│ ✓ Review impact maps in planning phase                     │
│                                                             │
│ Success looks like:                                         │
│   CLAUDE.md becomes reference for all devs                │
│   Impact maps catch architecture mistakes                  │
│   Code becomes more consistent                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ DEVELOPERS                                                  │
├─────────────────────────────────────────────────────────────┤
│ ✓ Learn CLAUDE.md and patterns                             │
│ ✓ Use Jira task template for ALL new tasks                │
│ ✓ Participate in impact map reviews                        │
│ ✓ Provide feedback on process                              │
│ ✓ Write tests per requirements                             │
│                                                             │
│ Success looks like:                                         │
│   Clearer task specs → fewer questions                    │
│   Claude understands patterns → better code               │
│   Faster code reviews → ship faster                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ DEVOPS / CI-CD                                              │
├─────────────────────────────────────────────────────────────┤
│ ✓ Configure and test MCP servers                           │
│ ✓ Ensure SonarQube & Hadolint gates work                  │
│ ✓ Monitor quality metrics                                  │
│ ✓ Provide observability data                               │
│                                                             │
│ Success looks like:                                         │
│   Claude gets instant SonarQube feedback                  │
│   Pipeline passes on new code                            │
│   Metrics show improvement                               │
└─────────────────────────────────────────────────────────────┘
```

---

## What Changes (And What Doesn't)

```
╔════════════════════════════════════════════════════════════╗
║ WHAT CHANGES                        │ WHAT STAYS SAME       ║
╠════════════════════════════════════════════════════════════╣
║ ✓ How you create Jira tasks         │ ✓ Git workflow        ║
║ ✓ Planning before coding            │ ✓ PR review process   ║
║ ✓ Documentation in repository       │ ✓ CI/CD pipeline      ║
║ ✓ Code standardization              │ ✓ Deploy process      ║
║ ✓ Developer habits (guided by docs) │ ✓ Testing tools       ║
║                                      │ ✓ SonarQube/Hadolint  ║
║                                      │ ✓ Kubernetes/Helm     ║
╚════════════════════════════════════════════════════════════╝
```

---

## Quick Checklist: Am I Ready?

```
✓ Do we have VS Code + Claude Code?
  → Yes, move on

✓ Can someone describe 3 code patterns in your services?
  → No? Have tech lead read the codebase first

✓ Do we have SonarQube + Hadolint?
  → Yes, good. This enforces quality gates

✓ Are Jira tasks currently vague or specific?
  → Too vague? This approach will fix that

✓ Does team want better code quality?
  → Yes? This helps

✓ Are you willing to invest 1-2 days in setup?
  → Yes? You're ready!
```

---

## Common Concerns & Answers

```
CONCERN: "Isn't this more work?"
ANSWER:  No. You trade 10 mins of planning for 2 hours of fixing.
         Also: Future devs understand code better.

─────────────────────────────────────────────────────────────

CONCERN: "Will Claude understand our MCP servers?"
ANSWER:  Yes. Once configured, Claude Code reads GitLab repos
         and Jira tasks automatically.

─────────────────────────────────────────────────────────────

CONCERN: "Do ALL tasks need impact maps?"
ANSWER:  Only complex ones. Trivial fixes (<20 lines) can skip it.

─────────────────────────────────────────────────────────────

CONCERN: "What if we have 100 old tasks?"
ANSWER:  Start with NEW tasks. Old ones still work. Over time,
         codebase becomes more consistent.

─────────────────────────────────────────────────────────────

CONCERN: "This sounds like a lot of documents to maintain"
ANSWER:  Start with CLAUDE.md only. Add others as needed.
         Treat them like code: review, version, refactor.
```

---

## Success Metrics: Before vs After

```
BEFORE (Without This Approach)
─────────────────────────────────────────────────────────────
PR review cycles:           3-5 rounds
"Wrong service" mistakes:   Frequent (20%+ of tasks)
Code pattern violations:    High (30%+ of code)
SonarQube blockers:         High on new code
Developer questions:        "Which service does this go in?"
                           "What's the existing pattern?"
Setup time for new dev:     Weeks

AFTER (With This Approach)
─────────────────────────────────────────────────────────────
PR review cycles:           1-2 rounds        ✅ 50% faster
"Wrong service" mistakes:   Rare (<5%)        ✅ 75% reduction
Code pattern violations:    Low (5% or less)  ✅ 80% reduction
SonarQube blockers:         Near-zero         ✅ Zero tolerance
Developer questions:        Answered in docs  ✅ Self-service
                           Claude sees code  ✅ AI understands patterns
Setup time for new dev:     Days              ✅ CLAUDE.md is guide

VELOCITY IMPACT:
─────────────────────────────────────────────────────────────
Weeks 1-2:  -10% (setup time investment)
Week 3:      0% (break-even)
Week 4:    +10% (process clicks)
Week 8:    +20-30% (compound gains)

ROI:
─────────────────────────────────────────────────────────────
Setup investment:          8-16 person-hours
Payback period:            ~2 weeks
Ongoing benefits:          20-30% velocity gain
Quality improvement:       Measurable (SonarQube metrics)
```

---

## Your Decision: Go or No-Go?

```
ASK YOURSELF:

❓ Do we have frequent "solved wrong problem" code reviews?
   → YES? This fixes that

❓ Do PRs get 3+ review cycles?
   → YES? This reduces cycles

❓ Does SonarQube have blocker issues on new code?
   → YES? This reduces those

❓ Are developers asking "where does this go?"
   → YES? This prevents that

❓ Is our onboarding slower than it should be?
   → YES? CLAUDE.md fixes that

───────────────────────────────────────────

If YES to 3+: You're ready. Start this week.
If YES to 1-2: Good long-term investment. Plan for month 2.
If NO to all:  Nice to have. Revisit in 6 months.
```

---

## One-Page Summary for Slack/Announcement

```
📢 NEW: AI-Powered Development Workflow

We're shifting how we work with Claude Code to make our development faster and more reliable.

🔴 OLD WAY (Problem)
Vague task → Claude guesses → Wrong files/patterns → 3-5 review cycles

🟢 NEW WAY (Solution)
Structured planning → Real code analysis → Structured task → Right implementation → 1-2 review cycles

📋 WHAT THIS MEANS FOR YOU:

1️⃣  Read CLAUDE.md (your code conventions)
2️⃣  Use new Jira task template (all new tasks)
3️⃣  Plan with Claude first (5-10 minute analysis)
4️⃣  Implement against the spec (no guessing)

⏱️  TIMELINE
Week 1: Team lead creates foundational documents
Week 2: Team training + first pilot task
Week 3+: All new tasks use this process

📊 EXPECTED RESULTS
✓ Code quality: improved (SonarQube metrics)
✓ PR reviews: faster (1-2 cycles instead of 3-5)
✓ Velocity: 20-30% improvement by week 8
✓ Onboarding: new devs understand patterns faster

❓ QUESTIONS?
#architecture (design questions)
#devops-support (setup questions)

More details: Read Quick_Start_Guide.md
```

---

## Print & Post This

```
╔═══════════════════════════════════════════════════════════╗
║                  QUICK REFERENCE CARD                     ║
║          Save to your desk or VS Code workspace           ║
╚═══════════════════════════════════════════════════════════╝

START A TASK
─────────────────────────────────────────────────────────────
1. Read Jira task (use template format)
2. Check Files to Modify section
3. Read Implementation Notes (real code examples)
4. Have CLAUDE.md open
5. Code against the spec (no guessing)
6. Write tests per requirements
7. Run: mvn test, mvn verify
8. Check SonarQube: 0 blockers
9. Create PR referencing Jira task

CORE DOCUMENTS
─────────────────────────────────────────────────────────────
CLAUDE.md          → Your patterns & standards
PATTERNS.md        → Code examples
ARCHITECTURE.md    → Service map
Jira Template      → Task structure
.mcp/config.json   → AI integration

WHEN STUCK
─────────────────────────────────────────────────────────────
"Which pattern applies?"
→ See CLAUDE.md or PATTERNS.md

"Where does this file go?"
→ See ARCHITECTURE.md or Jira task

"How do I write tests?"
→ See PATTERNS.md example

"What service owns this?"
→ See ARCHITECTURE.md or ask #architecture
```

