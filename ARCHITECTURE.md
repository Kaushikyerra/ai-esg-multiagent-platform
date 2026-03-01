# GreenOps AI - Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         GreenOps AI                              │
│              Agentic DevOps Intelligence System                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   CI/CD      │         │   Frontend   │         │   External   │
│   Platform   │────────▶│   Dashboard  │◀────────│   Systems    │
│              │         │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
                                │
                                │ HTTPS
                                ▼
                    ┌───────────────────────┐
                    │   FastAPI Server      │
                    │   (Orchestrator)      │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
        ┌──────────────────┐    ┌──────────────────┐
        │  Agent Manager   │    │  Policy Engine   │
        └──────────────────┘    └──────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│Pipeline  │ │ Carbon   │ │  Cost    │
│Analyzer  │ │Estimator │ │Calculator│
└──────────┘ └──────────┘ └──────────┘
        │           │           │
        ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Risk    │ │ Policy   │ │ Report   │
│ Scorer   │ │Enforcer  │ │Generator │
└──────────┘ └──────────┘ └──────────┘
        │           │           │
        └───────────┼───────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │   Azure OpenAI       │
        │   (GPT-4)            │
        └──────────────────────┘
```

## Component Architecture

### 1. API Layer
```
┌─────────────────────────────────────────┐
│         FastAPI Application             │
├─────────────────────────────────────────┤
│  Endpoints:                             │
│  • GET  /                               │
│  • GET  /health                         │
│  • POST /analyze                        │
├─────────────────────────────────────────┤
│  Middleware:                            │
│  • CORS                                 │
│  • Logging                              │
│  • Error Handling                       │
└─────────────────────────────────────────┘
```

### 2. Agent System
```
┌─────────────────────────────────────────┐
│          Base Agent (Abstract)          │
├─────────────────────────────────────────┤
│  • analyze(context) → result            │
│  • log_analysis(result)                 │
└─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│Pipeline  │ │ Carbon   │ │  Cost    │
│Analyzer  │ │Estimator │ │Calculator│
├──────────┤ ├──────────┤ ├──────────┤
│Parse YAML│ │Calculate │ │Estimate  │
│Extract   │ │CO2       │ │costs     │
│metrics   │ │emissions │ │breakdown │
└──────────┘ └──────────┘ └──────────┘
        │           │           │
        ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Risk    │ │ Policy   │ │ Report   │
│ Scorer   │ │Enforcer  │ │Generator │
├──────────┤ ├──────────┤ ├──────────┤
│Analyze   │ │Validate  │ │Create    │
│risk      │ │policies  │ │reports   │
│factors   │ │gates     │ │          │
└──────────┘ └──────────┘ └──────────┘
```

### 3. Data Flow
```
1. Request Received
   │
   ▼
2. Pipeline Analyzer
   │ (Parse config, extract metrics)
   ▼
3. Parallel Analysis
   ├─▶ Carbon Estimator (CO2 calculation)
   ├─▶ Cost Calculator (Cost estimation)
   └─▶ Risk Scorer (Risk assessment)
   │
   ▼
4. Policy Enforcer
   │ (Validate against rules)
   ▼
5. Report Generator
   │ (Compile results)
   ▼
6. Response Returned
```

## Azure Infrastructure

```
┌─────────────────────────────────────────────────────────┐
│                    Azure Cloud                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────┐     │
│  │     Container Apps Environment               │     │
│  │  ┌────────────────────────────────────┐     │     │
│  │  │   GreenOps AI Container App        │     │     │
│  │  │  ┌──────────────────────────┐     │     │     │
│  │  │  │  FastAPI Server          │     │     │     │
│  │  │  │  + Multi-Agent System    │     │     │     │
│  │  │  └──────────────────────────┘     │     │     │
│  │  │                                    │     │     │
│  │  │  Scaling: 1-5 replicas            │     │     │
│  │  │  CPU: 0.5 cores                   │     │     │
│  │  │  Memory: 1 GB                     │     │     │
│  │  └────────────────────────────────────┘     │     │
│  └──────────────────────────────────────────────┘     │
│                        │                               │
│                        │                               │
│  ┌─────────────────────┼────────────────────────┐     │
│  │                     │                        │     │
│  ▼                     ▼                        ▼     │
│  ┌──────────┐   ┌──────────┐   ┌──────────────┐     │
│  │Container │   │   Log    │   │ Application  │     │
│  │Registry  │   │Analytics │   │  Insights    │     │
│  │          │   │          │   │              │     │
│  │ Docker   │   │ Logs &   │   │ Monitoring & │     │
│  │ Images   │   │ Queries  │   │ Telemetry    │     │
│  └──────────┘   └──────────┘   └──────────────┘     │
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │         Azure OpenAI Service                 │   │
│  │  ┌────────────────────────────────────┐     │   │
│  │  │  GPT-4 Deployment                  │     │   │
│  │  │  • Model: gpt-4                    │     │   │
│  │  │  • API Version: 2024-02-15         │     │   │
│  │  └────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────┘   │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## Request/Response Flow

