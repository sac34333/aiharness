PDF/Whitepaper: Introduction to Agents.pdf
 

From Predictive AI to Autonomous Agents

What are Agents (Very generalized):

Agents are the natural evolution of LLMs, made useful in SW

Moving from AI that just predicts to a new class of SW capable of autonomous problem-solving and task execution

An Agent is not just an AI model in a workflow; it is a complete application

It combines the ability of LLM to REASON with practical ability to ACT, allowing it to handle complex, multi-step tasks that a model alone cannot do. 

The critical point is that an Agent can figure out the next steps needed to reach a goal without a
person guiding them at every turn.

Goals: To successfully build, deploy, and manage intelligent applications that can REASON, ACT, and OBSERVE to accomplish GOALS.

 

What are Agents (Technically):

An AI Agent can be defined as a combination of: 

Models

Tools

Orchestration Layer

Runtime services

That uses the LLM in a loop to accomplish a GOAL.

Shortest Definition: “LMs in a loop with tools to accomplish an objective.”

The MODEL (The Brain):

Agent’s central reasoning engine to process info, evaluate options, and make decisions. The type of model (fine-tuned, general-purpose) dictates the agent’s cognitive capabilities. 

Tools (The Hands): 

Connecting the model to the outside world. API extensions, code functions, and data stores (Vector or DB) for accessing real-time, factual information. 

An agentic system allows LM to plan which tools to use, execute the tool, and put the tool results into the input context window of the next LM call. 

The Orchestration Layer (The "Nervous System"):

The process that manages the agent’s operational loop. It handles planning, memory (state), and reasoning strategy execution. This layer uses, for example, chain-of-thought, or ReAct (prompting frameworks or reasoning techniques) to break down complex goals to steps and decide when to think v/s use a tool. 

This layer also provides memory to the agents

Deployment (The "Body and Legs"):

Hosting the agent with essential prod services such as monitoring, logging, and mgmt. 

This makes agents accessible to the users through a GUI or programmatically by other agents via A2A APIs.

 

The traditional developer acts as a "bricklayer," precisely defining every logical step. The agent developer, in contrast, is more like a director. Instead of writing explicit code for every action, you set the scene (the guiding instructions and prompts), select the cast (the tools and APIs), and provide the necessary context (the data). The primary task becomes guiding this autonomous "actor" to deliver the intended performance.

It's crucial to remember that comprehensive evaluations and assessments often outweigh the initial prompt's influence.

 

How does this system actually work?

Fundamentally, an agent operates on a continuous cyclical process to achieve its Goals. It can be broken down into 5 fundamental steps: 

Get the mission

Scan the scene

Think it through

Take action

Observe & iterate

 

This "Think, Act, Observe" cycle continues - managed by the Orchestration Layer, reasoned
by the Model, and executed by the Tools until the agent's internal plan is complete and the initial Mission is achieved.

 

In its ‘Think’ phase, it devises a strategy and a plan using reasoning capabilities. 

In its ‘Act’ phase, it executes step 1 of its plan and observes the result. 

Orchestration layer recognizes that 1st part of the plan is complete, and immediately proceeds to the 2nd plan of action. Then, finally, after all the plans are executed, it moves to the ‘report’ step and generates a response. 

 

A Taxonomy of Agentic Systems

For an architect or product leader, a key initial decision is scoping what kind of agent to build.

We can classify agentic systems into a few broad levels, each building on the capabilities of
the last.

Level 0: The Core Reasoning System

This is the base AI model—the "brain" all by itself.

In this configuration, a Language Model (LM) operates in isolation, responding solely based on its vast pre-trained knowledge without any tools, memory, or interaction with the live environment.

Level 1: The Connected Problem-Solver

The reasoning engine becomes a functional agent by connecting to and utilizing
external tools. i.e., An agent that can connect to and use external tools, like Google Search or a calculator. It can answer questions about real-time events.

Level 2: The Strategic Problem-Solver

Aspirant AI example

This is the brain (Level 0) plus tools (Level 1) and the ability to create a plan.

A strategic agent that can break down a complex goal into a series of steps.

It can solve multi level problem. 

It uses the output from one step to create a smarter, more focused input for the next step. This is called context engineering.

For instance, consider the "Mission": "Find a good coffee shop halfway between my office
at 1600 Amphitheatre Parkway, Mountain View, and my client's office at 1 Market St,
San Francisco."

For the "find coffee halfway" mission, it creates a plan:

Step 1: Use a Maps tool to find the halfway point.

Step 2: Use the result from Step 1 (e.g., "Millbrae") to run a new search for "good coffee in Millbrae."

Level 3: The Collaborative Multi-Agent System

Instead of one "super-agent" trying to do everything, you have a "Project Manager" agent that coordinates a team of specialized agents.

What it is: A collaborative multi-agent system.

What it can do: The Project Manager agent receives a complex mission (e.g., "Launch a new product"). It then delegates smaller, specific tasks to other agents (e.g., a MarketingAgent to write a press release, a WebDevAgent to build the webpage).

Level 4: The Self-Evolving System

This is a system that can create its own new tools or agents.

What it is: An autonomous and adaptive system.

What it can do: When an agent (like the L3 Project Manager) realizes it's missing a capability to complete its mission (e.g., "I need to track social media sentiment, but I don't have a tool for that"), it doesn't fail. Instead, it autonomously creates a new, specialized agent (like a SentimentAnalysisAgent) on the fly.

