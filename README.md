# 🌱 GreenOps AI - Agentic DevOps Intelligence System

**AI Dev Days Hackathon - Challenge 2: Automate and Optimize Software Delivery**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Azure](https://img.shields.io/badge/Azure-OpenAI-0078D4.svg)](https://azure.microsoft.com/en-us/products/ai-services/openai-service)

> Automate and optimize software delivery with AI-powered carbon, cost, and risk analysis

## 🎯 Problem Statement

Modern DevOps pipelines lack visibility into their environmental and financial impact. Teams deploy without understanding:
- 🌍 Carbon footprint of deployments
- 💰 True cost implications
- ⚠️ Risk factors and potential failures
- 📋 Compliance and governance status

## 💡 Solution

GreenOps AI is a multi-agent system that analyzes CI/CD pipelines in real-time and provides:
- **Carbon Impact Analysis**: Calculate CO₂ emissions per deployment
- **Cost Optimization**: Estimate and optimize cloud spending
- **Risk Assessment**: Score deployment risk based on pipeline patterns
- **Policy Enforcement**: Automated governance gates (approve/warn/block)
- **Executive Reporting**: Compliance-ready dashboards

## 🏗️ Architecture

### Multi-Agent System
```
Pipeline Config → Orchestrator → [6 Parallel Agents] → Policy Decision
                                      ↓
                    ┌─────────────────┼─────────────────┐
                    ↓                 ↓                 ↓
            Pipeline Analyzer   Carbon Estimator   Cost Calculator
                    ↓                 ↓                 ↓
              Risk Scorer      Policy Enforcer   Report Generator
```

### Core Agents
1. **Pipeline Analyzer**: Parses CI/CD configs (GitHub Actions, Azure DevOps)
2. **Carbon Estimator**: Calculates carbon footprint based on compute resources
3. **Cost Calculator**: Estimates deployment costs across cloud providers
4. **Risk Scorer**: Analyzes deployment risk using pattern detection
5. **Policy Enforcer**: Validates against governance rules
6. **Report Generator**: Creates executive-ready compliance reports

### Tech Stack (ONLY Microsoft Tools)
- **AI Platform**: Microsoft Agent Framework, Azure OpenAI (GPT-4)
- **Backend**: Python 3.11+, FastAPI
- **Cloud**: Azure Container Apps, Azure Container Registry
- **CI/CD**: GitHub Actions (Microsoft-owned)
- **Infrastructure**: Azure Bicep templates

**Hackathon Compliance**: Uses ONLY Microsoft tools as required by AI Dev Days Hackathon 2026

## 🚀 Quick Start with Microsoft Agent Framework

### Step 1: Install Microsoft Agent Framework
```bash
cd ai-esg-multiagent-platform
venv\Scripts\activate

# Run setup script
setup_maf.bat

# Or manually
pip install agent-framework --pre
pip install azure-ai-openai azure-identity
pip install -r requirements.txt
```

### Step 2: Configure Azure OpenAI
```bash
# Edit .env file with your Azure OpenAI credentials
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

### Step 3: Run & Test
```bash
# Start server (Microsoft Agent Framework)
python orchestrator/main_maf.py

# Test (in another terminal)
python test_api.py
```

### Step 4: Daily Git Commit
```bash
# Use daily commit script
daily_commit.bat
```

## 📊 Demo

### API Example
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d @examples/sample_request.json
```

### Response
```json
{
  "summary": {
    "decision": "APPROVED",
    "carbon_rating": "B",
    "cost_rating": "B",
    "risk_level": "LOW"
  },
  "carbon_analysis": {
    "co2_kg": 0.156,
    "trees_equivalent_per_year": 0.0027
  },
  "cost_analysis": {
    "total_cost_usd": 0.26,
    "monthly_projection_usd": 7.70
  }
}
```

## 👥 Team Structure

| Member | Role | Responsibilities |
|--------|------|------------------|
| Member 1 | Backend/Agents | Agent implementation, orchestration |
| Member 2 | Frontend | Dashboard, visualizations, reporting |
| Member 3 | Documentation | Testing, docs, user guides |
| Member 4 | Cloud/DevOps | Azure deployment, CI/CD, infrastructure |

## 📁 Project Structure

```
greenops-ai/
├── orchestrator/          # Main application
│   ├── agents/           # Multi-agent system
│   ├── main.py           # FastAPI server
│   └── config.py         # Configuration
├── deploy/               # Azure deployment
├── frontend/             # Dashboard (Member 2)
├── tests/                # Test suite (Member 3)
├── docs/                 # Documentation
└── examples/             # Sample pipelines
```

## 🎯 Key Features

- ✅ Real-time pipeline analysis
- ✅ Multi-cloud support (Azure, AWS, GCP)
- ✅ Automated policy gates
- ✅ Carbon and cost ratings (A-F scale)
- ✅ Monthly cost projections
- ✅ Actionable optimization recommendations
- ✅ Executive-ready reports

## 📈 Business Impact

- 🌱 **Sustainability**: Reduce carbon emissions by 20-40%
- 💰 **Cost Savings**: Optimize cloud spending by 15-30%
- 🛡️ **Risk Reduction**: Prevent production incidents
- 📋 **Compliance**: Automated governance and audit trails
- 🚀 **Developer Experience**: Fast feedback on pipeline quality

## 📚 Documentation

**→ [📖 Complete Documentation Index](INDEX.md)** - Find everything you need!

### Quick Links
- [🚀 Get Started](GET_STARTED.md) - 5-minute quick start
- [⚙️ Setup Guide](SETUP.md) - Detailed setup instructions
- [🏗️ Architecture](ARCHITECTURE.md) - System design and architecture
- [📋 API Documentation](docs/API.md) - API reference
- [🎬 Demo Script](DEMO_SCRIPT.md) - Hackathon demo guide
- [👥 Team Tasks](TEAM_TASKS.md) - Task distribution
- [☁️ Azure Deployment](deploy/AZURE_DEPLOYMENT.md) - Cloud deployment guide
- [📊 Project Summary](SUMMARY.md) - Complete overview

## 🧪 Testing

```bash
# Run all tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=orchestrator --cov-report=html

# Specific test
pytest tests/test_agents.py::test_pipeline_analyzer -v
```

## ☁️ Azure Deployment

```bash
# Deploy to Azure
cd deploy
chmod +x deploy.sh
./deploy.sh

# Or use GitHub Actions
git push origin main  # Triggers azure-deploy.yaml
```

## 🤝 Contributing

This is a hackathon project. For team members:
1. Check [TEAM_TASKS.md](TEAM_TASKS.md) for your assignments
2. Create feature branches: `feature/your-feature`
3. Submit PRs for review
4. Keep commits focused and descriptive

## 📝 License

MIT License - see LICENSE file for details

## 🏆 Hackathon

**Event**: AI Dev Days Hackathon  
**Challenge**: Automate and Optimize Software Delivery  
**Team**: 4 members  
**Tech**: Microsoft AI Platform (Azure OpenAI, Semantic Kernel)

---

Built with ❤️ for sustainable DevOps
