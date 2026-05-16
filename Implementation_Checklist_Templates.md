# AI4IT/SDLC: Implementation Checklist & Templates

## CHECKLIST: Week 1 Setup

### Day 1: Shared Knowledge Bases (All Agents Read These)
- [ ] Create `/CLAUDE.md` (Code standards, security, quality gates)
  - [ ] Naming conventions
  - [ ] Security rules (no credentials, K8s secrets)
  - [ ] Quality gates (SonarQube 0 blockers, 80% coverage)
  - [ ] Technology stack overview

- [ ] Create `/ARCHITECTURE.md` (System overview)
  - [ ] Service inventory (25 microservices)
  - [ ] Key integrations between services
  - [ ] Technology decisions

- [ ] Create `/PATTERNS.md` (Code examples)
  - [ ] REST endpoint pattern
  - [ ] Async processing pattern
  - [ ] Database query pattern
  - [ ] Testing pattern

### Day 2: More Knowledge Bases
- [ ] Create `/TESTING.md` (Test strategies)
  - [ ] Unit test patterns (JUnit 5)
  - [ ] Integration test patterns (@SpringBootTest)
  - [ ] Coverage requirements
  - [ ] Test naming conventions

- [ ] Create `/DEVOPS.md` (Deployment & Infrastructure)
  - [ ] Helm chart structure
  - [ ] Secrets management
  - [ ] OpenShift deployment
  - [ ] Docker best practices (Hadolint)
  - [ ] CI/CD pipeline overview

### Day 3: Agent Infrastructure
- [ ] Create `/.agents/` directory structure
  - [ ] `AGENTS.md` (registry listing all agents)
  - [ ] `AGENTS.md` → `.instructions.md` or `.vscode/agents.json`

- [ ] Create MCP configuration
  - [ ] `/.mcp/config.json` with GitLab, Jira servers
  - [ ] Test connections

### Day 4-5: Agent Creation (Start with 2-3 Key Agents)
- [ ] Create component agents (start with 2):
  - [ ] `payment-service-agent/`
  - [ ] `qa-automation-agent/`

- [ ] Create specialist agent:
  - [ ] `devsecops-agent/`

- [ ] Set up agent selector in VS Code
  - [ ] `.vscode/agents.json` OR
  - [ ] `.instructions.md` with agent config
```markdown
# Claude Development Guide

## Our Project Structure
- `/services/{service-name}/` — Each microservice
- `/shared/` — Shared libraries
- `/helm/{service-name}/` — Kubernetes configs

## Languages & Frameworks
- **Backend**: Java 11+ with Spring Boot
- **Frontend**: ReactJS with Hooks
- **DevOps**: Helm charts, Kubernetes

## Critical Patterns (Learn These)
1. **REST Endpoints**: See `/services/api-gateway/src/main/java/com/company/api/controller/`
2. **Async Processing**: See `/services/user-service/src/main/java/com/company/user/service/UserService.java` method `processUserAsync()`
3. **Database Queries**: Spring JPA only, see `/shared/src/main/java/com/company/shared/repository/`
4. **Testing**: Maven structure, see any service's `src/test/` folder

## Code Standards
- Max line length: 120 characters
- Test coverage: 80%+ for new code
- SonarQube: ZERO blockers allowed
- Security: No hardcoded credentials (use Kubernetes secrets)

## Deployment
- Helm charts required for all services
- OpenShift target environment
- CI/CD gates: SonarQube + Hadolint
```

### Day 2-3: MCP Configuration & Documentation
- [ ] Create `/.mcp/config.json` with GitLab server config
- [ ] Test MCP connection to GitLab
- [ ] Create `/.mcp/config.json` with Jira server config  
- [ ] Test MCP connection to Jira
- [ ] Document in team wiki: "How to use MCP locally"