The key skill: The system can identify its own gaps and dynamically expand its capabilities, making it a truly learning organization.

 

Core Agent Architecture: Model, Tools, and Orchestration

🧠Model - 'The Brain”

Choosing the LM decides the agent’s cognitive capabilities, operational cost, and speed.

Picking a model based on generic academic benchmarks is a "common path to failure.

Real-world success demands a model that excels at agentic fundamentals: 

superior reasoning to navigate complex, multi-step problems and 

Reliable tool use to interact with the world (i.e., T-bench - $τ$-bench: A Benchmark for Tool-Agent-User Interaction in... ).

The Right Way to Choose:

Start with your business problem. test the model against metrics that directly map to that outcome (e.g. if it processes insurance claims, evaluate its ability to extract information
from your specific document formats.)

The "best" model is the one that sits at the optimal intersection of quality, speed, and price for your specific task. (i.e., Using Artificial Analysis - Guide | Artificial Analysis ).

You don't have to use just one model. A good strategy is "model routing": using a powerful, "frontier" model (like Gemini 2.5 Pro) for complex planning, but then routing simpler, high-volume tasks (like summarizing text) to a faster, cheaper model (like Gemini 2.5 Flash). e.g., using Vertex AI model Optimizer (Generative AI on Vertex AI  |  Google Cloud Documentation ).

The same principle applies to handling diverse data types (text or image). While a natively multimodal model like Gemini live mode offers a streamlined path to processing images and audio,an alternative is to use specialized tools like the Cloud Vision API or Speech-to-Text API.

"Agent Ops": The AI landscape changes fast, with models being "superseded in six months". A "set it and forget it" mindset is unsustainable. You need an "Agent Ops" practice—a robust CI/CD pipeline—to continuously evaluate new models against your business metrics and safely upgrade your agent's "brain" without an architectural overhaul.

🛠️ Tools: The "Hands"
Connect the Model’s reasoning to reality. 

Here are a few of the main types of tools agent builders will put into the “hands” of
their agents (others in Tool’s whitepaper):

Retrieving Information: Grounding in Reality:

RAG, and Natural Language to SQL (NL2SQL)

Benefits: By looking things up before speaking— whether in a document or a database—the agent grounds itself in fact, dramatically reducing hallucinations.

Executing Actions: Changing the World:

APIs and Code: You can "wrap" existing APIs and code functions as tools, allowing an agent to send an email, schedule a meeting, or update a customer record in ServiceNow.

Code Generation: The agent can write and execute code (like Python or SQL) "on the fly" in a secure sandbox to solve complex problems, transforming it into an "autonomous actor".

Human in the Loop (HITL): Tools can also be for human interaction. A HITL tool allows the agent to pause its workflow (e.g., ask_for_confirmation()) and ask a person for approval before taking a critical action.

Function Calling: Connecting Tools to your Agent - So, to wrap an API (like ServiceNow) and provide the agent these tools, we need function calling. The OpenAPI specification and the Model Context Protocol (MCP) are just the standards you use to tell the agent how to make that call.


The Model Context Protocol (MCP) is an open standard that allows AI systems like large language models (LLMs) to connect to and interact with external tools and data sources. Developed by Anthropic and now open-source, it acts as a standardized way for AI agents to get information needed to perform tasks, much like an application programming interface (API) but for AI agents

A few models have native tools, like Gemini with native Google Search, where the function invocation happens as part of the LM call itself. - Grounding with Google Search: Grounding with Google Search connects the Gemini model to real-time web content and works with all available languages. This allows Gemini to provide more accurate answers and cite verifiable sources beyond its knowledge cutoff. (Grounding with Google Search  |  Gemini API  |  Google AI for Developers )

The Orchestration Layer

The layer where the actual Think, Act, Observe loop runs. It is a state machine that governs agents’ behavior, and logic resides.

Core Design Choices

No-code builders offer speed and accessibility, empowering business users to automate structured tasks and build simple agents rapidly. For more complex, mission-critical systems, code-first frameworks, such as Google's Agent Development Kit (ADK), provide the deep control, customizability, and integration capabilities that engineers require.

Instruct with Domain Knowledge and Persona

Via a system prompt - 'You are a helpful customer support agent for Acme Corp,'

Augment with Context

Short-term memory is the agent's active "scratchpad," maintaining the running history of the
current conversation. This may be implemented as abstractions like state, artifacts, sessions or threads.

Multi-Agent Systems and Design Patterns

As tasks grow in complexity, building a single, all-powerful "super-agent" becomes inefficient.
The more effective solution is to adopt a "team of specialists" approach, which mirrors
a human organization. This is the core of a multi-agent system: a complex process is segmented into discrete sub-tasks, and each is assigned to a dedicated, specialized AI agent. This division of labor allows each agent to be simpler, more focused, and easier to build, test, and maintain, which is ideal for dynamic or long-running business processes.

Choose a design pattern for your agentic AI system (become expert in designing an Multi Agent AI System) 
Very good to learn this in detail later on: Choose a design pattern for your agentic AI system  |  Cloud Architecture Center  |  Google Cloud Documentation 

Single-agent system: A single agent using a prompt and tools to handle a task autonomously.

Multi-agent systems: Orchestrates multiple specialized agents to solve a complex problem. This category includes:

Sequential pattern: Executes agents in a predefined, linear order.

Parallel pattern : Subagents perform tasks independently at the same time.

Loop pattern: Repeatedly executes a sequence of subagents until a condition is met.

Review and critique pattern : A "generator" agent creates content and a "critic" agent evaluates it.

Iterative refinement pattern : Uses a loop to progressively improve an output over multiple cycles.

Coordinator pattern : A central "coordinator" agent directs the workflow and dispatches sub-tasks.

Hierarchical task decomposition pattern : A top-level agent breaks down a complex task and delegates it to lower-level subagents.

Swarm pattern : Multiple specialized agents work together with all-to-all communication to refine a solution.

Reason and act (ReAct) pattern : An agent operates in an iterative loop of thought, action, and observation.

Human-in-the-loop pattern : Integrates points for human intervention, pausing the agent to wait for a person's review or approval.

Custom logic pattern : A flexible approach using code (like conditional statements) to create complex, branching workflows

Most important aspects: 🤔 How to Decide on a Pattern and ⚖️ How to Compare Patterns

 

Agent Deployment and Services:

Luckily, agent builders can rely on decades of application hosting infrastructure. 

New arch and infra are such as Vetex AI Agent Engine: Scale your agents  |  Gemini Enterprise Agent Platform  |  Google Cloud Documentation 

Vertex AI Agent Engine, a part of the Vertex AI Platform, is a set of services that enables developers to deploy, manage, and scale AI agents in production.

Any agent and most agent services can be added to a Docker container and
deployed onto industry-standard runtimes like Cloud Run or GKE: GKE and Cloud Run  |  Google Kubernetes Engine (GKE)  |  Google Cloud Documentation 

Dockerize and deploy on GKE

Agent Starter pack: This provides infrastructure, CI/CD, observability, and security: GitHub - GoogleCloudPlatform/agent-starter-pack: Ship AI Agents to Google Cloud in minutes, not months. Production-ready templates with built-in CI/CD, evaluation, and observability. 

Ship AI Agents to Google Cloud in minutes, not months. Production-ready templates with built-in CI/CD, evaluation, and observability.

This is a A Python package that provides production-ready templates for GenAI agents on Google Cloud.

Agent Ops: A Structured Approach to the Unpredictable (become an expert in Agent Ops):

The transition from traditional, deterministic software to stochastic, agentic systems requires
a new operational philosophy. Traditional software unit tests could simply assert output ==
expected, but that doesn’t work when an agent's response is probabilistic by design.

Very good read to understand Agent Ops in Detail: Relationships between the operational domains of DevOps, MLOps, and GenAIOps: GenAI in Production: MLOps or GenAIOps? 

 

Measure What Matters: Instrumenting Success Like an
A/B Experiment:

Before you can improve your agent, you must define what "better" means in the context of
your business.

Frame your observability strategy like an A/B test and ask yourself: - What are the Key Performance Indicators (KPIs) that prove the agent is delivering value?

Take a Top-down view/approach:

These metrics should go beyond technical correctness and measure real-world impact: 

goal completion rates, user satisfaction scores, task latency, operational cost per interaction

Most importantly—the impact on business goals like revenue, conversion, or customer retention.

Quality Instead of Pass/Fail: Using an LM Judge:

Creating the evaluation datasets—which include the ideal (or "golden") questions and correct
responses.


How can we do this? :

To build these, you should sample scenarios from existing production or development interactions with the agent. The dataset must cover the full breadth of use cases that you expect your users to engage with, plus a few unexpected ones.

Evaluation results should always be reviewed by a domain expert before being accepted as valid.

 

Metrics-Driven Development: Your Go/No-Go for Deployment:

Once you have many evaluation scenarios and trusted quality scores, test changes in your dev agent. 

Run the new version against the entire evaluation dataset and directly compare its scores to the existing production version.

While automated evaluations are critical, don't forget other important factors like latency, cost, and task success rates.

 

Debug with OpenTelemetry Traces: Answering "Why?"

OpenTelemetry trace is a high-fidelity, step-by-step recording of the agent's entire execution
path (trajectory), allowing you to debug the agent's steps - AI Agent Observability - Evolving Standards and Best Practices 

With traces, you can see the exact prompt sent to the model, the model's internal reasoning (if available), the specific tool it chose to call, the precise parameters it generated for that tool, and the raw data that came back as an observation.

Pls understand that tracing is primarily for debugging, not overviews of performance.

Trace data can be seamlessly collected in platforms like Google Cloud Trace.

 

Cherish Human Feedback: Guiding Your Automation

An effective Agent Ops process "closes the loop" by capturing this feedback, replicating the issue, and converting that specific scenario into a new, permanent test case in your evaluation dataset.

 

Agent Interoperability

After you build high-quality agents, the next step is to connect them to the wider world—specifically, to users and to other agents.

Agents and Humans: 

UT

Computer Use

Dynamic UI

Live Model

Agents and Agents

How to connect 2 agents which might speak diff. language. Solution is A2A protocol.

How it Works:

Discovery: An agent publishes a digital "business card" called an Agent Card (a JSON file). This card advertises its capabilities, network location, and security requirements.

Communication: Instead of a simple request-response, agents use a task-oriented architecture. A client agent sends an asynchronous "task" request, and the server agent can provide streaming updates as it works on the problem.

