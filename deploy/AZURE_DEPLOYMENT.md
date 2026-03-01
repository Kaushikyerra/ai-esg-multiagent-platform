# Azure Deployment Guide - GreenOps AI

## Prerequisites

### 1. Azure Account
- Active Azure subscription
- Contributor or Owner role
- Azure OpenAI access approved

### 2. Tools Installed
- Azure CLI: https://aka.ms/installazurecliwindows
- Docker Desktop: https://www.docker.com/products/docker-desktop
- Git Bash (for running .sh scripts on Windows)

### 3. Verify Installation
```bash
az --version
docker --version
git --version
```

---

## Quick Deployment (Automated)

### Step 1: Login to Azure
```bash
az login
```

### Step 2: Run Deployment Script
```bash
cd deploy
chmod +x deploy.sh
./deploy.sh
```

This will:
1. Create resource group
2. Deploy Azure resources (ACR, Container Apps, Log Analytics)
3. Build Docker image
4. Push to Azure Container Registry
5. Deploy container app
6. Output the app URL

---

## Manual Deployment (Step-by-Step)

### Step 1: Set Variables
```bash
RESOURCE_GROUP="greenops-rg"
LOCATION="eastus"
APP_NAME="greenops-ai"
ACR_NAME="${APP_NAME}acr"
```

### Step 2: Create Resource Group
```bash
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

### Step 3: Deploy Infrastructure
```bash
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file azure-resources.bicep \
  --parameters appName=$APP_NAME location=$LOCATION
```

This creates:
- Azure Container Registry
- Log Analytics Workspace
- Container Apps Environment
- Container App

### Step 4: Build Docker Image
```bash
# From project root
docker build -t greenops-ai:latest .
```

### Step 5: Push to Azure Container Registry
```bash
# Login to ACR
az acr login --name $ACR_NAME

# Tag image
docker tag greenops-ai:latest $ACR_NAME.azurecr.io/greenops:latest

# Push image
docker push $ACR_NAME.azurecr.io/greenops:latest
```

### Step 6: Update Container App
```bash
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/greenops:latest
```

### Step 7: Configure Environment Variables
```bash
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars \
    AZURE_OPENAI_API_KEY=secretref:openai-key \
    AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/ \
    AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4 \
    LOG_LEVEL=INFO
```

### Step 8: Get App URL
```bash
az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  -o tsv
```

---

## Secrets Management

### Create Secret for API Key
```bash
az containerapp secret set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --secrets openai-key=your_actual_api_key_here
```

### Update Environment to Use Secret
```bash
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars AZURE_OPENAI_API_KEY=secretref:openai-key
```

---

## Scaling Configuration

### Manual Scaling
```bash
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --min-replicas 1 \
  --max-replicas 5
```

### Auto-Scaling Rules
```bash
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --scale-rule-name http-rule \
  --scale-rule-type http \
  --scale-rule-http-concurrency 50
```

---

## Monitoring Setup

### Enable Application Insights
```bash
# Create Application Insights
az monitor app-insights component create \
  --app greenops-insights \
  --location $LOCATION \
  --resource-group $RESOURCE_GROUP

# Get instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app greenops-insights \
  --resource-group $RESOURCE_GROUP \
  --query instrumentationKey -o tsv)

# Add to container app
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=$INSTRUMENTATION_KEY"
```

### View Logs
```bash
# Stream logs
az containerapp logs show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --follow

# Query logs
az monitor log-analytics query \
  --workspace $(az containerapp env show \
    --name ${APP_NAME}-env \
    --resource-group $RESOURCE_GROUP \
    --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId -o tsv) \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == '$APP_NAME' | project TimeGenerated, Log_s | order by TimeGenerated desc | take 50"
```

---

## Health Checks

### Configure Health Probes
```bash
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --health-probe-type liveness \
  --health-probe-path /health \
  --health-probe-interval 30 \
  --health-probe-timeout 5
