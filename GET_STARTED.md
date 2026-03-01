# 🚀 Get Started with GreenOps AI

Welcome to GreenOps AI! This guide will get you up and running in 5 minutes.

## 🎯 What You're Building

A multi-agent AI system that analyzes CI/CD pipelines and provides:
- 🌱 Carbon footprint analysis
- 💰 Cost optimization
- ⚠️ Risk assessment
- 📋 Automated policy enforcement

## 👥 Your Role

You are **Member 4: Cloud & DevOps Integration**

Your responsibilities:
- ✅ Azure infrastructure setup
- ✅ Deployment automation
- ✅ CI/CD pipeline configuration
- ✅ Monitoring and observability

## ⚡ Quick Start (5 Minutes)

### Step 1: Setup Environment (2 min)
```bash
# Windows
quickstart.bat

# Linux/Mac
chmod +x quickstart.sh
./quickstart.sh
```

### Step 2: Configure Azure OpenAI (1 min)
Edit `.env` file:
```
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
```

### Step 3: Run Server (1 min)
```bash
python orchestrator/main.py
```

### Step 4: Test (1 min)
```bash
# In another terminal
python test_api.py
```

✅ **You're ready!** Server is running at http://localhost:8000

## 📋 Your Tasks

### Priority 1: Core Infrastructure
- [ ] Test local Docker build
- [ ] Deploy to Azure Container Apps
- [ ] Configure environment variables
- [ ] Verify health checks

### Priority 2: CI/CD Pipeline
- [ ] Test GitHub Actions workflow
- [ ] Configure Azure credentials
- [ ] Setup automated deployment
- [ ] Add monitoring

### Priority 3: Documentation
- [ ] Document deployment process
- [ ] Create runbook for issues
- [ ] Add architecture diagrams
- [ ] Write troubleshooting guide

## 🛠️ Key Commands

### Local Development
```bash
# Run server
python orchestrator/main.py

# Run tests
pytest tests/ -v

# Build Docker
docker build -t greenops-ai .

# Run Docker
docker run -p 8000:8000 --env-file .env greenops-ai
```

### Azure Deployment
```bash
# Login
az login

# Deploy
cd deploy
./deploy.sh

# Check status
az containerapp show --name greenops-ai --resource-group greenops-rg
```

## 📁 Important Files

### Your Files
- `deploy/azure-resources.bicep` - Infrastructure definition
- `deploy/deploy.sh` - Deployment script
- `.github/workflows/azure-deploy.yaml` - CI/CD pipeline
- `Dockerfile` - Container definition

### Configuration
- `.env` - Environment variables
- `orchestrator/config.py` - App configuration
- `requirements.txt` - Python dependencies

### Documentation
- `SETUP.md` - Detailed setup guide
- `WINDOWS_SETUP.md` - Windows-specific instructions
- `docs/API.md` - API reference
- `TEAM_TASKS.md` - All team tasks

## 🎯 Success Criteria

By end of Day 1:
- ✅ Local environment working
- ✅ Docker image builds
- ✅ Azure resources created

By end of Day 2:
- ✅ Deployed to Azure
- ✅ CI/CD pipeline working
- ✅ Monitoring configured

By Demo Day:
- ✅ Production deployment stable
- ✅ Health checks passing
- ✅ Demo environment ready

## 🆘 Need Help?

### Quick Fixes
- **Port in use**: Change PORT in `.env`
- **Import errors**: Activate venv: `venv\Scripts\activate`
- **Azure login**: Run `az login`
- **Docker issues**: Restart Docker Desktop

### Documentation
- Windows issues: See `WINDOWS_SETUP.md`
- General setup: See `SETUP.md`
- API questions: See `docs/API.md`
- Team tasks: See `TEAM_TASKS.md`

### Team Communication
- Check team chat for updates
- Daily standup at [time]
- Code reviews in PRs
- Demo practice on Day 3

## 🎬 Demo Preparation

### Your Demo Section (30 seconds)
Show:
1. Azure Portal with deployed resources
2. Container Apps running
3. Health check: `curl https://your-app.azurecontainerapps.io/health`
4. Monitoring dashboard

Talk about:
- Scalable architecture
- Auto-scaling capabilities
- Production-ready deployment
- Enterprise security

## 📚 Learning Resources

### Azure
- [Container Apps Docs](https://docs.microsoft.com/azure/container-apps/)
- [Bicep Documentation](https://docs.microsoft.com/azure/azure-resource-manager/bicep/)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/)

### Docker
- [Docker Documentation](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### CI/CD
- [GitHub Actions Docs](https://docs.github.com/actions)
- [Azure DevOps Docs](https://docs.microsoft.com/azure/devops/)

## ✅ Daily Checklist

### Every Morning
- [ ] Pull latest code: `git pull`
- [ ] Check team chat
- [ ] Review your tasks
- [ ] Test local environment

### Every Evening
- [ ] Commit your changes
- [ ] Update team on progress
- [ ] Note any blockers
- [ ] Plan tomorrow's work

## 🎉 You've Got This!

You're building something amazing. The infrastructure you create will:
- Enable the entire system to scale
- Ensure reliability and uptime
- Provide observability and monitoring
- Make deployment seamless

**Let's build something great! 🚀**

---

## Next Steps

1. ✅ Complete Quick Start above
2. 📖 Read `TEAM_TASKS.md` for detailed tasks
3. 🔧 Start with local Docker testing
4. ☁️ Move to Azure deployment
5. 🎯 Prepare for demo

**Questions?** Check the documentation or ask your team!
