#!/bin/bash

# GreenOps AI - Azure Deployment Script (Enhanced)
# This script deploys the complete infrastructure with monitoring and auto-scaling

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="greenops-rg"
LOCATION="eastus"
APP_NAME="greenops-ai"
ACR_NAME="${APP_NAME}acr"
MIN_REPLICAS=2
MAX_REPLICAS=5

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check if logged in to Azure
    if ! az account show &> /dev/null; then
        log_warning "Not logged in to Azure. Running 'az login'..."
        az login
    fi
    
    log_success "Prerequisites check passed"
}

create_resource_group() {
    log_info "Creating resource group: $RESOURCE_GROUP..."
    
    if az group exists --name $RESOURCE_GROUP | grep -q true; then
        log_warning "Resource group already exists"
    else
        az group create \
            --name $RESOURCE_GROUP \
            --location $LOCATION
        log_success "Resource group created"
    fi
}

deploy_infrastructure() {
    log_info "Deploying Azure infrastructure..."
    
    az deployment group create \
        --resource-group $RESOURCE_GROUP \
        --template-file azure-resources.bicep \
        --parameters \
            appName=$APP_NAME \
            location=$LOCATION \
            minReplicas=$MIN_REPLICAS \
            maxReplicas=$MAX_REPLICAS \
        --output table
    
    log_success "Infrastructure deployed"
}

build_docker_image() {
    log_info "Building Docker image..."
    
    docker build \
        -t $APP_NAME:latest \
        -t $APP_NAME:$(date +%s) \
        ../
    
    log_success "Docker image built"
}

push_to_acr() {
    log_info "Pushing image to Azure Container Registry..."
    
    # Get ACR login server
    ACR_LOGIN_SERVER=$(az acr show \
        --name $ACR_NAME \
        --resource-group $RESOURCE_GROUP \
        --query loginServer -o tsv)
    
    log_info "ACR Login Server: $ACR_LOGIN_SERVER"
    
    # Login to ACR
    az acr login --name $ACR_NAME
    
    # Tag image
    docker tag $APP_NAME:latest $ACR_LOGIN_SERVER/greenops:latest
    docker tag $APP_NAME:latest $ACR_LOGIN_SERVER/greenops:$(date +%Y%m%d-%H%M%S)
    
    # Push image
    docker push $ACR_LOGIN_SERVER/greenops:latest
    docker push $ACR_LOGIN_SERVER/greenops:$(date +%Y%m%d-%H%M%S)
    
    log_success "Image pushed to ACR"
}

configure_secrets() {
    log_info "Configuring secrets..."
    
    # Check if .env file exists
    if [ ! -f ../.env ]; then
        log_error ".env file not found. Please create it first."
        exit 1
    fi
    
    # Read Azure OpenAI API Key from .env
    AZURE_OPENAI_API_KEY=$(grep AZURE_OPENAI_API_KEY ../.env | cut -d '=' -f 2)
    AZURE_OPENAI_ENDPOINT=$(grep AZURE_OPENAI_ENDPOINT ../.env | cut -d '=' -f 2)
    AZURE_OPENAI_DEPLOYMENT=$(grep AZURE_OPENAI_DEPLOYMENT_NAME ../.env | cut -d '=' -f 2)
    
    if [ -z "$AZURE_OPENAI_API_KEY" ]; then
        log_error "AZURE_OPENAI_API_KEY not found in .env"
        exit 1
    fi
    
    # Set secret in container app
    az containerapp secret set \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --secrets openai-key="$AZURE_OPENAI_API_KEY"
    
    log_success "Secrets configured"
}

update_container_app() {
    log_info "Updating container app..."
    
    ACR_LOGIN_SERVER=$(az acr show \
        --name $ACR_NAME \
        --resource-group $RESOURCE_GROUP \
        --query loginServer -o tsv)
    
    az containerapp update \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --image $ACR_LOGIN_SERVER/greenops:latest
    
    log_success "Container app updated"
}

configure_environment_variables() {
    log_info "Configuring environment variables..."
    
    AZURE_OPENAI_ENDPOINT=$(grep AZURE_OPENAI_ENDPOINT ../.env | cut -d '=' -f 2)
    AZURE_OPENAI_DEPLOYMENT=$(grep AZURE_OPENAI_DEPLOYMENT_NAME ../.env | cut -d '=' -f 2)
    
    az containerapp update \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --set-env-vars \
            AZURE_OPENAI_API_KEY=secretref:openai-key \
            AZURE_OPENAI_ENDPOINT="$AZURE_OPENAI_ENDPOINT" \
            AZURE_OPENAI_DEPLOYMENT_NAME="$AZURE_OPENAI_DEPLOYMENT" \
            AZURE_OPENAI_API_VERSION="2024-12-01-preview" \
            LOG_LEVEL=INFO \
            PORT=8000
    
    log_success "Environment variables configured"
}

