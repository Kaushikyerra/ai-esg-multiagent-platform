# 📚 GreenOps AI - Documentation Index

Welcome to GreenOps AI! This index will help you find exactly what you need.

## 🚀 Getting Started

### First Time Here?
1. **[GET_STARTED.md](GET_STARTED.md)** - Start here! 5-minute quick start
2. **[README.md](README.md)** - Project overview and features
3. **[SUMMARY.md](SUMMARY.md)** - Complete project summary

### Setup Guides
- **[SETUP.md](SETUP.md)** - Detailed setup instructions (all platforms)
- **[WINDOWS_SETUP.md](WINDOWS_SETUP.md)** - Windows-specific guide
- **[quickstart.sh](quickstart.sh)** - Automated setup (Linux/Mac)
- **[quickstart.bat](quickstart.bat)** - Automated setup (Windows)

---

## 👥 Team Documentation

### For All Members
- **[TEAM_TASKS.md](TEAM_TASKS.md)** - Task distribution and responsibilities
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Code organization
- **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)** - Pre-demo checklist

### Member 1: Backend/Agents
**Your Focus**: Agent implementation and orchestration

**Key Files**:
- `orchestrator/agents/` - Agent implementations
- `orchestrator/main.py` - FastAPI server
- `orchestrator/config.py` - Configuration

**Documentation**:
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [docs/API.md](docs/API.md) - API reference
- [tests/test_agents.py](tests/test_agents.py) - Test examples

### Member 2: Frontend
**Your Focus**: Dashboard and visualizations

**Key Files**:
- `frontend/` - Your workspace
- `frontend/README.md` - Frontend setup guide
- `frontend/sample-component.tsx` - React example

**Documentation**:
- [docs/API.md](docs/API.md) - API endpoints to integrate
- [examples/sample_request.json](examples/sample_request.json) - Request format

### Member 3: Testing & Documentation
**Your Focus**: Tests and docs

**Key Files**:
- `tests/` - Test suite
- `docs/` - Documentation
- All `*.md` files - Documentation to maintain

**Documentation**:
- [tests/test_agents.py](tests/test_agents.py) - Test examples
- [TEAM_TASKS.md](TEAM_TASKS.md) - Your specific tasks

### Member 4: Cloud/DevOps (You!)
**Your Focus**: Azure deployment and infrastructure

**Key Files**:
- `deploy/` - Deployment scripts and templates
- `Dockerfile` - Container definition
- `.github/workflows/` - CI/CD pipelines

**Documentation**:
- [deploy/AZURE_DEPLOYMENT.md](deploy/AZURE_DEPLOYMENT.md) - Complete Azure guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Infrastructure architecture

---

## 🛠️ Development

### Code Documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - File organization
- **[docs/API.md](docs/API.md)** - API reference

### Configuration
- **[.env.example](.env.example)** - Environment variables template
- **[orchestrator/config.py](orchestrator/config.py)** - App configuration
- **[requirements.txt](requirements.txt)** - Python dependencies

### Testing
- **[tests/test_agents.py](tests/test_agents.py)** - Unit tests
- **[test_api.py](test_api.py)** - Quick API test script
- **[examples/](examples/)** - Sample data

---

## ☁️ Deployment

### Azure Deployment
- **[deploy/AZURE_DEPLOYMENT.md](deploy/AZURE_DEPLOYMENT.md)** - Complete Azure guide
- **[deploy/deploy.sh](deploy/deploy.sh)** - Deployment script
- **[deploy/azure-resources.bicep](deploy/azure-resources.bicep)** - Infrastructure as Code

### Docker
- **[Dockerfile](Dockerfile)** - Container definition
- Build: `docker build -t greenops-ai .`
- Run: `docker run -p 8000:8000 --env-file .env greenops-ai`

### CI/CD
- **[.github/workflows/ci.yaml](.github/workflows/ci.yaml)** - CI pipeline
- **[.github/workflows/azure-deploy.yaml](.github/workflows/azure-deploy.yaml)** - Deployment pipeline

---

## 🎯 Demo & Presentation

### Demo Materials
- **[DEMO_SCRIPT.md](DEMO_SCRIPT.md)** - 5-minute demo flow
- **[PRESENTATION.md](PRESENTATION.md)** - Slide deck outline
- **[HACKATHON.md](HACKATHON.md)** - Hackathon submission document

### Preparation
- **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)** - Pre-demo checklist
- **[examples/sample_pipeline.yaml](examples/sample_pipeline.yaml)** - Demo pipeline
- **[test_api.py](test_api.py)** - Quick demo script

---

## 📖 Reference

### API Documentation
- **[docs/API.md](docs/API.md)** - Complete API reference
- **[examples/sample_request.json](examples/sample_request.json)** - Request example
- **[examples/sample_pipeline.yaml](examples/sample_pipeline.yaml)** - Pipeline example

### Architecture
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Code structure
- **[SUMMARY.md](SUMMARY.md)** - Project summary

---

## 🆘 Troubleshooting

### Setup Issues
- **[WINDOWS_SETUP.md](WINDOWS_SETUP.md)** - Windows-specific issues
- **[SETUP.md](SETUP.md)** - General setup problems
- **[GET_STARTED.md](GET_STARTED.md)** - Quick fixes

