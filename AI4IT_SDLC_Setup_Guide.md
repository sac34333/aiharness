# AI4IT/SDLC: AI-Powered Development Environment Setup Guide

**Project Context:** 25+ microservices | Java/Spring Boot | ReactJS | Kubernetes | GitLab | Jira | Confluence | Openshift | CI/CD

---

## Part 1: Understanding the Architecture for Your Project

The diagram you've seen shows a **layered ecosystem**. Here's what it means for your team with **specialized agents**:

```
Your Team's Reality:
├── AI Powered Developers (YOU)
│   ├── Use Claude Code in VS Code
│   └── Pick an agent from selector:
│       ├── PaymentServiceAgent
│       ├── UserServiceAgent
│       ├── OrderServiceAgent
│       ├── QAAutomationAgent
│       └── DevSecOpsAgent
│
├── Specialized Agents Layer
│   ├── Each has: AGENT.md (identity) + SKILL.md (expertise)
│   ├── Access: Shared CLAUDE.md + own domain knowledge
│   └── Scope: Limited to own services/responsibilities
│
├── Shared Knowledge Bases (All Agents Read)
│   ├── CLAUDE.md (standards, security, quality gates)
│   ├── PATTERNS.md (code examples across all services)
│   ├── ARCHITECTURE.md (service map, integrations)
│   ├── TESTING.md (test strategies, frameworks)
│   └── DEVOPS.md (deployment, Helm, OpenShift)
│
├── LLM Gateway Layer (Managed)
│   └── Routes requests through MCP servers
│
└── External Systems (ALREADY HAVE)
    ├── GitLab (code + MCP server)
    ├── Jira (tasks + MCP server)
    ├── SonarQube (quality feedback + MCP)
    ├── Hadolint (Docker security)
    └── OpenShift (deployment target)
```

---

## Part 2: What Your Developers Actually Need to Change

### Current Way of Working (❌ Vague In, Vague Out)
```
1. Read Jira ticket: "Add CSV export for service X"
2. Paste into Claude → "Implement this"
3. Claude guesses: wrong files, nonexistent APIs, wrong modules
4. Result: Code that compiles but solves the wrong problem
```

### New Way of Working (✓ Structure In, Structure Out)

**Phase 1: Planning with Real Code**
```
1. Developer opens repository
2. Claude analyzes ACTUAL code: traces symbols, finds patterns
3. Creates Repository Impact Map (what changes where)
4. Human reviews map → APPROVES before coding starts
   ✓ Catches wrong modules early
   ✓ Ensures we're not inventing APIs
```

**Phase 2: Implementation with Structured Tasks**
```
1. Jira task follows TEMPLATE with:
   - Repository (single scope)
   - Files to Modify (real paths, not guesses)
   - Implementation Notes (reference actual function names)
   - Acceptance Criteria (concrete checklist)
   - Test Requirements (coverage guidance)

2. Claude implements against this spec
3. Result: Targeted, high-quality code changes
```

### Concrete Example for Your Project

**Old Way:**
```
Jira: "Update payment service to support async processing"
Claude tries to guess:
  - Which module? (guesses wrong)
  - What's the existing pattern? (invents pattern)
  - Where are tests? (generates in wrong location)
```

