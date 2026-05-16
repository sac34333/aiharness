# Complete Directory Structure: AI-Powered Development with Agents

## Full Project Layout

```
your-project-root/
│
├── 📄 SHARED KNOWLEDGE BASES (All agents read these)
│   ├── CLAUDE.md                       ← Code standards, security, quality
│   ├── PATTERNS.md                     ← REST, async, DB, testing examples
│   ├── ARCHITECTURE.md                 ← Service map, integrations
│   ├── TESTING.md                      ← Test strategies, coverage
│   └── DEVOPS.md                       ← Helm, secrets, OpenShift, CI/CD
│
├── 📁 .agents/                         ← Agent infrastructure
│   ├── AGENTS.md                       ← Registry: lists all agents
│   │
│   ├── 🤖 payment-service-agent/
│   │   ├── AGENT.md                   ← Identity: Payment Service Specialist
│   │   │                               └─ Scope: /services/payment-service/ ONLY
│   │   │                               └─ Reads: CLAUDE.md, PATTERNS.md, DEVOPS.md
│   │   └── SKILL.md                   ← Payment expertise
│   │       ├─ Async processing patterns
│   │       ├─ Gateway integration (external APIs)
│   │       ├─ Payment-specific security
│   │       ├─ Error handling & recovery
│   │       └─ Common payment tasks
│   │
│   ├── 🤖 user-service-agent/
│   │   ├── AGENT.md                   ← Identity: User Service Specialist
│   │   │                               └─ Scope: /services/user-service/ ONLY
│   │   └── SKILL.md                   ← User management expertise
│   │       ├─ Authentication patterns
│   │       ├─ Authorization & permissions
│   │       ├─ User data management
│   │       └─ Session handling
│   │
│   ├── 🤖 order-service-agent/
│   │   ├── AGENT.md                   ← Identity: Order Service Specialist
│   │   └── SKILL.md                   ← Order management expertise
│   │
│   ├── 🤖 inventory-service-agent/
│   │   ├── AGENT.md                   ← Identity: Inventory Specialist
│   │   └── SKILL.md                   ← Stock & inventory expertise
│   │
│   ├── 🤖 qa-automation-agent/
│   │   ├── AGENT.md                   ← Identity: QA Automation Specialist
│   │   │                               └─ Scope: Can modify ALL test files + CI/CD
│   │   │                               └─ Reads: TESTING.md, DEVOPS.md
│   │   └── SKILL.md                   ← Testing expertise
│   │       ├─ JUnit 5 patterns
│   │       ├─ Cypress E2E patterns
│   │       ├─ Coverage requirements (80%+)
│   │       ├─ CI/CD testing strategy
│   │       └─ Performance testing
│   │
│   └── 🤖 devsecops-agent/
│       ├── AGENT.md                   ← Identity: Security & DevOps Specialist
│       │                               └─ Scope: Helm, Dockerfiles, secrets, deployment
│       │                               └─ Reads: DEVOPS.md, CLAUDE.md (security)
│       └── SKILL.md                   ← DevSecOps expertise
│           ├─ Hadolint (Docker security)
│           ├─ SonarQube gates & fixes
│           ├─ Secret scanning & management
│           ├─ Helm chart validation
│           └─ OpenShift deployment
│
├── 📁 .mcp/
│   ├── config.json                    ← MCP server configurations
│   │   ├─ GitLab server config
│   │   ├─ Jira server config
│   │   └─ (Optional) SonarQube server config
│   └── .env (not in Git)              ← Tokens, credentials
│
├── 📁 .vscode/
│   ├── agents.json  OR
│   └── .instructions.md               ← Agent selector configuration
│       └─ Maps agent names → .agents/{agent}/AGENT.md
│
├── 📁 .github/workflows/ (or equivalent CI/CD config)
│   ├── test.yml
│   ├── quality-gate.yml
│   └── deploy.yml
│
├── 📁 services/                       ← Your microservices
│   ├── payment-service/
│   │   ├── src/main/java/...          ← Java code (payment-service-agent modifies)
│   │   ├── src/test/java/...          ← Tests (qa-automation-agent helps)
│   │   ├── pom.xml                    ← Dependencies
│   │   └── Dockerfile                 ← devsecops-agent validates
│   │
│   ├── user-service/                  ← (user-service-agent handles)
│   ├── order-service/                 ← (order-service-agent handles)
│   ├── inventory-service/             ← (inventory-service-agent handles)
│   ├── notification-service/
│   ├── auth-service/
│   ├── api-gateway/
│   └── ui-dashboard/                  ← React frontend
│       ├── src/components/
│       ├── src/pages/
│       ├── cypress/                   ← E2E tests (qa-automation-agent helps)
│       └── package.json
│
├── 📁 shared/                         ← Common code (all agents can READ, not modify)
│   ├── src/main/java/com/company/shared/
│   │   ├── dto/                       ← Shared DTOs
│   │   ├── exception/                 ← Common exceptions
│   │   ├── repository/                ← Base JPA repositories
│   │   └── util/                      ← Utilities
│   └── pom.xml
│
├── 📁 helm/                           ← Kubernetes/OpenShift configs
│   ├── payment-service/
│   │   ├── Chart.yaml                 ← Metadata
│   │   ├── values.yaml                ← Configuration (devsecops-agent updates)
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       └── ...
│   ├── user-service/
│   ├── order-service/
│   └── ...
│
├── 📁 docs/
│   ├── DEVELOPMENT.md                 ← How to get started
│   ├── API.md                         ← API documentation
│   ├── DEPLOYMENT.md                  ← Deployment guide
│   └── TROUBLESHOOTING.md             ← Common issues
│
├── README.md                          ← Project overview
├── .gitignore
├── LICENSE
└── (other project files)
```