Example MCP config to use:
```json
{
  "servers": {
    "gitlab": {
      "command": "npx",
      "args": ["@antml/gitlab-mcp-server"],
      "env": {
        "GITLAB_URL": "https://your-gitlab-instance.com",
        "GITLAB_TOKEN": "${GITLAB_TOKEN}"
      }
    },
    "jira": {
      "command": "npx",
      "args": ["@antml/jira-mcp-server"],
      "env": {
        "JIRA_URL": "https://your-jira-instance.com",
        "JIRA_TOKEN": "${JIRA_TOKEN}"
      }
    }
  }
}
```

### Day 4: Process & Templates
- [ ] Create **Jira Task Template** (see below)
- [ ] Post in Confluence with instructions
- [ ] Update team that ALL new tasks use this template
- [ ] Create template in Jira issue templates (if supported)

- [ ] Create **Impact Map Template** (see below)
- [ ] Document how to review and approve impact maps

### Day 5: Team Prep & Pilot
- [ ] Schedule team training/walkthrough (1 hour max)
- [ ] Prepare ONE example task using new process
- [ ] Run pilot with 1 task
- [ ] Collect team feedback

---

## TEMPLATE 1: Jira Task Template (Use This for ALL New Tasks)

**Copy this and create as Jira template:**

```
## Task: [Service Name] - [What We're Building]

### Repository
[single service, e.g., "payment-service"]

### Description
[Clear one-paragraph description of what this task accomplishes and why]

### Files to Modify
- `path/to/file1.java` — what changes and why
- `path/to/file2.java` — what changes and why
- `NEW: path/to/newfile.java` — new file for what purpose

[For each file, be SPECIFIC. These are paths found in the actual code.]

### Implementation Notes
- Follow existing pattern in [REAL FUNCTION NAME] - see [FILE PATH]
- Reuse [EXISTING CLASS/COMPONENT] for [REASON]
- Use [EXISTING LIBRARY/CONFIG] not [ALTERNATIVE]
- Do NOT modify [FILE/SERVICE] - [REASON]

[Reference actual code. If you say "existing pattern", name which class implements it.]

### Acceptance Criteria
- [ ] [CONCRETE CRITERION - something testable]
- [ ] [CONCRETE CRITERION - something testable]
- [ ] [CONCRETE CRITERION - something testable]
- [ ] No SonarQube blockers introduced
- [ ] All tests passing (unit + integration)

[Avoid "it works" or "code is clean". Make each checkable.]

### Test Requirements
- [ ] Unit tests for [SPECIFIC COMPONENT]: see existing tests in [PATH]
- [ ] Integration test: [CONCRETE SCENARIO]
- [ ] Performance: [IF RELEVANT]

### Dependencies
- [ ] Depends on: [OTHER JIRA TICKETS IF ANY]
- [ ] Blocks: [OTHER WORK IF ANY]

### Notes
- [Any architectural decisions already made]
- [Any constraints from other services]
- [Any known complexities]
```

---

## TEMPLATE 2: Repository Impact Map Template

**This is what Claude produces during planning. Human reviews this.**