**New Way:**
```
STEP 1: Planning Phase
Developer: "Claude, analyze how PaymentService currently works"
Claude: Scans /services/payment-service/src/main/java/*
        Traces references to other services
        Identifies test patterns

Output: Repository Impact Map
---------
payment-service:
  changes:
    - Add async processing to PaymentProcessorImpl (com.company.payment.service)
    - Add AsyncPaymentRequest DTO (com.company.payment.dto)
    - Add integration test in payment-service/src/test/java
    - Update Helm chart values.yaml for message queue config

ui-services:
  changes:
    - Add "Processing..." status to payment component

STEP 2: Human Review
Developer reviews: "Yes, this matches our structure. PaymentProcessorImpl 
is correct. We DO have async pattern in UserService already (good catch)."
OR "No, we'd never modify the UI for this."

STEP 3: Implementation Phase
Jira Task Template:
---------
## Repository
payment-service

## Description
Add async processing to PaymentProcessorImpl to handle high-load scenarios.

## Files to Modify
- `src/main/java/com/company/payment/service/PaymentProcessorImpl.java`
  → Add async method processPaymentAsync()
- `src/main/java/com/company/payment/dto/AsyncPaymentRequest.java`
  → New DTO for async requests
- `src/test/java/com/company/payment/service/PaymentProcessorImplTest.java`
  → Add async processing tests

## Implementation Notes
- Follow pattern in UserService.processUserAsync() (same message queue)
- Use existing RabbitMQ configuration from application.yml
- Maintain same response format as synchronous version

## Acceptance Criteria
- [ ] PaymentProcessorImpl.processPaymentAsync() returns CompletableFuture
- [ ] Messages published to payment-async queue
- [ ] Existing synchronous path still works
- [ ] No SonarQube blocker issues

## Test Requirements
- [ ] Unit test: async method publishes correct message
- [ ] Integration test: async message processed correctly
- [ ] Contract test: response format unchanged
```

---

## Part 3: Concrete Developer Setup

### What EACH Developer Needs

#### 1. **Local Environment**
```
✓ VS Code with Copilot/Claude Code extension (already have)
✓ MCP for local development:
  - Git integration (built-in)
  - Local file system access (built-in)
  
✓ Git & Java/Node SDKs
  - Maven or Gradle
  - npm/yarn for React services
```

#### 2. **Configuration Files (At Project Root)**

Create `/CLAUDE.md` — The "instruction manual" for Claude in your project:
```markdown
# Development Conventions

## Code Structure
- Services in `/services/{service-name}/`
- Common code in `/shared/`
- Helm charts in `/helm/{service-name}/`
- Tests follow Maven convention: `src/test/java/...`

## Patterns to Follow
- REST: see `/services/api-gateway/src/main/java/com/company/api/`
- Async: see `/services/user-service/src/main/java/com/company/user/` (UserService pattern)
- Database: Spring JPA, no custom SQL

## Security Standards
- No credentials in code (use K8s secrets via Helm)
- SonarQube must have 0 blockers
- Hadolint: all Dockerfiles must pass

## Testing Requirements
- Unit tests required (>80% coverage)
- Integration tests for service boundaries
- Contract tests for API changes
```

Create `/.mcp/config.json` — MCP server connections:
```json
{
  "servers": {
    "gitlab": {
      "command": "node",
      "args": ["mcp-gitlab-server.js"],
      "env": {
        "GITLAB_URL": "your-gitlab-instance",
        "GITLAB_TOKEN": "${GITLAB_TOKEN}"
      }
    },
    "jira": {
      "command": "node",
      "args": ["mcp-jira-server.js"],
      "env": {
        "JIRA_URL": "your-jira-instance",
        "JIRA_TOKEN": "${JIRA_TOKEN}"
      }
    }
  }
}
```

#### 3. **Daily Workflow**

```
1. START OF TASK
   Developer: "Claude, let's plan this Jira task: PROJ-1234"
   
   Claude:
   - Reads Jira ticket
   - Scans relevant services via MCP/Git
   - Creates impact map
   
   Developer: Reviews impact map (1-2 min)
   → "Approved" or "No, fix this assumption"

2. IMPLEMENTATION
   Claude: Implements against structured task template
   (Claude already HAS this from Jira)
   
   Creates:
   - Code changes
   - Tests
   - Updated Helm configs (if needed)
   
   Developer: Reviews PR
   → "Looks good" → Merge or "Fix these issues"

3. VERIFICATION
   - SonarQube gates check (automatic)
   - Hadolint gates check (automatic)
   - CI/CD pipeline tests (automatic)
```

---

## Part 4: Team-Level Changes

### What Needs to Change in Your Team's Process

