#!/bin/bash

# GreenOps AI - Azure Deployment Script

set -e

echo "🚀 Deploying GreenOps AI to Azure..."

# Variables
RESOURCE_GROUP="greenops-rg"
LOCATION="eastus"
APP_NAME="greenops-ai"

# Create resource group
echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Deploy infrastructure
echo "Deploying Azure resources..."
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file azure-resources.bicep \
  --parameters appName=$APP_NAME location=$LOCATION

# Get ACR credentials
ACR_NAME="${APP_NAME}acr"
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer -o tsv)

# Build and push Docker image
echo "Building Docker image..."
docker build -t $ACR_LOGIN_SERVER/greenops:latest ../

echo "Pushing to Azure Container Registry..."
az acr login --name $ACR_NAME
docker push $ACR_LOGIN_SERVER/greenops:latest

# Update container app
echo "Updating container app..."
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_LOGIN_SERVER/greenops:latest

# Get app URL
APP_URL=$(az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "✅ Deployment complete!"
echo "🌐 App URL: https://$APP_URL"