```markdown
# Impact Map: [Feature Name]

## Overview
[One sentence: what we're building and why]

## Services Affected

### [Service Name 1] (PRIMARY)
**Changes Required:**
- `src/main/java/.../Controller.java` — Add new endpoint
- `src/main/java/.../Service.java` — Add business logic
- `src/test/java/.../ServiceTest.java` — Add tests
- `helm/values.yaml` — No changes needed

**Why:** [Single sentence explaining why this service]

**Assumptions:** 
- [ ] Existing pattern in [FunctionX] can be reused
- [ ] Database schema doesn't need to change
- [ ] Message queue is already configured

### [Service Name 2] (DEPENDENT)
**Changes Required:**
- `src/main/java/.../Controller.java` — Update to use new endpoint
- `helm/values.yaml` — Add new dependency config

**Why:** [Why this service needs updates]

**Assumptions:**
- [ ] API response format backwards compatible

### [Service 3] (NO CHANGES)
**Why:** Thought this might need changes, but [REASON IT DOESN'T]

## Implementation Order
1. [Service Name 1] — Core logic first
2. [Service Name 2] — Consume changes from Service 1
3. Tests — Across all services

## Risks & Unknowns
- [ ] Risk: [WHAT COULD GO WRONG]
  Solution: [HOW TO MITIGATE]
- [ ] Unknown: [WHAT WE'RE NOT SURE ABOUT]
  Next step: [HOW TO RESOLVE]

## Files NOT to Modify
- [ ] API Gateway — changes should be in individual services
- [ ] Shared library — no changes to public APIs

---
## REVIEWER CHECKLIST

Review this impact map and answer:

- [ ] Are the affected services correct?
- [ ] Are we missing any service that should be changed?
- [ ] Do the file paths exist? (Spot-check 2-3)
- [ ] Does this match our architecture?
- [ ] Any concerns about the approach?

**Approver**: _______________  **Date**: _______________

**Feedback/Changes Needed**:
[If not approved, list what needs to be fixed before creating Jira tasks]
```

---

## TEMPLATE 5: AGENT.md (Agent Identity & Constraints)

**File location:** `.agents/{agent-name}/AGENT.md`

```markdown
---
name: PaymentServiceAgent
description: Payment Service Specialist
icon: 💳
role: Payment processing and async workflow expert
scope: /services/payment-service/
---

# Payment Service Agent

## Who Am I?
You are the **Payment Service Specialist**. Your expertise is deep:
- Payment processing flows
- Async transaction handling
- External gateway integration
- Payment-specific security concerns

## What's My Scope?

**I Can Modify:**
- `/services/payment-service/` (all code)
- `/helm/payment-service/` (deployment config)
- Tests in `src/test/java/com/company/payment/`

**I Can Read:**
- `/shared/` (common utilities)
- `/docs/ARCHITECTURE.md` (system overview)
- `/CLAUDE.md` (shared standards)
- `/PATTERNS.md` (code examples)
- `/TESTING.md` (test strategies)
- `/DEVOPS.md` (deployment process)

**I Cannot Modify:**
- Other services' code
- Global shared utilities
- Other services' Helm charts
- API Gateway routing

## My Knowledge Base

I automatically load and reference:
- **CLAUDE.md** ← Shared standards everyone follows
- **PATTERNS.md** ← Code examples across all services
- **ARCHITECTURE.md** ← System overview
- **TESTING.md** ← Test strategies and patterns
- **DEVOPS.md** ← Deployment and infrastructure
- **payment-service-agent/SKILL.md** ← My payment expertise

## My Constraints

### Code Quality
- ✓ SonarQube: ZERO blockers allowed
- ✓ Test coverage: 80%+ for new code
- ✓ Follow patterns from PATTERNS.md
- ✓ Update tests when modifying code

### Security (Payment-Specific)
- ✓ No PII in logs (use masking)
- ✓ Encrypt transaction data in DB
- ✓ Validate all external API inputs
- ✓ Use K8s secrets for API keys (never hardcode)

### Deployment
- ✓ Update `/helm/payment-service/values.yaml` if config changes
- ✓ Never modify other services' Helm charts
- ✓ Document new environment variables

## When You Ask Me to Do Something

I will:
1. Read your Jira task carefully
2. Consult my SKILL.md for payment patterns
3. Check CLAUDE.md and PATTERNS.md for standards
4. Implement ONLY in /services/payment-service/
5. Write tests per TESTING.md requirements
6. Verify SonarQube shows 0 blockers
7. Update Helm chart if needed

I will NOT:
- ❌ Modify other services
- ❌ Invent new patterns
- ❌ Skip tests
- ❌ Commit without SonarQube passing
- ❌ Hardcode secrets
- ❌ Refactor code outside my scope
```

---

## TEMPLATE 6: SKILL.md (Agent Domain Knowledge)