#### **Change 1: Introduce Specialized Agents**

Each agent is a specialization:

```
Developer selects: "PaymentServiceAgent" (dropdown in VS Code)
                   ↓
Agent loads:
├─ CLAUDE.md (shared standards everyone follows)
├─ PaymentServiceAgent/AGENT.md (its role: "I handle payment service")
└─ PaymentServiceAgent/SKILL.md (its expertise: payment patterns, async, APIs)

Result: Agent knows:
  ✓ Your code standards (CLAUDE.md)
  ✓ Your architecture (ARCHITECTURE.md)
  ✓ Your testing strategy (TESTING.md)
  ✓ Your payment patterns (SKILL.md)
  ✓ Your deployment process (DEVOPS.md)
  → Can only modify /services/payment-service/
```

**Agent Roles for Your Team:**
- **PaymentServiceAgent** — Payment processing, async, APIs
- **UserServiceAgent** — User management, auth, profiles
- **OrderServiceAgent** — Order management, workflows
- **InventoryServiceAgent** — Inventory, stock management
- ... (similar for other 2 services)
- **QAAutomationAgent** — Test automation, CI/CD testing, coverage
- **DevSecOpsAgent** — Security scanning, deployment, Helm, secrets

#### **Change 2: Build Shared Knowledge Bases**

These are read by ALL agents:

```
SHARED (All Agents Reference These):
├─ CLAUDE.md
│  └─ Code standards, security, quality gates
├─ PATTERNS.md
│  └─ REST endpoints, async processing, database queries, testing
├─ ARCHITECTURE.md
│  └─ Service map, integrations, technology decisions
├─ TESTING.md
│  └─ Unit test patterns, integration test patterns, coverage requirements
└─ DEVOPS.md
   └─ Helm chart structure, secrets management, OpenShift deployment

AGENT-SPECIFIC (Only Each Agent Reads):
├─ .agents/payment-service-agent/SKILL.md
│  └─ Payment-specific patterns, gateway APIs, transaction handling
├─ .agents/qa-automation-agent/SKILL.md
│  └─ Jest/JUnit frameworks, Cypress tests, CI/CD pipeline
└─ .agents/devsecops-agent/SKILL.md
   └─ Hadolint rules, SonarQube gates, secret scanning, Helm validation
```

#### **Change 3: Jira Ticket Templates (Same as Before)**

Now agents filling templates read from their knowledge bases
Replace current free-form tickets with STRUCTURED templates:

```
🔴 OLD (DON'T USE)
Title: "Add CSV export"
Description: "We need to export data as CSV for reporting"
Acceptance Criteria: "It works"

✅ NEW (USE THIS)
Title: "Add CSV export to Payment Service"

## Repository
payment-service

## Description
Implement CSV export endpoint for payment reports to support monthly reconciliation process.

## Affected Services
- payment-service (primary)
- api-gateway (exposes endpoint)

## Files to Modify
- src/main/java/com/company/payment/controller/ExportController.java
- src/main/java/com/company/payment/service/CsvExportService.java (new)
- src/test/java/com/company/payment/service/CsvExportServiceTest.java

## Implementation Notes
- Follow existing JSON export pattern in ReportService.exportJson()
- Use common CSV library already in dependency management
- Reuse PaymentQuery entity (already has all fields needed)

## Acceptance Criteria
- [ ] GET /api/v1/payments/export?format=csv returns valid CSV
- [ ] Existing JSON endpoint unchanged
- [ ] Column headers match API documentation
- [ ] Large datasets (>100k rows) handle correctly

## Test Requirements
- [ ] Unit test CSV generation with sample data
- [ ] Integration test endpoint returns correct format
- [ ] Performance test: 100k rows exports in <5 seconds
- [ ] Contract test: API response structure

## Dependencies
- Depends on: PROJ-999 (New PaymentQuery entity)

## Notes for Implementation
- SonarQube: Must have 0 blocker issues
- Hadolint: If Dockerfile changes needed
- Schema: No DB schema changes needed (uses existing PaymentQuery)
```