---

## How Agents Use This Structure

### PaymentServiceAgent Workflow

```
1. Developer selects: PaymentServiceAgent in VS Code
   ↓
2. Agent loads from disk:
   ├─ CLAUDE.md (shared standards)
   ├─ PATTERNS.md (code examples)
   ├─ ARCHITECTURE.md (system overview)
   ├─ TESTING.md (test strategies)
   ├─ DEVOPS.md (deployment process)
   ├─ .agents/payment-service-agent/AGENT.md (identity)
   └─ .agents/payment-service-agent/SKILL.md (expertise)
   ↓
3. Agent reads Jira task via MCP
   ↓
4. Agent scans /services/payment-service/ via MCP (reads actual code)
   ↓
5. Agent implements:
   ✓ Uses PaymentServiceAgent SKILL.md patterns
   ✓ Follows PATTERNS.md conventions
   ✓ Respects CLAUDE.md security rules
   ✓ Writes tests per TESTING.md strategy
   ✓ Updates helm/payment-service/ if needed per DEVOPS.md
   ✓ NEVER modifies other services
   ↓
6. Code runs SonarQube gate (auto)
   ↓
7. PR is reviewed (1-2 cycles instead of 3-5)
```

### QAAutomationAgent Workflow

```
1. Developer selects: QAAutomationAgent
   ↓
2. Agent loads:
   ├─ CLAUDE.md (shared standards)
   ├─ TESTING.md (test strategies & frameworks)
   ├─ .agents/qa-automation-agent/AGENT.md (can modify: test files + CI/CD)
   └─ .agents/qa-automation-agent/SKILL.md (JUnit, Cypress, coverage)
   ↓
3. Agent reads Jira task: "Add integration tests for payment API"
   ↓
4. Agent:
   ✓ Reads TESTING.md for strategy
   ✓ Reads PaymentServiceAgent/SKILL.md to understand payment service
   ✓ Creates integration test in src/test/java/...
   ✓ Adds Cypress test in cypress/e2e/...
   ✓ Ensures 80%+ coverage per TESTING.md
   ✓ Follows JUnit & Cypress patterns from TESTING.md
   ↓
5. Tests are added to CI/CD pipeline
   ↓
6. Code coverage gate checks (auto)
```

### DevSecOpsAgent Workflow

```
1. Developer selects: DevSecOpsAgent
   ↓
2. Agent loads:
   ├─ CLAUDE.md (security rules)
   ├─ DEVOPS.md (Helm, Docker, OpenShift)
   ├─ .agents/devsecops-agent/AGENT.md (can modify: Helm, Dockerfiles)
   └─ .agents/devsecops-agent/SKILL.md (Hadolint, SonarQube, secrets)
   ↓
3. Agent reads task: "Validate Helm charts, scan for secrets"
   ↓
4. Agent:
   ✓ Runs Hadolint on all Dockerfiles
   ✓ Validates Helm syntax: helm template, helm lint
   ✓ Scans for hardcoded secrets (git-secrets, TruffleHog)
   ✓ Checks SonarQube blockers
   ✓ Verifies K8s secrets configuration per DEVOPS.md
   ↓
5. Reports issues and fixes (if needed)
   ↓
6. Helm charts ready for deployment
```

---

## File Access Patterns

```
SHARED FILES (All agents READ-ONLY):
├── CLAUDE.md ..................... Read by: ALL agents
├── PATTERNS.md ................... Read by: ALL agents
├── ARCHITECTURE.md ............... Read by: ALL agents
├── TESTING.md .................... Read by: ALL + QA agent
├── DEVOPS.md ..................... Read by: ALL + DevSecOps agent
└── /shared/ code ................. Read by: ALL (not modify)

COMPONENT-SPECIFIC SKILLS (Agent-Only):
├── payment-service-agent/SKILL.md .. Read by: PaymentServiceAgent only
├── user-service-agent/SKILL.md ..... Read by: UserServiceAgent only
├── qa-automation-agent/SKILL.md .... Read by: QAAutomationAgent only
└── devsecops-agent/SKILL.md ........ Read by: DevSecOpsAgent only

CODE MODIFICATIONS (Permission-Based):
├── /services/payment-service/ ..... Modify by: PaymentServiceAgent only
├── /services/user-service/ ........ Modify by: UserServiceAgent only
├── /services/order-service/ ....... Modify by: OrderServiceAgent only
├── /helm/* ........................ Modify by: DevSecOpsAgent + component agents
├── Dockerfiles .................... Modify by: DevSecOpsAgent only
├── /src/test/java ................ Modify by: QAAutomationAgent + component agents
└── /cypress/e2e .................. Modify by: QAAutomationAgent only
```