**File location:** `.agents/{agent-name}/SKILL.md`

```markdown
# Payment Service Skill

## Service Overview
The Payment Service handles all payment processing, async transaction 
management, and integration with external payment gateways. It's a critical, 
high-traffic service that must be reliable and secure.

## Key Files You'll Modify

```
src/main/java/com/company/payment/
├── controller/PaymentController.java       ← REST endpoints
├── service/PaymentProcessorImpl.java        ← Core processor
├── service/AsyncPaymentService.java        ← Async workflows
├── gateway/PaymentGatewayAdapter.java      ← Gateway integration
├── dto/PaymentRequest.java                 ← Request DTOs
└── repository/PaymentRepository.java       ← DB queries

src/test/java/com/company/payment/
├── PaymentProcessorImplTest.java           ← Unit tests
├── AsyncPaymentServiceTest.java            ← Async tests
└── PaymentControllerIntegrationTest.java   ← Integration tests

helm/payment-service/
├── values.yaml                             ← Config per environment
├── Chart.yaml                              ← Metadata
└── templates/                              ← K8s manifests
```

## Code Patterns (MUST FOLLOW THESE)

### Pattern 1: REST Endpoint
**See also:** `/PATTERNS.md` for full examples

```java
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
        @RequestBody PaymentRequest request) {
        // Implementation
        return ResponseEntity.ok(response);
    }
}
```

**When adding endpoints:**
- Use `@RestController` + `@RequestMapping`
- Follow `/api/v{version}/resource` pattern
- Return `ResponseEntity<T>`
- Validate input with `@Valid`

### Pattern 2: Async Processing (Payment-Specific)
**See also:** `/PATTERNS.md` + this skill for payment examples

```java
@Service
public class AsyncPaymentService {
    
    @Async
    public CompletableFuture<PaymentResult> processPaymentAsync(
        PaymentRequest request) {
        // Business logic
        return CompletableFuture.completedFuture(result);
    }
    
    // Error handling for async failures
    public void handleAsyncFailure(PaymentRequest req, Exception ex) {
        // Log error
        // Retry logic
        // Alert operations
    }
}
```

**When adding async:**
- Use `@Async` annotation
- Return `CompletableFuture<T>`
- Implement error handling
- Configure message queue (RabbitMQ)
- Reference `application.yml` for connection strings

### Pattern 3: Database Queries (JPA)
**See also:** `/PATTERNS.md` for general pattern

```java
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatusAndCreatedDateAfter(
        String status, LocalDateTime date);
    
    @Query("SELECT p FROM Payment p WHERE p.customerId = :customerId")
    List<Payment> findPaymentsByCustomer(@Param("customerId") Long customerId);
}
```

**When querying:**
- Extend `JpaRepository` or `CrudRepository`
- Use method naming for simple queries
- Use `@Query` for complex queries
- NO native SQL unless absolutely necessary
- Always paginate large result sets

### Pattern 4: Testing (Payment-Specific)
**See also:** `/TESTING.md` for full strategy

```java
@SpringBootTest
class PaymentProcessorImplTest {
    
    @Test
    void testCreatePaymentSuccess() {
        // Arrange
        PaymentRequest request = new PaymentRequest(
            customerId: 123,
            amount: 99.99,
            method: "CREDIT_CARD"
        );
        
        // Act
        PaymentResponse response = processor.process(request);
        
        // Assert
        assertNotNull(response.getTransactionId());
        assertEquals(PaymentStatus.PENDING, response.getStatus());
    }
    