### Deployment Issues
- **[deploy/AZURE_DEPLOYMENT.md](deploy/AZURE_DEPLOYMENT.md)** - Azure troubleshooting
- Check logs: `az containerapp logs show --name greenops-ai --resource-group greenops-rg`

### Development Issues
- Activate venv: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)
- Install deps: `pip install -r requirements.txt`
- Check tests: `pytest tests/ -v`

---

## 📋 Quick Reference

### Common Commands

#### Local Development
```bash
# Setup
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run
python orchestrator/main.py

# Test
python test_api.py
pytest tests/ -v
```

#### Docker
```bash
# Build
docker build -t greenops-ai .

# Run
docker run -p 8000:8000 --env-file .env greenops-ai

# Test
curl http://localhost:8000/health
```

#### Azure
```bash
# Login
az login

# Deploy
cd deploy && ./deploy.sh

# Check status
az containerapp show --name greenops-ai --resource-group greenops-rg

# View logs
az containerapp logs show --name greenops-ai --resource-group greenops-rg --follow
```

---

## 📁 File Structure

```
greenops-ai/
├── 📄 Documentation (You are here!)
│   ├── INDEX.md (this file)
│   ├── README.md
│   ├── GET_STARTED.md
│   ├── SETUP.md
│   ├── WINDOWS_SETUP.md
│   ├── SUMMARY.md
│   ├── ARCHITECTURE.md
│   ├── PROJECT_STRUCTURE.md
│   ├── TEAM_TASKS.md
│   ├── DEMO_SCRIPT.md
│   ├── PRESENTATION.md
│   ├── HACKATHON.md
│   └── LAUNCH_CHECKLIST.md
│
├── 🔧 Configuration
│   ├── .env.example
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .gitignore
│
├── 💻 Source Code
│   ├── orchestrator/
│   │   ├── main.py
│   │   ├── config.py
│   │   └── agents/
│   ├── tests/
│   └── test_api.py
│
├── ☁️ Deployment
│   ├── deploy/
│   │   ├── AZURE_DEPLOYMENT.md
│   │   ├── deploy.sh
│   │   └── azure-resources.bicep
│   └── .github/workflows/
│
├── 🎨 Frontend
│   └── frontend/
│       ├── README.md
│       └── sample-component.tsx
│
├── 📚 Documentation
│   └── docs/
│       └── API.md
│
└── 📦 Examples
    └── examples/
        ├── sample_pipeline.yaml
        └── sample_request.json
```

---

## 🎯 Quick Navigation

### I want to...

**...get started quickly**
→ [GET_STARTED.md](GET_STARTED.md)

**...set up my environment**
→ [SETUP.md](SETUP.md) or [WINDOWS_SETUP.md](WINDOWS_SETUP.md)

**...understand the architecture**
→ [ARCHITECTURE.md](ARCHITECTURE.md)

**...see my team tasks**
→ [TEAM_TASKS.md](TEAM_TASKS.md)

**...deploy to Azure**
→ [deploy/AZURE_DEPLOYMENT.md](deploy/AZURE_DEPLOYMENT.md)

**...prepare for demo**
→ [DEMO_SCRIPT.md](DEMO_SCRIPT.md) + [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)

**...understand the API**
→ [docs/API.md](docs/API.md)

**...run tests**
→ [tests/test_agents.py](tests/test_agents.py)

**...see code structure**
→ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

**...get project summary**
→ [SUMMARY.md](SUMMARY.md)

---

## 🔍 Search Tips

### By Role
- **Backend Developer**: Search for "agent", "API", "FastAPI"
- **Frontend Developer**: Search for "React", "dashboard", "component"
- **DevOps Engineer**: Search for "Azure", "deploy", "Docker"
- **Tester**: Search for "test", "pytest", "coverage"

### By Task
- **Setup**: Look in setup guides
- **Development**: Check architecture and API docs
- **Deployment**: See deployment guides
- **Demo**: Review demo and presentation docs

### By Problem
- **Error**: Check troubleshooting sections
- **Configuration**: See .env.example and config.py
- **Integration**: Review API documentation

---

## 📞 Getting Help

### Documentation
1. Check this index for relevant docs
2. Read the specific guide
3. Check troubleshooting sections

### Team
1. Ask in team chat
2. Check TEAM_TASKS.md for responsibilities
3. Review code comments

### External
- Azure Docs: https://docs.microsoft.com/azure/
- FastAPI Docs: https://fastapi.tiangolo.com/
- Python Docs: https://docs.python.org/3/

---

## ✅ Checklist

### Before You Start
- [ ] Read GET_STARTED.md
- [ ] Complete setup (SETUP.md)
- [ ] Review your team tasks (TEAM_TASKS.md)
- [ ] Understand architecture (ARCHITECTURE.md)

### During Development
- [ ] Follow code structure (PROJECT_STRUCTURE.md)
- [ ] Write tests (tests/)
- [ ] Update documentation
- [ ] Commit regularly

### Before Demo
- [ ] Complete LAUNCH_CHECKLIST.md
- [ ] Practice DEMO_SCRIPT.md
- [ ] Review PRESENTATION.md
- [ ] Test everything

---

## 🎉 You're Ready!

You now have access to all the documentation you need. Pick your starting point based on your role and dive in!

**Happy coding! 🚀**

---

**Last Updated**: [Current Date]  
**Version**: 1.0.0  
**Team**: GreenOps AI Hackathon Team