---

## Configuration Files Explained

### 1. .agents/AGENTS.md (Registry)
```markdown
# Agent Registry

All available agents in this project:

| Agent | Role | Scope | Can Modify |
|-------|------|-------|------------|
| PaymentServiceAgent | Payment Specialist | payment-service | /services/payment-service/ |
| UserServiceAgent | User Specialist | user-service | /services/user-service/ |
| QAAutomationAgent | QA Specialist | all services | test files, CI/CD |
| DevSecOpsAgent | DevOps Specialist | security & deploy | Helm, Dockerfiles |
```

### 2. .vscode/agents.json
```json
{
  "agents": [
    {
      "name": "PaymentServiceAgent",
      "description": "Payment service specialist",
      "path": ".agents/payment-service-agent/",
      "icon": "💳"
    },
    {
      "name": "QAAutomationAgent",
      "description": "QA and testing specialist",
      "path": ".agents/qa-automation-agent/",
      "icon": "✅"
    },
    {
      "name": "DevSecOpsAgent",
      "description": "Security and deployment specialist",
      "path": ".agents/devsecops-agent/",
      "icon": "🔒"
    }
  ]
}
```

### 3. .mcp/config.json
```json
{
  "servers": {
    "gitlab": {
      "command": "npx",
      "args": ["@antml/gitlab-mcp-server"],
      "env": {
        "GITLAB_URL": "https://your-gitlab.com",
        "GITLAB_TOKEN": "${GITLAB_TOKEN}"
      }
    },
    "jira": {
      "command": "npx",
      "args": ["@antml/jira-mcp-server"],
      "env": {
        "JIRA_URL": "https://your-jira.com",
        "JIRA_TOKEN": "${JIRA_TOKEN}"
      }
    }
  }
}
```

---

## Key Design Principles

```
1. SHARED KNOWLEDGE BASES
   ✓ All agents read: CLAUDE.md, PATTERNS.md, ARCHITECTURE.md, TESTING.md, DEVOPS.md
   ✓ Single source of truth for standards
   ✓ Easy to update (one change, all agents benefit)

2. SPECIALIZED AGENTS
   ✓ Each agent has narrow scope (one service or function)
   ✓ Each agent has deep expertise (SKILL.md)
   ✓ Clear constraints (can modify ONLY these files)
   ✓ Prevents cross-service confusion

3. MODULAR ARCHITECTURE
   ✓ /services/ isolated from each other
   ✓ /shared/ read-only common code
   ✓ /helm/ deployment separate
   ✓ Easy to add new agents for new services

4. KNOWLEDGE SEPARATION
   ✓ AGENT.md = Identity & Constraints (what I am, what I can do)
   ✓ SKILL.md = Domain Expertise (how I work in my domain)
   ✓ Shared docs = Company Standards (how we all work together)

5. SCALABILITY
   ✓ Add new service? Create new agent (copy template)
   ✓ Add new team? Add new specialized agent (QA, DevOps, etc.)
   ✓ Refine knowledge? Update SKILL.md, no code changes
```

---

## Setup Checklist

```
PHASE 1: SHARED KNOWLEDGE (Days 1-2)
─────────────────────────────────────
[ ] Create CLAUDE.md
[ ] Create PATTERNS.md
[ ] Create ARCHITECTURE.md
[ ] Create TESTING.md
[ ] Create DEVOPS.md

PHASE 2: AGENT INFRASTRUCTURE (Day 3)
──────────────────────────────────────
[ ] Create .agents/ directory
[ ] Create .agents/AGENTS.md (registry)
[ ] Create .mcp/config.json

PHASE 3: COMPONENT AGENTS (Days 4-5)
─────────────────────────────────────
[ ] Create payment-service-agent/ (AGENT.md + SKILL.md)
[ ] Create user-service-agent/
[ ] Create order-service-agent/

PHASE 4: SPECIALIST AGENTS (Day 5)
──────────────────────────────────
[ ] Create qa-automation-agent/
[ ] Create devsecops-agent/

PHASE 5: VS CODE INTEGRATION (Day 5)
────────────────────────────────────
[ ] Create .vscode/agents.json (or .instructions.md)
[ ] Test agent selector in VS Code

PHASE 6: TEAM ENABLEMENT (Week 2)
─────────────────────────────────
[ ] Team training on agents
[ ] Test each agent with pilot task
[ ] Refine SKILL.md based on feedback
```