    @Test
    void testAsyncPaymentProcessing() {
        // Test async processing with CompletableFuture
    }
}
```

**When testing:**
- Unit tests: mock external dependencies
- Integration tests: use real DB (test container)
- Coverage target: 80%+ for new code
- Test critical paths: 100% coverage
- File naming: `[Class]Test.java`
- Async tests: use `CompletableFuture` assertions

## External Dependencies (Already Configured)

- **RabbitMQ:** Message queue configured in `application.yml`
  - Exchange: `payment.exchange`
  - Queue: `payment.async.queue`
  - See examples in `PaymentEventPublisher.java`

- **Payment Gateway SDK:** Already in `pom.xml`
  - See `PaymentGatewayAdapter` for usage
  - API keys injected as K8s secrets

- **PostgreSQL:** Via Spring JPA
  - See `PaymentRepository` for examples
  - Schema: see `schema.sql` (if exists)

## Common Tasks & Where They Go

| Task | File(s) to Modify | Pattern to Follow |
|------|-------------------|-------------------|
| Add new payment method | `PaymentGatewayAdapter.java` | Gateway integration pattern |
| Handle async failures | `AsyncPaymentService.java` | Async processing + error handling |
| New REST endpoint | `PaymentController.java` + `PaymentService.java` | REST endpoint pattern |
| Add database query | `PaymentRepository.java` | JPA query pattern |
| Fix transaction bug | Multiple files (use impact map first) | Follow existing patterns |
| Add security validation | `PaymentValidator.java` | Security rules from CLAUDE.md |

## Security Checklist (Payment-Specific)

Before committing ALWAYS verify:

- [ ] No PII in logs (customer names, card numbers, etc.)
  - Use masking: `PaymentMasker.mask(cardNumber)`
  
- [ ] Transaction data encrypted in DB
  - Use `@ColumnTransformer` for encryption
  
- [ ] All external API inputs validated
  - Gateway responses checked for tampering
  - Amount validated (no negative values)
  - Customer verified before processing
  
- [ ] K8s secrets used for API keys
  - Never hardcode: `GATEWAY_API_KEY=xxx`
  - Instead: `valueFrom.secretKeyRef`
  
- [ ] SonarQube: 0 blockers
  - Run: `mvn sonar:sonar`
  
- [ ] Tests included
  - Coverage: 80%+

## Deployment Notes

### Helm Chart Location
`/helm/payment-service/values.yaml`

### Configuration Per Environment
```yaml
# values.yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: payment-db-secret
        key: url
        
  - name: GATEWAY_API_KEY
    valueFrom:
      secretKeyRef:
        name: payment-gateway-secret
        key: api-key
```

### If You Add New Config
1. Update `values.yaml` with new environment variable
2. Create K8s secret (operations team handles this)
3. Reference in deployment: `valueFrom.secretKeyRef`
4. NEVER put secret value in Git

## Useful References

- **Async pattern**: See `UserService.processUserAsync()` in user-service
- **Gateway integration**: See external SDK docs
- **Testing with async**: See `AsyncPaymentServiceTest.java`
- **Helm charts**: See `/helm/payment-service/Chart.yaml`
- **General patterns**: See `/PATTERNS.md`
- **Deployment process**: See `/DEVOPS.md`
- **Code standards**: See `/CLAUDE.md`
```

---

## File Naming Convention

```
For each agent:

.agents/
└── {agent-name}/
    ├── AGENT.md          ← Agent identity, role, scope, constraints
    └── SKILL.md          ← Domain expertise, patterns, common tasks
```

**Agent name examples:**
- `payment-service-agent`
- `qa-automation-agent`
- `devsecops-agent`

**File naming:**
- AGENT.md (not agent.md or AGENT_MD)
- SKILL.md (not skill.md or SKILL_MD)

**Create for your project, customize with YOUR patterns:**