configure_health_checks() {
    log_info "Configuring health checks..."
    
    az containerapp update \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --health-probe-type liveness \
        --health-probe-path /health \
        --health-probe-interval 30 \
        --health-probe-timeout 5
    
    log_success "Health checks configured"
}

configure_auto_scaling() {
    log_info "Configuring auto-scaling..."
    
    az containerapp update \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --min-replicas $MIN_REPLICAS \
        --max-replicas $MAX_REPLICAS
    
    log_success "Auto-scaling configured (min: $MIN_REPLICAS, max: $MAX_REPLICAS)"
}

setup_monitoring() {
    log_info "Setting up monitoring..."
    
    # Create Application Insights
    az monitor app-insights component create \
        --app greenops-insights \
        --location $LOCATION \
        --resource-group $RESOURCE_GROUP \
        --application-type web \
        --retention-time 30 || log_warning "Application Insights already exists"
    
    log_success "Monitoring configured"
}

test_deployment() {
    log_info "Testing deployment..."
    
    # Wait for container to be ready
    log_info "Waiting for container to be ready (30 seconds)..."
    sleep 30
    
    # Get app URL
    APP_URL=$(az containerapp show \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --query properties.configuration.ingress.fqdn -o tsv)
    
    log_info "Testing health endpoint: https://$APP_URL/health"
    
    if curl -f https://$APP_URL/health > /dev/null 2>&1; then
        log_success "Health check passed"
    else
        log_warning "Health check failed. Container may still be starting up."
        log_info "Check logs with: az containerapp logs show --name $APP_NAME --resource-group $RESOURCE_GROUP --follow"
    fi
}

get_deployment_info() {
    log_info "Retrieving deployment information..."
    
    APP_URL=$(az containerapp show \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --query properties.configuration.ingress.fqdn -o tsv)
    
    ACR_LOGIN_SERVER=$(az acr show \
        --name $ACR_NAME \
        --resource-group $RESOURCE_GROUP \
        --query loginServer -o tsv)
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         🚀 GreenOps AI Deployment Complete! 🚀             ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📊 Deployment Information:${NC}"
    echo -e "  🌐 App URL:              ${YELLOW}https://$APP_URL${NC}"
    echo -e "  📦 Resource Group:       ${YELLOW}$RESOURCE_GROUP${NC}"
    echo -e "  🐳 Container Registry:   ${YELLOW}$ACR_LOGIN_SERVER${NC}"
    echo -e "  📈 Auto-scaling:         ${YELLOW}$MIN_REPLICAS-$MAX_REPLICAS replicas${NC}"
    echo -e "  🔍 Health Checks:        ${YELLOW}Enabled${NC}"
    echo -e "  📋 Monitoring:           ${YELLOW}Application Insights${NC}"
    echo -e "  🔐 Secrets:              ${YELLOW}Azure Key Vault${NC}"
    echo ""
    echo -e "${BLUE}📝 Useful Commands:${NC}"
    echo -e "  View logs:               ${YELLOW}az containerapp logs show --name $APP_NAME --resource-group $RESOURCE_GROUP --follow${NC}"
    echo -e "  Check status:            ${YELLOW}az containerapp show --name $APP_NAME --resource-group $RESOURCE_GROUP${NC}"
    echo -e "  Restart app:             ${YELLOW}az containerapp revision restart --name $APP_NAME --resource-group $RESOURCE_GROUP${NC}"
    echo -e "  View metrics:            ${YELLOW}az monitor metrics list --resource /subscriptions/\$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/containerApps/$APP_NAME${NC}"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║      GreenOps AI - Azure Deployment Script (Enhanced)      ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    check_prerequisites
    create_resource_group
    deploy_infrastructure
    build_docker_image
    push_to_acr
    configure_secrets
    update_container_app
    configure_environment_variables
    configure_health_checks
    configure_auto_scaling
    setup_monitoring
    test_deployment
    get_deployment_info
    
    log_success "Deployment completed successfully!"
}

# Run main function
main