#### **Change 2: Code Review Focus Shifts**

**Old Review Questions:**
- Does the code work?
- Is it clean?

**New Review Questions:**
- Does it match the structured task spec?
- Did Claude follow the existing patterns correctly?
- Are tests complete?
- Is there anything the planning phase missed?

#### **Change 3: Planning Phase Becomes Formal**

Currently: Features → Jira → Code

New: Vague Idea → Analysis → **Impact Map Approval** → Structured Task → Code

This one extra step (impact map review) prevents 70% of "code compiles but solves wrong problem" issues.

#### **Change 4: Repository Becomes the Source of Truth**

Not Confluence. Not Slack discussions.

**In the repository, document:**
- Architectural decisions (`/docs/ARCHITECTURE.md`)
- Code patterns and examples (`/PATTERNS.md`)
- Setup instructions (`/SETUP.md`)
- Why decisions were made

Claude will read this automatically when analyzing code.

---

## Part 5: Infrastructure Setup Checklist

### ✓ You Already Have
- [x] VS Code + Claude Code
- [x] GitLab (with SSH/token access)
- [x] Jira (with API token)
- [x] SonarQube
- [x] Hadolint
- [x] CI/CD pipeline
- [x] Kubernetes/OpenShift

### ⚠️ You Need to Add/Configure

#### **Phase 1: Foundation (Week 1)**
```
[ ] Create SHARED KNOWLEDGE BASES (all agents read):
    [ ] CLAUDE.md (standards, security, quality gates)
    [ ] PATTERNS.md (code examples: REST, async, DB, testing)
    [ ] ARCHITECTURE.md (service map, integrations)
    [ ] TESTING.md (test patterns, coverage requirements)
    [ ] DEVOPS.md (Helm, secrets, OpenShift, deployment)
    
[ ] Create AGENT FRAMEWORK:
    [ ] .agents/ directory
    [ ] .agents/AGENTS.md (registry of all agents)
    [ ] .agents/.instructions.md (agent selector config)
    
[ ] Set up MCP config:
    [ ] .mcp/config.json
    └─ GitLab, Jira, SonarQube integration
```

#### **Phase 2: Agent Creation (Week 2)**
```
[ ] Create COMPONENT AGENTS (for each service):
    [ ] payment-service-agent/
        ├─ AGENT.md (identity: Payment Service Specialist)
        └─ SKILL.md (async patterns, gateway APIs, payment flows)
    [ ] user-service-agent/
    [ ] order-service-agent/
    [ ] ... (similar for other services)

[ ] Create SPECIALIST AGENTS:
    [ ] qa-automation-agent/
        ├─ AGENT.md (identity: QA Automation Specialist)
        └─ SKILL.md (Jest, JUnit, Cypress, CI/CD testing)
    
    [ ] devsecops-agent/
        ├─ AGENT.md (identity: Security & DevOps Specialist)
        └─ SKILL.md (Hadolint, SonarQube, Helm, secrets, OpenShift)

[ ] Wire up VS Code agent selector
    └─ .vscode/agents.json or .instructions.md
```

#### **Phase 3: Team Enablement (Week 3)**
```
[ ] Team training:
    [ ] How to select an agent in VS Code
    [ ] What each agent knows (read their SKILL.md)
    [ ] When to use which agent
    
[ ] Test each agent with pilot tasks
    [ ] PaymentServiceAgent: implement payment feature
    [ ] QAAutomationAgent: write integration tests
    [ ] DevSecOpsAgent: validate Helm chart, check secrets
```

---

## Part 6: SKILLS & Knowledge Bases for Agents

Each agent needs access to domain knowledge. Here's what to create:

### Shared Knowledge Bases (ALL Agents Read)