```markdown
# Development Guide: Our Project Standards

## Quick Context
- **Project**: AI4IT/SDLC
- **Services**: 25+ Java/Spring Boot microservices + ReactJS UI
- **Stack**: Java 11+, Spring Boot, React, PostgreSQL, Kubernetes, OpenShift
- **Quality Gates**: SonarQube (0 blockers), Hadolint, CI/CD pipeline

## Directory Structure

```
project-root/
├── services/
│   ├── api-gateway/
│   ├── payment-service/
│   ├── user-service/
│   ├── ... (23 more services)
│   └── ui-dashboard/
├── shared/
│   ├── src/main/java/com/company/shared/
│   │   ├── dto/           # Shared data transfer objects
│   │   ├── exception/     # Common exceptions
│   │   ├── repository/    # Base JPA repositories
│   │   └── util/          # Utilities
├── helm/
│   ├── payment-service/
│   │   ├── Chart.yaml
│   │   └── values.yaml
│   └── ... (one per service)
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PATTERNS.md
│   └── SETUP.md
└── .mcp/
    └── config.json
```

## Key Code Patterns (Learn These First)

### Pattern 1: REST Endpoint

**Where to see it**: `/services/api-gateway/src/main/java/com/company/api/controller/PaymentController.java`

```java
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@RequestBody PaymentRequest request) {
        // Implementation
    }
}
```

**When building new endpoints**: 
- Use `@RestController` and `@RequestMapping`
- Follow `/api/v{version}/resource` pattern
- Return `ResponseEntity<T>` for flexibility

### Pattern 2: Async Processing

**Where to see it**: `/services/user-service/src/main/java/com/company/user/service/UserService.java`

```java
@Service
public class UserService {
    
    @Async
    public CompletableFuture<UserResponse> processUserAsync(UserRequest request) {
        // Do async work
        return CompletableFuture.completedFuture(response);
    }
}
```

**When building async features**:
- Use `@Async` decorator
- Return `CompletableFuture<T>`
- Use message queue (RabbitMQ configured in `application.yml`)
- Configure in `@Configuration` class

### Pattern 3: Database Query (JPA)

**Where to see it**: `/shared/src/main/java/com/company/shared/repository/`

```java
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatusAndCreatedDateAfter(String status, LocalDateTime date);
}
```

**When querying database**:
- Extend `JpaRepository` or `CrudRepository`
- Use method naming conventions for simple queries
- Use `@Query` for complex queries
- No native SQL unless absolutely necessary

### Pattern 4: Testing

**Where to see it**: `/services/payment-service/src/test/java/com/company/payment/`

```java
@SpringBootTest
class PaymentServiceTest {
    
    @Test
    void testCreatePayment() {
        // Arrange
        PaymentRequest request = new PaymentRequest(...);
        
        // Act
        PaymentResponse response = service.create(request);
        
        // Assert
        assertNotNull(response.getId());
    }
}
```

**Testing rules**:
- Unit tests in `src/test/java/` (same package structure)
- Use `@SpringBootTest` for integration tests
- Minimum 80% code coverage for new code
- Test file naming: `[Class]Test.java`

## Code Standards & Rules

### Naming Conventions
- **Classes**: PascalCase (PaymentService, PaymentController)
- **Methods/Variables**: camelCase (createPayment, paymentList)
- **Constants**: UPPER_SNAKE_CASE (MAX_PAYMENT_AMOUNT)
- **Test methods**: testWhatItDoes() (testCreatePayment, testHandleFailure)

### Line Length
- Maximum: 120 characters
- Helps with code review readability

### Security (CRITICAL)
- ❌ **NEVER** hardcode credentials, API keys, passwords
- ✅ **ALWAYS** use Kubernetes secrets (injected as env vars)
- ✅ Document required K8s secrets in `helm/values.yaml`

Example:
```yaml
# helm/values.yaml
env:
  - name: DATABASE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: payment-service-secrets
        key: db-password
```

### Documentation
- Method Javadoc for public methods: `/** description */`
- Class Javadoc for public classes
- Complex logic: inline comments explaining "why", not "what"

### Code Review Standards
- No SonarQube blockers in new code
- All tests passing (unit + integration)
- Follows patterns in this file
- Helm charts updated if infrastructure changes

## Quality Gates (Mandatory)

### SonarQube
```
✓ ZERO blockers allowed
✓ ZERO critical issues allowed
✓ 80%+ code coverage on new code
✓ No duplicate code patterns
```

Check: `https://sonarqube.your-company/projects`