The Goal: A2A is what enables the collaborative, Level 3 multi-agent systems discussed earlier, turning isolated agents into a true, interoperable ecosystem

Agents and Money:  The web is built for humans to click "buy". When an autonomous agent does this, it creates a "crisis of trust". The solution: 

Agent Payments Protocol (AP2): This is an open protocol for agent commerce. It uses cryptographically-signed digital "mandates" that act as verifiable proof of user intent, creating an audit trail for transactions.

x402: This is an open internet protocol that uses the standard HTTP 402 "Payment Required" status code. It allows for frictionless, machine-to-machine micropayments, such as an agent paying for API access on a pay-per-use basis without needing a complex subscription

 

Securing a Single Agent: The Trust Trade-Off

Challenges working with AI agents:

The main concerns are rogue actions (the agent doing something harmful) and sensitive data disclosure

You can't just trust the AI model, because it can be tricked by things like prompt injection. The solution is a "defense-in-depth" approach with two main layers:

🛡️ The Two Layers of Defense:

Traditional, Deterministic Guardrails: These are hardcoded rules that exist outside the AI's reasoning. Think of them as a security checkpoint. Examples include a policy engine that blocks any purchase over $100 or a rule that requires human confirmation before an agent can call an external API. This layer provides predictable, auditable, hard limits.

Reasoning-Based Defenses: This means "using AI to help secure AI". This involves using smaller, specialized "guard models" that act like security analysts. They review the main agent's plan before it's executed and can flag any steps that seem risky or violate policy.

1. Agent Identity: A New Security Principal:

This is a critical concept. In the past, security was built around two types of "principals":

Human Users (who use OAuth or SSO)

Services (which use IAM or service accounts)

Agents are a new, third category. An agent is NOT just a piece of code; it is an "autonomous actor" that needs its own unique, verifiable "Agent Identity"—like a digital passport—that is separate from the user who started it or the developer who built it. 

Once an agent has a cryptographically verifiable identity (often using
standards like SPIFFE), it can be granted its own specific, least-privilege permissions.

For example, a SalesAgent can be given read/write access to the CRM, while the HRonboardingAgent is denied access. This limits the "blast radius" if an agent is ever compromised.

 2. Policies to Constraint Access
Policies (Authorization): Once you have an agent's identity (Authentication), you apply policies (Authorization) to constrain what it can do. This means applying the principle of least privilege to everything: the tools it can use, the data it can access, and the other agents it can talk to. A policy is a form of authorization (AuthZ), distinct from authentication (AuthN). Typically,
policies limit the capabilities of a principal; for example, “Users in Marketing can only access these 27 API endpoints and cannot execute DELETE commands.” As we develop agents, we need to apply permissions to the agents, their tools, other internal agents, context they can share, and remote agents. Think about it this way: if you add all the APIs, data, tools, and agents to your system, then you must constrain access to a subset of just those capabilities required to get their jobs done.

Securing an ADK Agent using  ADK: 

                     Safety and Security for AI Agents - Agent Development Kit (ADK) 

As described above, the process requires a clear definition of identities: user account (for example, OAuth), service account (to run code), and agent identity (to use delegated authority). Once authentication is handled, the next layer of defense involves establishing policies to constrain access to services. This is often done at the API governance layer, along with governance supporting MCP and A2A services………..

 
 Agent Development Kit (ADK) is a flexible and modular framework for developing and deploying AI agents. While optimized for Gemini and the Google ecosystem, ADK is model-agnostic, deployment-agnostic, and is built for compatibility with other frameworks. ADK was designed to make agent development feel more like software development, to make it easier for developers to create, deploy, and orchestrate agentic architectures that range from simple tasks to complex workflows.

Get started → pip install google-adk

Create an agent project → adk create my_agent

1. The Core Philosophy: Designed to be "Event-Driven & Stateful Architecture"
Unlike some frameworks that treat agents as simple "text-in, text-out" boxes, ADK treats agents as state machines that emit a stream of events.

Event-Driven: Every action-from user input to agent replies, tool calls, and state changes—is an immutable Event. The system runs in a loop, processing these events one by one (event loop - refer runtime & runner section for more details).

State-First: The framework strictly separates Compute (the Agent logic) from Memory (Session State). This ensures that if a server crashes, the agent can resume exactly where it left off because the state is persisted externally.

More on this: 

Session Management: A Session object persists throughout the interaction, holding the event history and a state dictionary (a key-value store).