#### **1. PATTERNS.md** (Code Examples)
```markdown
# Code Patterns (Shared)

## REST Endpoint Pattern
[Real example from api-gateway PaymentController]

## Async Processing Pattern
[Real example from user-service UserService]

## Database Query Pattern
[Real example from shared repository]

## Testing Pattern
[Real example from test suite]

## Error Handling Pattern
[Real example showing exception handling]
```

#### **2. ARCHITECTURE.md** (System Overview)
```markdown
# Architecture

## Service Map
- payment-service: Payment processing, async workflows
- user-service: User management, authentication
- order-service: Order management, workflows
- ... (all 25 services)

## Key Integrations
- payment-service → user-service (get user details)
- order-service → inventory-service (check stock)
- ...

## Technology Stack
- Backend: Java 11+, Spring Boot
- Frontend: ReactJS
- Database: PostgreSQL
- Messaging: RabbitMQ
- Orchestration: Kubernetes/OpenShift
- Infrastructure: Helm charts
```

#### **3. TESTING.md** (Test Strategy)
```markdown
# Testing Guidelines

## Unit Tests
- Use JUnit 5
- Target: 80%+ coverage
- Mock external dependencies
- File location: src/test/java/

## Integration Tests
- Use @SpringBootTest
- Test service boundaries
- Use test containers for DB
- File location: src/test/java/

## Test Naming
- testWhatItDoes()
- Example: testPaymentProcessing()

## CI/CD Testing
- All tests must pass before merge
- SonarQube gates enforced
```

#### **4. DEVOPS.md** (Deployment & Infrastructure)
```markdown
# DevOps & Deployment

## Helm Chart Structure
```
helm/payment-service/
├── Chart.yaml
├── values.yaml (config per environment)
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ...
```

## Secrets Management
- NO credentials in code
- Use K8s secrets (injected as env vars)
- Reference in values.yaml: valueFrom.secretKeyRef

## OpenShift Deployment
- Use Helm to deploy
- Validate charts: helm template
- Monitor: oc logs, oc describe

## CI/CD Pipeline
- Build → Test → SonarQube → Hadolint → Deploy

## Docker Best Practices
- Specific base image versions (not 'latest')
- Multi-stage builds where applicable
- Run Hadolint checks
```

#### **5. CLAUDE.md** (Standards & Security)
```markdown
# Code Standards (Shared)

## Naming Conventions
- Classes: PascalCase
- Methods: camelCase
- Constants: UPPER_SNAKE_CASE

## Security Rules
- No hardcoded credentials
- Use K8s secrets
- Validate external input
- Encrypt sensitive data

## Quality Gates
- SonarQube: 0 blockers
- Test coverage: 80%+
- Hadolint: Docker validation
```

---

### Agent-Specific Skills (Per-Agent SKILL.md Files)

Each agent has its own SKILL.md with deep domain knowledge:

#### **PaymentServiceAgent/SKILL.md**
```markdown
# Payment Service Skill

## Service Overview
Handles payment processing, async workflows, external gateway integration.

## Key Components
- PaymentProcessorImpl (core processor)
- AsyncPaymentService (async workflows)
- PaymentGatewayAdapter (external APIs)
- PaymentRepository (DB access)

## Code Patterns (Specific to This Service)
- Async processing: See AsyncPaymentService.processPaymentAsync()
- Gateway integration: See PaymentGatewayAdapter pattern
- Error handling: See PaymentException, handler recovery flow

## Common Tasks & Where They Go
- Add payment method → Edit PaymentGatewayAdapter
- Handle async failure → Edit AsyncPaymentService.handleFailure()
- New REST endpoint → Follow PaymentController pattern

## Files You'll Modify
- Controllers: src/main/java/com/company/payment/controller/
- Services: src/main/java/com/company/payment/service/
- DTOs: src/main/java/com/company/payment/dto/
- Tests: src/test/java/com/company/payment/

## Dependencies
- RabbitMQ configured in application.yml
- External gateway SDK already in pom.xml
- Uses shared PaymentQuery entity

## Security Checklist (Payment-Specific)
- No PII in logs
- Encrypt transaction amounts in DB
- Validate all gateway API responses
- Use K8s secrets for gateway API keys

## Testing Checklist (Payment-Specific)
- Unit test async payment processing
- Integration test gateway API calls (mock)
- Contract test: response format unchanged
- Performance: large transactions (<5s)
```