### Hadolint (Docker)
If modifying Dockerfiles:
```
✓ Must pass Hadolint checks
✓ Use specific base image versions (not 'latest')
✓ Run security scans
```

Check: Automatic in CI/CD pipeline

### CI/CD Pipeline
All of these must pass before merge:
```
✓ SonarQube quality gate
✓ All tests pass
✓ Hadolint (if Docker changes)
✓ Container image builds successfully
✓ Helm charts validate
```

## Common Service Communication

### REST Calls Between Services
Use RestTemplate (Spring Boot):
```java
@Bean
public RestTemplate restTemplate() {
    return new RestTemplate();
}

// In service class
private RestTemplate restTemplate;

public PaymentDetails getPaymentDetails(String paymentId) {
    return restTemplate.getForObject(
        "http://api-gateway/api/v1/payments/" + paymentId,
        PaymentDetails.class
    );
}
```

### Async Message Queue
Use RabbitMQ (pre-configured):
```java
@Component
public class PaymentEventPublisher {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void publishPaymentProcessed(PaymentEvent event) {
        rabbitTemplate.convertAndSend("payment.exchange", 
                                      "payment.processed", 
                                      event);
    }
}
```

## Local Development Setup

### Required Tools
- Java 11+ (`java -version` should show 11+)
- Maven 3.8+ (`mvn -version`)
- Node 16+ (for React services)
- Git
- Docker (for testing containers)

### Starting a Service Locally

```bash
# For backend service
cd services/payment-service
mvn spring-boot:run

# Runs on http://localhost:8080 (configurable in application.yml)
```

### Starting React Dashboard

```bash
cd services/ui-dashboard
npm install
npm start

# Runs on http://localhost:3000
```

## Deployment

### Kubernetes Manifests
All manifests are Helm charts in `/helm/{service-name}/`

**Do NOT:**
- Write raw Kubernetes YAML (use Helm instead)
- Hardcode environment-specific values

**DO:**
- Update `values.yaml` with new config
- Update `Chart.yaml` for new dependencies
- Test Helm charts: `helm template payment-service ./helm/payment-service/`

### Deploying to OpenShift

```bash
# Validates Helm chart
helm template payment-service ./helm/payment-service/

# Dry-run to OpenShift
helm install --dry-run payment-service ./helm/payment-service/ --namespace production

# Actual deployment (CI/CD does this automatically)
helm upgrade --install payment-service ./helm/payment-service/ --namespace production
```

## Performance Considerations

