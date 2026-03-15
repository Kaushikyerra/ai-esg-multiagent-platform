# 🌿 GreenOps AI: Multi-Agent ESG Platform

GreenOps AI is a state-of-the-art multi-agent platform designed to optimize cloud deployments for **Sustainability (ESG)** and **Cost-Efficiency**. It uses specialized AI agents to analyze CI/CD pipelines and provide real-time ratings for Carbon Footprint, Cost Impact, and Deployment Risk.

## 🚀 Core Features

- **Multi-Agent Orchestration**: Parallel execution of Carbon Estimator, Cost Calculator, Risk Scorer, and Policy Enforcer agents.
- **Sustainability First**: Real-time CO2 emission estimates based on cloud region and compute size.
- **Cost Optimization**: Detailed cost breakdown and proactive savings recommendations.
- **Production-Ready Base**: Built with FastAPI, Dockerized, and integrated with Azure OpenAI.
- **Self-Healing Infrastructure**: Integrated health checks and auto-recovery rules for maximum uptime.

## 🛠️ Technology Stack

- **Backend**: Python 3.11+, FastAPI, Pydantic
- **AI**: Azure OpenAI (GPT-4o)
- **Containerization**: Docker
- **Cloud**: Azure Container Apps, Azure Container Registry
- **CI/CD**: GitHub Actions

## 🚦 Quick Start

### 1. Prerequisites
- Docker Installed
- Azure CLI (optional for local deployment)
- Python 3.11+

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
PORT=8000
```

### 3. Run with Docker
```bash
docker build -t greenops-ai .
docker run -p 8000:8000 --env-file .env greenops-ai
```

### 4. Direct Run
```bash
pip install -r requirements.txt
python orchestrator/main.py
```

## 📊 API Usage

### Analyze Pipeline
**POST** `/analyze`
```json
{
  "pipeline_config": "name: CI...",
  "pipeline_type": "github_actions",
  "region": "azure_eastus"
}
```

---

*Built for the GreenOps AI Hackathon 2026.*