#### **UserServiceAgent/SKILL.md**
```markdown
# User Service Skill

## Service Overview
Manages users, authentication, profiles, permissions.

## Key Components
- UserServiceImpl (core logic)
- AuthenticationService (auth workflows)
- PermissionService (authorization)
- UserRepository (DB access)

## Code Patterns
- Authentication: See AuthenticationService pattern
- Authorization: Use @PreAuthorize("hasRole('ADMIN')")
- Error handling: See UserNotFoundException

## Common Tasks
- Add new user field → Update UserEntity, UserDTO, tests
- New permission → Update PermissionService, role tests
- Auth workflow → Edit AuthenticationService

## Security Checklist
- Password: bcrypt encryption
- JWT tokens: signed, expiration set
- No credentials in logs

## Files You'll Modify
- src/main/java/com/company/user/...
- src/test/java/com/company/user/...
```

#### **QAAutomationAgent/SKILL.md**
```markdown
# QA Automation Skill

## Frameworks
- Unit: JUnit 5
- Integration: @SpringBootTest
- UI: Cypress or Selenium
- Load: JMeter (if needed)

## Test Patterns
[Examples for each framework]

## CI/CD Integration
- Tests run on: push, pull request, scheduled
- Results: SonarQube, code coverage reports
- Failures: block merge until fixed

## Common Tasks
- Add unit test for service
- Add integration test for endpoint
- Add Cypress test for UI flow
- Set up performance baseline

## Test Coverage Requirements
- New code: 80%+ coverage
- Critical paths: 100% coverage
- Existing code: maintain or improve

## Files You'll Create/Modify
- src/test/java/ (unit tests)
- src/test/java/ (integration tests)
- cypress/e2e/ (UI tests)
- performance-tests/ (load tests)
```

#### **DevSecOpsAgent/SKILL.md**
```markdown
# DevSecOps Skill

## Hadolint (Docker)
- Check: every Dockerfile
- Rules: best practices, security
- Config: .hadolintrc

## SonarQube
- Blockers: must fix before merge
- Coverage: new code >80%
- Duplicates: identify and refactor
- API: /sonarqube for queries

## Secrets Management
- Scan: prevent credentials in code
- Tools: git-secrets, TruffleHog
- K8s secrets: inject at runtime
- Vault: for sensitive data

## Helm Charts
- Validate: helm template, helm lint
- Best practices: resource limits, health checks
- Security: RBAC, network policies

## OpenShift Deployment
- Deploy: helm upgrade --install
- Monitor: oc logs, metrics
- Troubleshoot: describe pods, events

## Common Tasks
- Validate Helm chart for new service
- Scan codebase for secrets
- Check SonarQube blockers
- Deploy new version to OpenShift

## Files You'll Create/Modify
- helm/{service}/values.yaml
- .github/workflows/ (CI/CD)
- Dockerfile
- helm/{service}/templates/
```

---

### Directory Structure for Skills

```
.agents/
├── AGENTS.md (registry)
├── payment-service-agent/
│   ├── AGENT.md (identity)
│   └── SKILL.md (payment patterns, async, APIs)
├── user-service-agent/
│   ├── AGENT.md
│   └── SKILL.md (auth, users, permissions)
├── order-service-agent/
│   ├── AGENT.md
│   └── SKILL.md (orders, workflows, integrations)
├── qa-automation-agent/
│   ├── AGENT.md
│   └── SKILL.md (JUnit, Cypress, coverage)
└── devsecops-agent/
    ├── AGENT.md
    └── SKILL.md (Hadolint, SonarQube, Helm, secrets)

+ SHARED (Root level):
├── CLAUDE.md (standards, security, quality)
├── PATTERNS.md (REST, async, DB, testing examples)
├── ARCHITECTURE.md (service map, integrations)
├── TESTING.md (test strategies, patterns)
└── DEVOPS.md (Helm, secrets, OpenShift, CI/CD)
```