```

### Test Health Endpoint
```bash
APP_URL=$(az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv)

curl https://$APP_URL/health
```

---

## CI/CD with GitHub Actions

### Create Service Principal
```bash
az ad sp create-for-rbac \
  --name "greenops-github-actions" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/$RESOURCE_GROUP \
  --sdk-auth
```

### Add GitHub Secrets
1. Go to GitHub repository → Settings → Secrets
2. Add secrets:
   - `AZURE_CREDENTIALS`: Output from service principal creation
   - `AZURE_OPENAI_API_KEY`: Your OpenAI API key
   - `AZURE_OPENAI_ENDPOINT`: Your OpenAI endpoint

### Workflow File
Already created at `.github/workflows/azure-deploy.yaml`

### Trigger Deployment
```bash
git push origin main
```

---

## Custom Domain (Optional)

### Add Custom Domain
```bash
az containerapp hostname add \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname greenops.yourdomain.com
```

### Configure SSL
```bash
az containerapp hostname bind \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname greenops.yourdomain.com \
  --environment ${APP_NAME}-env \
  --validation-method CNAME
```

---

## Troubleshooting

### Container Won't Start
```bash
# Check logs
az containerapp logs show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --tail 100

# Check revision status
az containerapp revision list \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  -o table
```

### Image Pull Errors
```bash
# Verify ACR access
az acr repository list --name $ACR_NAME

# Check container app identity
az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query identity
```

### Environment Variable Issues
```bash
# List current env vars
az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.template.containers[0].env
```

### Network Issues
```bash
# Check ingress configuration
az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress
```

---

## Cost Optimization

### View Current Costs
```bash
az consumption usage list \
  --start-date 2024-01-01 \
  --end-date 2024-01-31 \
  --query "[?contains(instanceName, 'greenops')]"
```

### Optimize Resources
- Use consumption-based pricing
- Set appropriate min/max replicas
- Use smaller container sizes if possible
- Enable auto-scaling
- Delete unused resources

### Set Budget Alert
```bash
az consumption budget create \
  --budget-name greenops-budget \
  --amount 100 \
  --time-grain Monthly \
  --start-date 2024-01-01 \
  --end-date 2024-12-31 \
  --resource-group $RESOURCE_GROUP
```

---

## Cleanup

### Delete Everything
```bash
az group delete \
  --name $RESOURCE_GROUP \
  --yes \
  --no-wait
```

### Delete Specific Resources
```bash
# Delete container app
az containerapp delete \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --yes

# Delete ACR
az acr delete \
  --name $ACR_NAME \
  --resource-group $RESOURCE_GROUP \
  --yes
```

---

## Production Checklist

- [ ] Secrets stored in Azure Key Vault
- [ ] Application Insights configured
- [ ] Health checks enabled
- [ ] Auto-scaling configured
- [ ] Budget alerts set
- [ ] Backup strategy defined
- [ ] Disaster recovery plan
- [ ] Security scanning enabled
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate valid
- [ ] Monitoring dashboard created
- [ ] Alert rules configured
- [ ] Documentation updated

---

## Useful Commands

### Quick Status Check
```bash
az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "{Status:properties.runningStatus, URL:properties.configuration.ingress.fqdn, Replicas:properties.template.scale}" \
  -o table
```

### Restart Container
```bash
az containerapp revision restart \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --revision $(az containerapp revision list \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "[0].name" -o tsv)
```

### Update Image
```bash
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/greenops:latest
```

---

## Support Resources

- Azure Container Apps: https://docs.microsoft.com/azure/container-apps/
- Azure CLI Reference: https://docs.microsoft.com/cli/azure/
- Troubleshooting Guide: https://docs.microsoft.com/azure/container-apps/troubleshooting
- Azure Status: https://status.azure.com/

---

**Deployment complete! Your GreenOps AI is now running on Azure! 🚀**