### Database Queries
- ❌ N+1 queries (fetch user, then in loop fetch each user's payments)
- ✅ Use JPA `join fetch` or `@Query` to get data in one call

### Async Processing
- Use for long-running operations (external API calls, file processing)
- Don't use for simple CRUD operations (adds complexity)

### Caching
- Consider caching for frequently accessed, rarely-changing data
- Use Spring's `@Cacheable` annotation

## Environment-Specific Configuration

Use `application-{profile}.yml`:
- `application.yml` — defaults
- `application-dev.yml` — local development
- `application-prod.yml` — production

Activate with `spring.profiles.active=dev` (in env var)

## Getting Help

### Documentation
- Architecture: See `/docs/ARCHITECTURE.md`
- API contracts: See `/docs/API.md`
- Deployment: See `/docs/DEPLOYMENT.md`

### Code Examples
- Payment service pattern: `/services/payment-service/`
- User service async pattern: `/services/user-service/`
- React component patterns: `/services/ui-dashboard/src/components/`

### Team
- Architecture questions: #architecture Slack channel
- Build/Deploy issues: #devops-support
- Code review: Create PR, tag @team

---

## TL;DR — The Most Important Rules

1. **Follow existing patterns** — See examples in this file
2. **Write tests** — 80%+ coverage for new code
3. **No SonarQube blockers** — Period
4. **No credentials in code** — Use K8s secrets
5. **Update Helm charts** — If config or dependencies change
6. **Update this file** — When you discover new patterns
```

---

## TEMPLATE 4: Quick Reference Card (Print & Share)

```
╔══════════════════════════════════════════════════════════════╗
║        AI4IT/SDLC Development Quick Reference Card          ║
╚══════════════════════════════════════════════════════════════╝

BEFORE STARTING A TASK
────────────────────────────────────────────────────────────────
□ Read the Jira task (use new template format)
□ Locate the repository in /services/
□ Have CLAUDE.md open for reference
□ Read the Files to Modify section carefully

DURING IMPLEMENTATION
────────────────────────────────────────────────────────────────
1. FOLLOW PATTERNS from existing code
   See: CLAUDE.md "Key Code Patterns" section

2. MAKE CHANGES only to files listed in task
   Don't refactor other areas unless approved

3. WRITE TESTS for new code
   Target: 80%+ coverage

4. RUN CHECKS before commit
   □ Unit tests pass: mvn test
   □ SonarQube quality gate passes
   □ No hardcoded credentials
   □ Helm charts valid (if changed)

BEFORE CREATING PULL REQUEST
────────────────────────────────────────────────────────────────
□ All unit tests passing
□ All integration tests passing
□ SonarQube shows no blockers
□ Helm charts valid (if changed)
□ Commit messages clear
□ PR description references Jira task

PATTERNS TO KNOW (From CLAUDE.md)
────────────────────────────────────────────────────────────────
REST Endpoint     → See: api-gateway PaymentController
Async Processing  → See: user-service UserService
Database Query    → See: shared package repositories
Testing Pattern   → See: any service src/test/

CODE STANDARDS
────────────────────────────────────────────────────────────────
Line Length:      120 characters max
Test Coverage:    80%+ for new code
SonarQube:        ZERO blockers
Security:         No credentials in code (use K8s secrets)

COMMON COMMANDS
────────────────────────────────────────────────────────────────
$ mvn test              # Run unit tests
$ mvn verify            # Full build + tests
$ mvn spring-boot:run   # Start service locally
$ helm template svc ./helm/svc/  # Validate Helm chart

WHEN STUCK
────────────────────────────────────────────────────────────────
1. Check CLAUDE.md for pattern examples
2. Look at similar code in another service
3. Read the Jira task Implementation Notes
4. Ask team in Slack #architecture or #devops-support

KEY CONTACTS
────────────────────────────────────────────────────────────────
Architecture:     #architecture Slack
DevOps/Deploy:    #devops-support Slack
Code Review:      Tag @team in PR
```

---

## Implementation Sequence

### Step 1: This Week (Foundation)
1. Create `/CLAUDE.md` — developer guide
2. Create `/PATTERNS.md` — code examples
3. Create `/.mcp/config.json` — GitLab & Jira integration
4. Create Jira Task Template
5. Share all with team

### Step 2: Next Week (Adoption)
6. Team training (1 hour walkthrough)
7. Create SKILLS for 3 key microservices
8. Run first pilot task with new process
9. Collect feedback, refine templates

### Step 3: Ongoing (Optimization)
10. All new tasks use template
11. Monitor SonarQube metrics
12. Refine CLAUDE.md with lessons learned
13. Expand SKILLS library

---

## Success Metrics

Track these to see impact:

```
Before (Without AI-Powered Workflow)
├── PR review cycles: 3-5 rounds
├── "Wrong service" mistakes: Frequent
├── Code pattern violations: High
└── SonarQube blockers on new code: High

After (With AI-Powered Workflow)
├── PR review cycles: 1-2 rounds ✓
├── "Wrong service" mistakes: Rare ✓
├── Code pattern violations: Low ✓
└── SonarQube blockers on new code: Near-zero ✓
```