---

### How Agents Use Knowledge Bases

```
Developer selects: PaymentServiceAgent
                   ↓
Agent loads:
├─ CLAUDE.md (shared standards)
├─ PATTERNS.md (code examples)
├─ ARCHITECTURE.md (system overview)
├─ TESTING.md (test strategies)
├─ DEVOPS.md (deployment process)
├─ PaymentServiceAgent/AGENT.md (its role)
└─ PaymentServiceAgent/SKILL.md (payment expertise)

Result:
✓ Agent knows your standards (CLAUDE.md)
✓ Agent knows code patterns (PATTERNS.md)
✓ Agent knows system architecture (ARCHITECTURE.md)
✓ Agent knows testing requirements (TESTING.md)
✓ Agent knows deployment (DEVOPS.md)
✓ Agent knows payment domain (SKILL.md)
→ Implements payment feature correctly on first try
```

---

## Part 7: Implementation Roadmap for Your Team

### Week 1: Foundation (Shared Knowledge Bases)
```
Monday:
- Create CLAUDE.md (standards, security, quality)
- Create ARCHITECTURE.md (service map)

Tuesday-Wednesday:
- Create PATTERNS.md (REST, async, DB, testing examples)
- Create TESTING.md (test strategies, coverage)
- Create DEVOPS.md (Helm, secrets, OpenShift)

Thursday:
- Create .agents/ directory
- Create .agents/AGENTS.md (registry of all agents)
- Set up .mcp/config.json for MCP integration

Friday:
- Team review: do shared docs look complete?
- Retrospective: what's missing?
```

### Week 2: Component Agents (6 Agents)
```
Monday-Tuesday:
- Create payment-service-agent/
  ├─ AGENT.md (identity: Payment Service Specialist)
  └─ SKILL.md (async patterns, gateway APIs)

- Create user-service-agent/
  ├─ AGENT.md (identity: User Service Specialist)
  └─ SKILL.md (auth, permissions, user management)

Wednesday:
- Create order-service-agent/
  ├─ AGENT.md
  └─ SKILL.md (order workflows, integrations)

- Create remaining 3 component agents (inventory, notification, auth)

Thursday:
- Create qa-automation-agent/
  ├─ AGENT.md (identity: QA Automation Specialist)
  └─ SKILL.md (JUnit, Cypress, coverage requirements)

Friday:
- Create devsecops-agent/
  ├─ AGENT.md (identity: Security & DevOps Specialist)
  └─ SKILL.md (Hadolint, SonarQube, Helm, secrets, OpenShift)

- Set up .vscode/agents.json or .instructions.md for agent selector
```

### Week 3: Team Enablement & Testing
```
Monday:
- Team training (1-2 hours)
  ├─ What is an agent?
  ├─ How to select an agent in VS Code
  ├─ What each agent knows
  ├─ When to use which agent
  └─ Walk through example

Tuesday-Wednesday:
- Test PaymentServiceAgent:
  ├─ Create Jira task: "Add new payment method"
  ├─ Agent reads task + payment-service-agent/SKILL.md
  ├─ Agent implements feature
  ├─ Review: code quality, patterns matched?

- Test QAAutomationAgent:
  ├─ Create Jira task: "Add integration tests for payment API"
  ├─ Agent reads task + qa-automation-agent/SKILL.md
  ├─ Agent writes tests
  ├─ Verify: coverage >80%, tests pass

Thursday:
- Test DevSecOpsAgent:
  ├─ Create Jira task: "Validate Helm charts, check for secrets"
  ├─ Agent reads task + devsecops-agent/SKILL.md
  ├─ Agent validates, scans, reports
  ├─ Verify: no blocker issues

Friday:
- Retrospective:
  ├─ Which agents worked best?
  ├─ What knowledge was missing?
  ├─ Refine SKILLS based on feedback
```

