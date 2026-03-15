# 🌿 GreenOps AI: Multi-Agent ESG Platform

> AI Dev Days Hackathon 2026 — Microsoft Agent Framework

GreenOps AI is a multi-agent DevOps intelligence platform that analyzes CI/CD pipelines for **carbon footprint**, **cost efficiency**, **deployment risk**, and **downtime prevention** — all powered by Azure OpenAI GPT-4o and the Microsoft Agent Framework.

---

## 🤖 The 6 Agents

| Agent | Role |
|---|---|
| Pipeline Analyzer | Parses pipeline config — jobs, steps, compute size, duration |
| Carbon Estimator | Estimates CO2 emissions based on compute + region carbon intensity |
| Cost Calculator | Calculates deployment cost and monthly projection |
| Risk Scorer | Scores deployment risk (0–100) across multiple risk factors |
| Downtime Prevention | Predicts downtime probability and recommends preventative measures |
| Policy Enforcer | Makes final APPROVED / WARNING / BLOCKED decision |

All agents run on **Microsoft Agent Framework** with **Azure OpenAI GPT-4o** for AI-enhanced insights.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.11+, FastAPI, Microsoft Agent Framework
- **AI**: Azure OpenAI GPT-4o (`2025-01-01-preview`)
- **Database**: Azure Table Storage (`greenopsstore` / `analyses` table)
- **Containerization**: Docker
- **Cloud**: Azure Container Apps, Azure Container Registry
- **CI/CD**: GitHub Actions

---

## 🚦 Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```env
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_API_VERSION=2025-01-01-preview
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_STORAGE_TABLE_NAME=analyses
PORT=8000
```

### 2. Run locally

```bash
pip install -r requirements.txt
python orchestrator/main_maf.py
```

Then open: `http://localhost:8000/docs`

### 3. Run with Docker

```bash
docker build -t greenops-ai .
docker run -p 8000:8000 --env-file .env greenops-ai
```

---

## 📊 API Endpoints

### `POST /analyze`
Runs all 6 agents on a pipeline config. Returns full ESG + downtime analysis.

```json
{
  "pipeline_config": "name: My Pipeline\n...",
  "pipeline_type": "github_actions",
  "region": "azure_eastus"
}
```

**Response includes:**
- `pipeline_analysis` — jobs, steps, compute size, duration
- `carbon_analysis` — CO2 kg, rating (A–F)
- `cost_analysis` — total cost USD, monthly projection, rating
- `risk_analysis` — risk score 0–100, risk factors
- `downtime_analysis` — downtime probability, risk score, preventative measures, cost implications
- `policy_decision` — APPROVED / WARNING / BLOCKED with violations and warnings
- `summary` — quick-access fields for all key metrics

### `GET /history`
Returns last 50 analyses from Azure Table Storage.

### `GET /stats`
Returns aggregate stats — total analyses, average CO2, average cost, decision breakdown.

### `POST /report`
Returns a full HTML compliance report for a pipeline.

### `GET /health`
Health check — confirms all 6 agents are ready and database is connected.

---

## 🧪 Tests

```bash
# Full 3-scenario integration test (APPROVED / WARNING / BLOCKED)
python tests/test_agents.py

# Downtime agent unit tests (4 tests)
python tests/test_downtime_agent.py
```

Expected: **3/3** scenarios + **4/4** unit tests passing.

---

## 📁 Project Structure

```
orchestrator/
  main_maf.py              # FastAPI app + agent orchestration
  config.py                # Azure config (OpenAI, Storage)
  database.py              # Azure Table Storage integration
  agents/
    maf_base_agent.py      # Base class with Azure OpenAI client
    maf_pipeline_analyzer.py
    maf_carbon_estimator.py
    maf_cost_calculator.py
    maf_risk_scorer.py
    maf_downtime_agent.py  # Downtime Prevention Agent
    maf_policy_enforcer.py
frontend/                  # React + Tailwind dashboard (teammate)
tests/
  test_agents.py           # 3-scenario integration tests
  test_downtime_agent.py   # Downtime agent unit tests
deploy/                    # Azure deployment scripts (Bicep, PowerShell)
```

---

*Built for AI Dev Days Hackathon 2026 using only Microsoft tools.*
