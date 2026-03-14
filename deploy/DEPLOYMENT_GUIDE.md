# GreenOps AI - Complete Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Testing](#local-testing)
3. [Azure Deployment](#azure-deployment)
4. [Monitoring & Alerts](#monitoring--alerts)
5. [Auto-Scaling Configuration](#auto-scaling-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Production Checklist](#production-checklist)

---

## Prerequisites

### Required Tools
- **Azure CLI**: [Install](https://aka.ms/installazurecliwindows)
- **Docker Desktop**: [Install](https://www.docker.com/products/docker-desktop)
- **Git**: [Install](https://git-scm.com/download/win)
- **Python 3.11+**: [Install](https://www.python.org/downloads/)

### Azure Requirements
- Active Azure subscription
- Contributor or Owner role
- Azure OpenAI access approved
- Sufficient quota for Container Apps

### Verify Installation
```bash
az --version
docker --version
git --version
python --version
```

---

## Local Testing

### Step 1: Setup Environment
```bash
# Clone repository
git clone https://github.com/Kaushikyerra/ai-esg-multiagent-platform.git
cd ai-esg-multiagent-platform

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your Azure OpenAI credentials
# Required variables:
# - AZURE_OPENAI_API_KEY
# - AZURE_OPENAI_ENDPOINT
# - AZURE_OPENAI_DEPLOYMENT_NAME
# - AZURE_OPENAI_API_VERSION
```

### Step 3: Run Tests Locally
```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=orchestrator --cov-report=html

# Run specific test
pytest tests/test_agents.py::test_pipeline_analyzer -v
```

### Step 4: Start Local API Server
```bash
# Run the API
python -m orchestrator.main

# API will be available at http://localhost:8000
# Health check: http://localhost:8000/health
# API docs: http://localhost:8000/docs
```

### Step 5: Test API Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Analyze pipeline (example)
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d @examples/sample_request.json
```

---

## Azure Deployment

### Step 1: Login to Azure
```bash
az login

# Verify login
az account show
```

### Step 2: Prepare Deployment
```bash
# Navigate to deploy directory
cd deploy

# Make script executable (on macOS/Linux)
chmod +x deploy.sh

# On Windows, use Git Bash or PowerShell
```

### Step 3: Run Automated Deployment
```bash
# From deploy directory
./deploy.sh

# Or on Windows PowerShell:
bash deploy.sh
```

The script will:
1. ✅ Check prerequisites
2. ✅ Create resource group
3. ✅ Deploy infrastructure (Bicep template)
4. ✅ Build Docker image
5. ✅ Push to Azure Container Registry
6. ✅ Update container app
7. ✅ Configure secrets
8. ✅ Setup environment variables
9. ✅ Configure health checks
10. ✅ Setup auto-scaling
11. ✅ Configure monitoring
12. ✅ Test deployment

### Step 4: Verify Deployment
```bash
# Get deployment status
az containerapp show \
  --name greenops-ai \
  --resource-group greenops-rg \
  --query "{Status:properties.runningStatus, URL:properties.configuration.ingress.fqdn}" \
  -o table

# View logs
az containerapp logs show \
  --name greenops-ai \
  --resource-group greenops-rg \
  --follow

# Test health endpoint
curl https://$(az containerapp show \
  --name greenops-ai \
  --resource-group greenops-rg \
  --query properties.configuration.ingress.fqdn -o tsv)/health
```

---

## Monitoring & Alerts

### Application Insights Setup
```bash
# View Application Insights
az monitor app-insights component show \
  --app greenops-insights \
  --resource-group greenops-rg

# Get instrumentation key
az monitor app-insights component show \
  --app greenops-insights \
  --resource-group greenops-rg \
  --query instrumentationKey -o tsv
```

### View Metrics
```bash
# CPU usage
az monitor metrics list \
  --resource /subscriptions/$(az account show --query id -o tsv)/resourceGroups/greenops-rg/providers/Microsoft.App/containerApps/greenops-ai \
  --metric CpuUsagePercentage \
  --start-time 2024-01-01T00:00:00Z \
  --interval PT1M

# Memory usage
az monitor metrics list \
  --resource /subscriptions/$(az account show --query id -o tsv)/resourceGroups/greenops-rg/providers/Microsoft.App/containerApps/greenops-ai \
  --metric MemoryUsagePercentage \
  --start-time 2024-01-01T00:00:00Z \
  --interval PT1M

# Request count
az monitor metrics list \
  --resource /subscriptions/$(az account show --query id -o tsv)/resourceGroups/greenops-rg/providers/Microsoft.App/containerApps/greenops-ai \
  --metric RequestCount \
  --start-time 2024-01-01T00:00:00Z \
  --interval PT1M
```

### Create Custom Alerts
```bash
# Alert for high error rate
az monitor metrics alert create \
  --name greenops-high-error-rate \
  --resource-group greenops-rg \
  --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/greenops-rg/providers/Microsoft.Insights/components/greenops-insights \
  --condition "avg failedRequests > 10" \
  --window-size 5m \
  --evaluation-frequency 1m

# Alert for high CPU
az monitor metrics alert create \
  --name greenops-high-cpu \
  --resource-group greenops-rg \
  --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/greenops-rg/providers/Microsoft.App/containerApps/greenops-ai \
  --condition "avg CpuUsagePercentage > 80" \
  --window-size 5m \
  --evaluation-frequency 1m
```

### View Logs in Log Analytics
```bash
# Query logs
az monitor log-analytics query \
  --workspace $(az containerapp env show \
    --name greenops-ai-env \
    --resource-group greenops-rg \
    --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId -o tsv) \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'greenops-ai' | project TimeGenerated, Log_s | order by TimeGenerated desc | take 50"
```

---

## Auto-Scaling Configuration

### Current Configuration
- **Min Replicas**: 2
- **Max Replicas**: 5
- **Scaling Rules**:
  - HTTP concurrency: 50 requests per replica
  - CPU utilization: 70%

### Modify Auto-Scaling
```bash
# Update min/max replicas
az containerapp update \
  --name greenops-ai \
  --resource-group greenops-rg \
  --min-replicas 3 \
  --max-replicas 10

# View current scaling configuration
az containerapp show \
  --name greenops-ai \
  --resource-group greenops-rg \
  --query properties.template.scale
```

### Monitor Scaling Events
```bash
# View replica count over time
az monitor metrics list \
  --resource /subscriptions/$(az account show --query id -o tsv)/resourceGroups/greenops-rg/providers/Microsoft.App/containerApps/greenops-ai \
  --metric Replicas \
  --start-time 2024-01-01T00:00:00Z \
  --interval PT1M
```

---

## Troubleshooting

### Container Won't Start
```bash
# Check logs
az containerapp logs show \
  --name greenops-ai \
  --resource-group greenops-rg \
  --tail 100

# Check revision status
az containerapp revision list \
  --name greenops-ai \
  --resource-group greenops-rg \
  -o table

# Check container app details
az containerapp show \
  --name greenops-ai \
  --resource-group greenops-rg \
  --query properties.template.containers[0]
```

### Image Pull Errors
```bash
# Verify ACR access
az acr repository list --name greenopsacr

# Check ACR credentials
az acr credential show --name greenopsacr

# Verify image exists
az acr repository show --name greenopsacr --image greenops:latest
```

### Environment Variable Issues
```bash
# List current environment variables
az containerapp show \
  --name greenops-ai \
  --resource-group greenops-rg \
  --query properties.template.containers[0].env

# Update environment variables
az containerapp update \
  --name greenops-ai \
  --resource-group greenops-rg \
  --set-env-vars KEY=value
```

### Health Check Failures
```bash
# Check health probe configuration
az containerapp show \
  --name greenops-ai \
  --resource-group greenops-rg \
  --query properties.template.containers[0].probes

# Test health endpoint manually
curl -v https://$(az containerapp show \
  --name greenops-ai \
  --resource-group greenops-rg \
  --query properties.configuration.ingress.fqdn -o tsv)/health
```

### Network Issues
```bash
# Check ingress configuration
az containerapp show \
  --name greenops-ai \
  --resource-group greenops-rg \
  --query properties.configuration.ingress

# Check if app is accessible
nslookup $(az containerapp show \
  --name greenops-ai \
  --resource-group greenops-rg \
  --query properties.configuration.ingress.fqdn -o tsv)
```

---

## Production Checklist

### Security
- [ ] Secrets stored in Azure Key Vault
- [ ] API key not in code or logs
- [ ] HTTPS enforced
- [ ] Network policies configured
- [ ] Container image scanned for vulnerabilities
- [ ] Non-root user in container

### Monitoring & Logging
- [ ] Application Insights configured
- [ ] Log Analytics workspace created
- [ ] Health checks enabled
- [ ] Alerts configured for errors
- [ ] Alerts configured for high CPU
- [ ] Alerts configured for high memory
- [ ] Dashboard created

### Performance
- [ ] Auto-scaling configured
- [ ] Min/max replicas set appropriately
- [ ] Resource limits set
- [ ] Response time < 2 seconds
- [ ] Error rate < 1%

### Reliability
- [ ] Health checks passing
- [ ] Graceful shutdown implemented
- [ ] Retry logic implemented
- [ ] Circuit breaker configured
- [ ] Backup strategy defined

### Documentation
- [ ] Deployment guide updated
- [ ] Runbook created
- [ ] API documentation complete
- [ ] Architecture documented
- [ ] Troubleshooting guide created

### Cost Optimization
- [ ] Budget alerts configured
- [ ] Resource sizing optimized
- [ ] Unused resources removed
- [ ] Consumption-based pricing enabled
- [ ] Cost analysis performed

---

## Useful Commands Reference

### Deployment
```bash
# Deploy infrastructure
az deployment group create --resource-group greenops-rg --template-file deploy/azure-resources.bicep

# Update container app
az containerapp update --name greenops-ai --resource-group greenops-rg --image <image-url>

# Restart container
az containerapp revision restart --name greenops-ai --resource-group greenops-rg
```

### Monitoring
```bash
# View logs
az containerapp logs show --name greenops-ai --resource-group greenops-rg --follow

# View metrics
az monitor metrics list --resource <resource-id> --metric <metric-name>

# Query logs
az monitor log-analytics query --workspace <workspace-id> --analytics-query "<query>"
```

### Scaling
```bash
# Update replicas
az containerapp update --name greenops-ai --resource-group greenops-rg --min-replicas 2 --max-replicas 5

# View scaling configuration
az containerapp show --name greenops-ai --resource-group greenops-rg --query properties.template.scale
```

### Cleanup
```bash
# Delete resource group (deletes all resources)
az group delete --name greenops-rg --yes --no-wait

# Delete specific resource
az containerapp delete --name greenops-ai --resource-group greenops-rg --yes
```

---

## Support & Resources

- [Azure Container Apps Documentation](https://docs.microsoft.com/azure/container-apps/)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/)
- [Bicep Documentation](https://docs.microsoft.com/azure/azure-resource-manager/bicep/)
- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Troubleshooting Guide](https://docs.microsoft.com/azure/container-apps/troubleshooting)

---

**Last Updated**: March 14, 2026
**Version**: 2.0 (Enhanced with Monitoring & Auto-Scaling)