### Week 4+: Full Adoption
```
- All NEW tasks assign to appropriate agent
- Agents use their SKILL.md + shared knowledge bases
- Monitor: SonarQube metrics, PR cycles, velocity
- Refine: update SKILLS based on lessons learned
- Expand: add more specialized agents if needed
```

---

## Part 8: Measuring Success

### Metrics to Track

```
BEFORE (Vague In, Vague Out)
- PR comments: "This doesn't match our pattern" → high
- SonarQube blockers on new code → high
- Code review cycles → 3-5 rounds
- "Why was it implemented this way?" questions → frequent

AFTER (Structure In, Structure Out)
- PR comments on architectural issues → significantly reduced
- SonarQube blockers → reduced to near-zero
- Code review cycles → 1-2 rounds
- Implementation matches spec → 90%+ consistently
- Development velocity → 20-30% improvement (conservative)
```

---

## Part 9: Common Pitfalls to Avoid

### ❌ Pitfall 1: Skipping the Impact Map Review
**Problem:** "Impact map is just extra work, let's code faster"
**Result:** Wrong modules, wrong patterns, refactor half the work

**Fix:** Make it a formal checkpoint. 10 minutes of review saves hours of rework.

### ❌ Pitfall 2: Not Updating CLAUDE.md
**Problem:** Code evolves, but CLAUDE.md doesn't
**Result:** Claude follows old patterns, code quality drifts

**Fix:** Treat CLAUDE.md like code. Update in PRs. Version it.

### ❌ Pitfall 3: Vague Acceptance Criteria
**Problem:** "It works" instead of concrete criteria
**Result:** Claude and developer have different definition of "done"

**Fix:** Make criteria checkable. "Returns HTTP 200" not "Works correctly"

### ❌ Pitfall 4: Not Using Real File Paths in Tasks
**Problem:** "Add async processing somewhere" instead of specific files
**Result:** Claude guesses at structure

**Fix:** During planning, get REAL paths from code analysis.

---

## Part 10: Next Steps for YOUR Team

### **Immediate (This Week)**

1. **Create project root documents:**
   - `CLAUDE.md` (your conventions)
   - `PATTERNS.md` (code examples)
   - `ARCHITECTURE.md` (service map)

2. **Set up MCP config:**
   - GitLab integration
   - Jira integration

3. **Update one Jira task** with new template as example

### **Short-term (Next 2 Weeks)**

4. **Team alignment session** (1 hour):
   - Show: Old workflow problem
   - Show: New workflow solution
   - Walk through example
   - Q&A

5. **Create 2-3 SKILLS** for core services

6. **Run pilot task** with new process
   - Full impact map → review → implementation
   - Collect feedback

### **Ongoing**

7. **Refine** based on team feedback
8. **Measure** improvements in code quality/velocity
9. **Scale** to all tasks

---

## Questions to Answer for YOUR Project

Before launching, answer these:

```
1. What are your TOP 3 code patterns developers should know?
   (e.g., async processing, REST endpoints, DB queries)

2. Where do new developers currently get confused?
   (Target these in CLAUDE.md)

3. What's your MOST COMMON code review feedback?
   (Add rules to prevent it)

4. Which 3 services are highest-traffic/highest-risk?
   (Create SKILLS for these first)

5. What's your SonarQube blocker rule?
   (Document it in CLAUDE.md)

6. Do you have architectural decisions NO ONE KNOWS?
   (Document them in ARCHITECTURE.md)
```

---

## Key Takeaway

The shift from **"paste requirement into AI"** to **"structured AI-powered workflow"** is the difference between:

- ❌ **Vague In → Vague Out**: Code that compiles but is wrong
- ✅ **Structure In → Reliable Out**: Code that matches your patterns

This isn't about making AI perfect. It's about **designing the environment** AI works in.

**Structure in the environment → Reliable output from AI.**