### Analyze Pipeline Request
```
┌─────────────────────────────────────────────────────────┐
│ 1. Client Request                                       │
├─────────────────────────────────────────────────────────┤
│ POST /analyze                                           │
│ {                                                       │
│   "pipeline_config": "...",                            │
│   "pipeline_type": "github_actions",                   │
│   "region": "azure_eastus"                             │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Pipeline Analyzer                                    │
├─────────────────────────────────────────────────────────┤
│ • Parse YAML configuration                              │
│ • Extract jobs and steps                               │
│ • Estimate duration                                     │
│ • Determine compute size                               │
│ • Detect deployment/tests                              │
└─────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 3a. Carbon   │ │ 3b. Cost     │ │ 3c. Risk     │
│  Estimator   │ │  Calculator  │ │  Scorer      │
├──────────────┤ ├──────────────┤ ├──────────────┤
│• Power calc  │ │• Compute cost│ │• Test check  │
│• CO2 calc    │ │• Storage cost│ │• Complexity  │
│• Rating      │ │• Network cost│ │• Duration    │
│              │ │• Rating      │ │• Rating      │
└──────────────┘ └──────────────┘ └──────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Policy Enforcer                                      │
├─────────────────────────────────────────────────────────┤
│ • Check carbon limits                                   │
│ • Check cost limits                                     │
│ • Check risk thresholds                                │
│ • Determine decision (APPROVED/BLOCKED/WARNING)        │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Response                                             │
├─────────────────────────────────────────────────────────┤
│ {                                                       │
│   "status": "success",                                 │
│   "pipeline_analysis": {...},                          │
│   "carbon_analysis": {...},                            │
│   "cost_analysis": {...},                              │
│   "risk_analysis": {...},                              │
│   "policy_decision": {...},                            │
│   "summary": {                                         │
│     "decision": "APPROVED",                            │
│     "carbon_rating": "B",                              │
│     "cost_rating": "B",                                │
│     "risk_level": "LOW"                                │
│   }                                                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Development                            │
├─────────────────────────────────────────────────────────┤
│  Local Machine                                          │
│  • Python 3.11+                                         │
│  • Virtual Environment                                  │
│  • FastAPI Dev Server                                   │
│  • Port 8000                                            │
└─────────────────────────────────────────────────────────┘
                        │
                        │ git push
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  GitHub                                 │
├─────────────────────────────────────────────────────────┤
│  Repository                                             │
│  • Source Code                                          │
│  • GitHub Actions                                       │
│  • CI/CD Pipeline                                       │
└─────────────────────────────────────────────────────────┘
                        │
                        │ trigger
                        ▼
┌─────────────────────────────────────────────────────────┐
│              GitHub Actions                             │
├─────────────────────────────────────────────────────────┤
│  Workflow Steps:                                        │
│  1. Checkout code                                       │
│  2. Run tests                                           │
│  3. Build Docker image                                  │
│  4. Push to Azure Container Registry                    │
│  5. Deploy to Azure Container Apps                      │
└─────────────────────────────────────────────────────────┘
                        │
                        │ deploy
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Production (Azure)                     │
├─────────────────────────────────────────────────────────┤
│  Container Apps                                         │
│  • Auto-scaling (1-5 replicas)                         │
│  • Load balancing                                       │
│  • HTTPS ingress                                        │
│  • Health checks                                        │
│  • Monitoring                                           │
└─────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Security Layers                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Network Security                                    │
│     • HTTPS only                                        │
│     • CORS configuration                                │
│     • Azure managed ingress                             │
│                                                         │
│  2. Authentication & Authorization                      │
│     • Azure AD integration (optional)                   │
│     • API key validation                                │
│     • Role-based access control                         │
│                                                         │
│  3. Secrets Management                                  │
│     • Azure Key Vault                                   │
│     • Container App secrets                             │
│     • Environment variables                             │
│                                                         │
│  4. Data Security                                       │
│     • No pipeline code stored                           │
│     • Encrypted in transit                              │
│     • Encrypted at rest                                 │
│                                                         │
│  5. Monitoring & Auditing                              │
│     • Application Insights                              │
│     • Log Analytics                                     │
│     • Audit trails                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Scalability Design

```
┌─────────────────────────────────────────────────────────┐
│              Horizontal Scaling                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Low Load (1 replica)                                   │
│  ┌──────────────┐                                      │
│  │  Container 1 │                                      │
│  └──────────────┘                                      │
│                                                         │
│  Medium Load (3 replicas)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │  Container 1 │  │  Container 2 │  │  Container 3 ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                         │
│  High Load (5 replicas)                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │  Container 1 │  │  Container 2 │  │  Container 3 ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│  ┌──────────────┐  ┌──────────────┐                  │
│  │  Container 4 │  │  Container 5 │                  │
│  └──────────────┘  └──────────────┘                  │
│                                                         │
│  Auto-scaling triggers:                                │
│  • HTTP concurrency > 50                               │
│  • CPU > 70%                                           │
│  • Memory > 80%                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                  Technology Layers                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend (Member 2)                                    │
│  ├─ React / Next.js                                    │
│  ├─ TypeScript                                         │
│  ├─ Tailwind CSS                                       │
│  └─ Recharts / Chart.js                                │
│                                                         │
│  Backend (Member 1)                                     │
│  ├─ Python 3.11+                                       │
│  ├─ FastAPI                                            │
│  ├─ Pydantic                                           │
│  ├─ PyYAML                                             │
│  └─ Asyncio                                            │
│                                                         │
│  AI/ML                                                  │
│  ├─ Azure OpenAI (GPT-4)                               │
│  ├─ Semantic Kernel                                    │
│  └─ Custom agent framework                             │
│                                                         │
│  Infrastructure (Member 4)                              │
│  ├─ Azure Container Apps                               │
│  ├─ Azure Container Registry                           │
│  ├─ Azure Bicep (IaC)                                  │
│  ├─ Docker                                             │
│  └─ Azure CLI                                          │
│                                                         │
│  Testing (Member 3)                                     │
│  ├─ Pytest                                             │
│  ├─ Pytest-asyncio                                     │
│  ├─ Pytest-cov                                         │
│  └─ Black / Flake8                                     │
│                                                         │
│  CI/CD                                                  │
│  ├─ GitHub Actions                                     │
│  ├─ Docker Build                                       │
│  └─ Azure Deployment                                   │
│                                                         │
│  Monitoring                                             │
│  ├─ Azure Application Insights                         │
│  ├─ Azure Log Analytics                                │
│  └─ Azure Monitor                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Future Enhancements

```
┌─────────────────────────────────────────────────────────┐
│              Roadmap                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Phase 1 (Current)                                      │
│  ✅ Multi-agent system                                  │
│  ✅ Basic analysis                                      │
│  ✅ Azure deployment                                    │
│                                                         │
│  Phase 2 (Next)                                         │
│  □ Historical tracking                                  │
│  □ ML predictions                                       │
│  □ More CI/CD platforms                                │
│  □ Slack/Teams integration                             │
│                                                         │
│  Phase 3 (Future)                                       │
│  □ Multi-tenant SaaS                                    │
│  □ Industry benchmarking                               │
│  □ Advanced analytics                                   │
│  □ Mobile app                                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**This architecture is designed for:**
- ⚡ Performance (< 2s response time)
- 📈 Scalability (auto-scaling)
- 🔒 Security (enterprise-grade)
- 🛠️ Maintainability (clean code)
- 🚀 Extensibility (plugin architecture)