State Access and Update: Agents and their tools can easily read from and write to this session.state using a ToolContext or CallbackContext. This allows data discovered in one step (e.g., a user's preferred temperature unit or the result of a tool call) to be used in subsequent steps or even transferred between different agents in a multi-agent system.

Memory vs. State: The ADK distinguishes between short-term State (within the current conversation) and long-term Memory (searchable information across multiple sessions or external knowledge bases), providing services to manage both effectively

2. The "Brain": Agents
The Agent is the fundamental unit of logic/work. In ADK, agents are more than just prompt wrappers; they are configurable workers that can reason or orchestrate. 

LlmAgent: The standard agent powered by a Large Language Model (like Gemini). It has instructions (system prompt), tools, and a model definition.

Key Feature: output_key. You can configure an LlmAgent to automatically save its final answer to a specific variable in the session state (e.g., output_key="summary_text").

Role: It uses an LLM to reason, plan, and decide which tools to call based on user input and instructions.

Key Configuration:

instruction: The system prompt that defines the agent's persona and rules.

tools: A list of python functions or McpToolset instances the agent can use.

model: The specific LLM to use (e.g., gemini-3.0-flash)

Workflow Agents: These are specialized, deterministic agents that control flow:

SequentialAgent: Runs a list of sub-agents in a strict order. Useful for pipelines (e.g., Research → Draft --> Review).

ParallelAgent: Runs multiple sub-agents simultaneously. Useful for gathering data from disparate sources simultaneously.

LoopAgent: Repeats a task until a condition is met. (e.g., "Keep rewriting until the code passes tests").

RouterAgent: Uses an LLM to decide dynamically which sub-agent to call next based on the users' intent.

Custom Agents: 

A custom agent is essentially any class you create that inherits from google.adk.agents.BaseAgentand implements the logic within run_async_impl asyncronous method. You have complete control over how this method calls other agents (sub-agents), manages state, and handles events.

Building custom agents by directly implementing _run_async_impl (or its equivalent in other languages) provides powerful control but is more complex than using the predefined LlmAgent or standard WorkflowAgent types. We recommend understanding those foundational agent types first before tackling custom orchestration logic.

Custom agents provide the ultimate flexibility in ADK, allowing you to define arbitrary orchestration logic by inheriting directly from BaseAgent and implementing your own control flow. This goes beyond the predefined patterns of SequentialAgent, LoopAgent, and ParallelAgent, enabling you to build highly specific and complex agentic workflows.

Choosing the right Agent: 

Feature

LLM Agent (LlmAgent)

Workflow Agent

Custom Agent (BaseAgent subclass)

Primary Function

Reasoning, Generation, Tool Use

Controlling Agent Execution Flow

Implementing Unique Logic/Integrations

Core Engine

Large Language Model (LLM)

Predefined Logic (Sequence, Parallel, Loop)

Custom Code

Determinism

Non-deterministic (Flexible)

Deterministic (Predictable)

Can be either, based on implementation

Primary Use

Language tasks, Dynamic decisions

Structured processes, Orchestration

Tailored requirements, Specific workflows

3. The "Engine": Runtime, Runner, and Event Loop
The Runtime is the machinery that makes the agent actually run. It operates on a strict Event Loop.

Runtime is the overall execution environment for an agentic application, while the Runner is a specific component within that Runtime responsible for orchestrating the event loop.

A. The Runner
The Runner is the orchestrator for a single user interaction. You don't call the agent directly; you pass the agent to a Runner (e.g., InMemoryRunner for dev, or a production Runner).

Responsibilities:

The Runner connects the agent logic to the necessary services and manages the flow of events during an interaction. 

Key Responsibilities of the Runner:

Session Management: It manages conversation history and state using a SessionService.

Agent Invocation: It determines which agent should handle the current message and calls its execution method.

Event Handling: It processes events generated by the agent and makes them available to applications.

Context Creation: It gathers information into an InvocationContext for the agent's use. 

B. The Event Loop (Yield / Pause / Resume)
ADK is asynchronous and event-driven. This is the most critical technical concept to grasp .
Execute: The Agent runs its logic.

Yield: When the Agent needs to do something (send a message, call a tool, update state), it yields an Event.

Pause: The Agent's execution pauses immediately. It does not continue until the Runner is done.

Process: The Runner takes the Event. If the event says "Update State to X", the Runner saves X to the database via SessionService.

Resume: The Runner wakes the Agent up. The Agent resumes execution, now seeing the updated state.

C. RunConfig
A configuration object passed to runner.run_async to control runtime behavior:

streaming_mode: StreamingMode.SSE (Server-Sent Events) or NONE.

max_llm_calls: Limits the number of turns to prevent infinite loops (default 500).

save_input_blobs_as_artifacts: If True, automatically saves uploaded files as tracked Artifacts for auditing.

D. Resumability
Problem: Network failures or server crashes can interrupt long-running workflows.

Solution: You can configure ResumabilityConfig(is_resumable=True) on the App object. This allows you to restart a workflow using its invocation_id, and ADK will skip already-completed steps and resume exactly where it failed.

4. The "Memory": Context, State, & Optimization
ADK separates Compute (Agent) from Memory (Session/State).

1. Session & State
Session: Represents the current entire continous conversation thread. 

When a user starts interacting with your agent, the SessionService creates a Session object (google.adk.sessions.Session). You don't typically create or manage Session objects directly. This service acts as the central manager responsible for the entire lifecycle of your conversation sessions. A Session Service object can handle multiple Session(s) or ids. This object acts as the container holding everything related to that one specific chat thread

Key properties are: 

Identification id - A unique identifier for this specific conversation thread. A SessionService object can handle multiple Session(s). e.g. "test_id_modification".

app_name: Identifies which agent application this conversation belongs to. For example, "id_modifier_workflow".

History (events): A chronological sequence of all interactions (Event objects – user messages, agent responses, tool actions) that have occurred within this specific thread.

Session State (state): A place to store temporary data relevant only to this specific, ongoing conversation. This acts as a scratchpad for the agent during the interaction. We will cover how to use and manage state in detail next.

Activity Tracking (lastUpdateTime): A timestamp indicating the last time an event occurred in this conversation thread.

State (session.state): A key-value store (dictionary or Map) for variables that must survive across conversation turns. State atribute acts like the agent's dedicated scratchpad for that specific interaction. While session.events holds the full history, session.state is where the agent stores and updates dynamic details needed during the conversation.

Mutable - The contents of the state are expected to change as the conversation evolves.

Example: 'session.state['user_preference_theme']= 'dark’ or 'shopping_cart_items': ['book', 'pen']

Scope Prefixes: You can use prefixes to control how long data lives :

No Prefix (Session State): 

Scope: Specific to current session (id)

Pesistance: Only persists if the SessionService is persistant (DB or VertexAI)

use cases: temp flags for interactions: 

session.state['current_intent'] = 'book_flight'

app:*:

Scope: Tied to the app_name, shared across all users and sessions for that application.

Persistence: Persistent with Database or VertexAI. (Stored by InMemory but lost on restart).

Example: session.state['app:global_discount_code'] = 'SAVE10'

user:*: 

Tied to a user id (user_id), shared across all sessions for that user (within the same app_name)

Persistence: Persistent with Database or VertexAI. (Stored by InMemory but lost on restart).

Example: session.state['user:preferred_language'] = 'fr'

temp:*: 

Scope: Specific to the current invocation (the entire process from an agent receiving user input to generating the final output for that input).

When Not to Use: For information that must persist across different invocations, such as user preferences, conversation history summaries, or accumulated data.

Example: session.state['temp:raw_api_response'] = {...}

 

When a parent agent calls a sub-agent (e.g., using SequentialAgent or ParallelAgent), it passes its InvocationContext to the sub-agent. This means the entire chain of agent calls shares the same invocation ID and, therefore, the same temp: state.

How the Agent Sees It: Your agent code interacts with the combined state through the single session.state collection (dict/ Map). The SessionService handles fetching/merging state from the correct underlying storage based on prefixes.

 

2. SessionService Implementations:
ADK provides different SessionService implementations, allowing you to choose the storage backend that best suits your needs:

This is the backend interface for saving sessions.

InMemorySessionService:

How it works: Stores all session data directly in the application's memory.

Persistence: None. All conversation data is lost if the application restarts.

Requires: Nothing extra.

Best for: Quick development, local testing, examples, and scenarios where long-term persistence isn't required.



from google.adk.sessions import InMemorySessionService
session_service = InMemorySessionService()
Persistent Services: In production, you would replace this with a service that saves to a database (Firestore, SQL), ensuring users can pause a conversation and resume days later.

VertexAiSessionService

How it works: Uses Google Cloud Vertex AI infrastructure via API calls for session management.

Persistence: Yes. Data is managed reliably and scalably via Vertex AI Agent Engine.

Requires:

A Google Cloud project (pip install vertexai)

A Google Cloud storage bucket that can be configured by this step.

A Reasoning Engine resource name/ID that can setup following this tutorial.

If you do not have a Google Cloud project and you want to try the VertexAiSessionService, see Vertex AI Express Mode.

Best for: Scalable production applications deployed on Google Cloud, especially when integrating with other Vertex AI features.



session_service = VertexAiSessionService(project=PROJECT_ID, location=LOCATION
DatabaseSessionService¶

How it works: Connects to a relational database (e.g., PostgreSQL, MySQL, SQLite) to store session data persistently in tables.

Persistence: Yes. Data survives application restarts.

Requires: A configured database.

Best for: Applications needing reliable, persistent storage that you manage yourself.



session_service = DatabaseSessionService(db_url=db_url)
 

The Session Lifecycle: 

image-20260124-172424.png
ADK Runtime Enviornment
Here’s a simplified flow of how Session and SessionService work together during a conversation turn:

Start or Resume: Your application needs to use the SessionService to either create_session (for a new chat) or use an existing session id.

Context Provided: The Runner gets the appropriate Session object from the appropriate service method, providing the agent with access to the corresponding Session's state and events.

Agent Processing: The user prompts the agent with a query. The agent analyzes the query and potentially the session state and events history to determine the response.

Response & State Update: The agent generates a response (and potentially flags data to be updated in the state). The Runner packages this as an Event.

Save Interaction: The Runner calls sessionService.append_event(session, event) with the session and the new event as the arguments. The service adds the Event to the history and updates the session's state in storage based on information within the event. The session's last_update_time also get updated.

Ready for Next: The agent's response goes to the user. The updated Session is now stored by the SessionService, ready for the next turn (which restarts the cycle at step 1, usually with the continuation of the conversation in the current session).

End Conversation: When the conversation is over, your application calls sessionService.delete_session(...) to clean up the stored session data if it is no longer required.

 

3. Context
Agents often need more than just the latest user message to perform well. In the Agent Development Kit (ADK), "context" refers to the crucial bundle of information available to your agent and its tools during specific operations. Agents are stateless by default. Without context, an agent wouldn't remember that you asked for "coffee" three messages ago.Context allws agents to maintain/read/write state, pass data, and access services (files).

Use cases of using context: 

Accessing information - You'll frequently need to read information stored within the context.

Reading Session State: Access data saved in previous steps or user/app-level settings. Use dictionary-like access on the state property.

Accessing the Initial User Input: Refer back to the message that started the current invocation.

Managing State - State is crucial for memory and data flow. When you modify state using CallbackContext or ToolContext, the changes are automatically tracked and persisted by the framework

Updating User Preferences

Working with Artifacts:

Save the path or URI of the document, not the entire content, as an artifact.

Load the artifact to get the path/URI, read the actual document content using appropriate libraries, summarize, and return the result.

Different types of context are as follows: 

ADK provides four "flavors" of context. You generally don't choose which one to create; The Agent Development Kit (ADK) framework provides different contexts automatically depending on the execution environment, such as within a tool or a callback. 

InvocationContext
 Primarily used when the agent's core logic needs direct access to the overall session or services

Where Used: Received as the ctx argument directly within an agent's core implementation methods (_run_async_impl, _run_live_impl)

- InvocationContextPurpose: Provides access to the entire state of the current invocation. This is the most comprehensive context object.

Where you get it: Only inside the Agent's core logic (_run_async_impl).

Capabilities: It has access to the session object, the agent instance, all services (session_service, artifact_service), and control flags like end_invocation .

When to use: Use this when writing custom agent logic that needs to orchestrate the entire flow or stop the run manually.

Think of ctx as the "current environment" for your agent's specific run. When the system asks your agent to do work, it hands over this ctx object so the agent has access to everything it needs—memory, tools, user info, and services—for that specific request.

- Key Contents: Direct access to session (including state and events), the current agent instance, invocation_id, initial user_content, references to configured services (artifact_service, memory_service, session_service), and fields related to live/streaming modes.

- Use Case: Primarily used when the agent's core logic needs direct access to the overall session or services, though often state and artifact interactions are delegated to callbacks/tools which use their own contexts. Also used to control the invocation itself (e.g., setting ctx.end_invocation = True).

 



class MyAgent(BaseAgent):
    async def _run_async_impl(self, ctx: InvocationContext) -> AsyncGenerator[Event, None]:
        # Direct access example
        agent_name = ctx.agent.name
        session_id = ctx.session.id
        print(f"Agent {agent_name} running in session {session_id} for invocation {ctx.invocation_id}")
        # ... agent logic using ctx ...
        yield # ... event ...
More on ctx: 

What is ctx (InvocationContext)?

It is the comprehensive container that holds the entire state of the current user interaction . The framework creates it automatically when a run starts and passes it into your agent's _run_async_impl method.

2. What is inside ctx?
It gives your agent access to four critical things:

The Session (ctx.session): This is the memory. It holds the conversation history (events) and the variables (state) that persist across turns.

The Identity (ctx.agent, ctx.invocation_id): Tells the code which agent is running and the unique ID for this specific run.

The Services (ctx.session_service, ctx.artifact_service): Direct links to the backend systems that save data to databases or Google Cloud Storage.

Control Flags: You can set ctx.end_invocation = True to force the entire workflow to stop immediately.

 

ReadonlyContext
Where Used: Provided in scenarios where only read access to basic information is needed and mutation is disallowed (e.g., InstructionProvider functions). It's also the base class for other contexts.

InstructionProvider functions in the Agent Development Kit (ADK) are callback functions that dynamically generate agent instructions at runtime, allowing system prompts to change per interaction. They receive a ReadonlyContext to access current session state or user input, enabling highly contextual behaviors. 

Purpose: Offers a safe, read-only view of fundamental contextual details.

Key Contents: invocation_id, agent_name, and a read-only view of the current state.



# Pseudocode: Instruction provider receiving ReadonlyContext
from google.adk.agents.readonly_context import ReadonlyContext
def my_instruction_provider(context: ReadonlyContext) -> str:
    # Read-only access example
    user_tier = context.state().get("user_tier", "standard") # Can read state
    # context.state['new_key'] = 'value' # This would typically cause an error or be ineffective
    return f"Process the request for a {user_tier} user."
 

CallbackContext
This view is for "Guardrails" and "Hooks."



# Pseudocode: Callback receiving CallbackContext
from google.adk.agents.callback_context import CallbackContext
from google.adk.models import LlmRequest
from google.genai import types
from typing import Optional
def my_before_model_cb(callback_context: CallbackContext, request: LlmRequest) -> Optional[types.Content]:
    # Read/Write state example
    call_count = callback_context.state.get("model_calls", 0)
    callback_context.state["model_calls"] = call_count + 1 # Modify state
    # Optionally load an artifact
    # config_part = callback_context.load_artifact("model_config.json")
    print(f"Preparing model call #{call_count + 1} for invocation {callback_context.invocation_id}")
    return None # Allow model call to proceed
Where Used: Passed as callback_context to agent lifecycle callbacks (before_agent_callback, after_agent_callback) and model interaction callbacks (before_model_callback, after_model_callback).

Purpose: Facilitates inspecting and modifying state, interacting with artifacts, and accessing invocation details specifically within callbacks.

Key Capabilities (Adds to ReadonlyContext):

Mutable state Property: Allows reading and writing to session state. Changes made here (callback_context.state['key'] = value) are tracked and associated with the event generated by the framework after the callback.

Artifact Methods: load_artifact(filename) and save_artifact(filename, part) methods for interacting with the configured artifact_service.

Direct user_content access.

 

 ToolContext
Where Used: Passed as tool_context to the functions backing FunctionTools and to tool execution callbacks (before_tool_callback, after_tool_callback).

Purpose: Provides everything CallbackContext does, plus specialized methods essential for tool execution, like handling authentication, searching memory, and listing artifacts.

Key Capabilities (Adds to CallbackContext):

Authentication Methods: request_credential(auth_config) to trigger an auth flow, and get_auth_response(auth_config) to retrieve credentials provided by the user/system.

Artifact Listing: list_artifacts() to discover available artifacts in the session.

Memory Search: search_memory(query) to query the configured memory_service.

function_call_id Property: Identifies the specific function call from the LLM that triggered this tool execution, crucial for linking authentication requests or responses back correctly.

actions Property: Direct access to the EventActions object for this step, allowing the tool to signal state changes, auth requests, etc.



# Pseudocode: Tool function receiving ToolContext
from google.adk.tools import ToolContext
from typing import Dict, Any
# Assume this function is wrapped by a FunctionTool
def search_external_api(query: str, tool_context: ToolContext) -> Dict[str, Any]:
    api_key = tool_context.state.get("api_key")
    if not api_key:
        # Define required auth config
        # auth_config = AuthConfig(...)
        # tool_context.request_credential(auth_config) # Request credentials
        # Use the 'actions' property to signal the auth request has been made
        # tool_context.actions.requested_auth_configs[tool_context.function_call_id] = auth_config
        return {"status": "Auth Required"}
    # Use the API key...
    print(f"Tool executing for query '{query}' using API key. Invocation: {tool_context.invocation_id}")
    # Optionally search memory or list artifacts
    # relevant_docs = tool_context.search_memory(f"info related to {query}")
    # available_files = tool_context.list_artifacts()
    return {"result": f"Data for {query} fetched."}
 

Context Type

Read State?

Write State?

Artifacts?

Auth/Memory?

Best For...

ReadonlyContext

✅ Yes

❌ No

❌ No

❌ No

Dynamic Instructions

CallbackContext

✅ Yes

✅ Yes

✅ Yes

❌ No

Guardrails & Logging

ToolContext

✅ Yes

✅ Yes

✅ Yes

✅ Yes

Building Tools

InvocationContext

✅ Yes

✅ Yes

✅ Yes

✅ Yes

Core Agent Logic

 

4. The "Hands" – Tools & MCP
Tools are how agents touch the outside world.

1. Function Tools
The standard way to build a tool. You write a Python function, add type hints and a docstring, and ADK converts it into a tool definition for the LLM .

Critical Requirement: The docstring MUST describe when to use the tool and what the parameters mean. The LLM relies on this.

2. McpToolset (Enterprise Data)
For enterprise systems, you use the Model Context Protocol (MCP).

Concept: Instead of writing tool code inside your bot, you connect to an external MCP Server (e.g., a "Salesforce MCP Server" or "Database MCP Server").

McpToolset: This is the bridge. You give it connection parameters (STDIO for local, SSE for remote), and it strictly handles the connection lifecycle .

Discovery: It automatically queries the MCP server for available tools (list_tools) and converts them into ADK tools dynamically.

3. ToolContext Features
When a tool runs, ADK injects a ToolContext object if you ask for it . This allows a tool to:

Read/Write State: tool_context.state['verified'] = True.

Handle Auth: tool_context.request_credential() triggers an OAuth flow if the user isn't logged in .

Control Flow: tool_context.actions.transfer_to_agent = "SupportAgent" allows a tool to force the conversation to switch to a different agent.

5. The Guardrails - Callback
Callbacks allow you to intercept execution before or after key steps. This is your safety net .

1. The Hook Points
before_model_callback: Runs right before the prompt is sent to the LLM.

Use Case: Check for PII (Personally Identifiable Information) in user input and block it.

before_tool_callback: Runs after the LLM decides to call a tool, but before the code executes.

Use Case: "The LLM wants to delete a file. Check if the user is an Admin first." .

after_model_callback: Runs after the LLM responds. Use it to sanitize output.

2. The Control Mechanism
Callbacks have power via their return value :

Return None: "Everything is fine, proceed as normal."

Return an Object (Override): "Stop! Don't call the LLM. Use this response instead." You can return a pre-canned LlmResponse or Event to bypass the actual execution.

 

6. Scale & Deployment
1. The App Container
The App class is a top-level container for an entire Agent Development Kit (ADK) agent workflow. It is designed to manage the lifecycle, configuration, and state for a collection of agents grouped by a root agent. The App class within the Agent Development Kit (ADK) addresses several architectural issues by providing a centralized, top-level container that manages the operational infrastructure of an agent workflow, separating it from the agents' core reasoning logic. 

The App class wraps your Root Agent. 

It provides centralized lifecycle management: Provides a single, centralized location for managing shared resources like API keys and database clients, avoiding the need to pass configuration down through every agent.

Resumability: The App class includes on startup and on shutdown hooks, which allow for reliable management of persistent resources such as database connection pools or in-memory caches that need to exist across multiple invocations.

Context Caching: You can configure context_cache_config to cache large prompts (like huge system instructions or documents) to save on inference costs .

2. Agent2Agent (A2A)
This is for Multi-Agent Systems that span across networks.

to_a2a(agent): Takes a local agent and automatically generates an "Agent Card" (metadata description) and an API endpoint, effectively turning it into a microservice .

RemoteA2aAgent: A client that connects to a remote A2A agent. It reads the remote Agent Card to understand what the remote agent can do.

 

 

 

 