# GreenOps AI - Azure Deployment Script (PowerShell Version)
# This script deploys the complete infrastructure with monitoring and auto-scaling

param(
    [string]$ResourceGroup = "greenops-rg",
    [string]$Location = "eastus",
    [string]$AppName = "greenops-ai",
    [string]$AcrName = "greenopsacr",
    [int]$MinReplicas = 2,
    [int]$MaxReplicas = 5
)

# Color functions
function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Warning { Write-Host "[WARNING] $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "[ERROR] $args" -ForegroundColor Red }

# Check prerequisites
function Check-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    # Check Azure CLI
    try {
        $version = & python -m azure.cli --version 2>&1
        Write-Success "Azure CLI found: $($version[0])"
    } catch {
        Write-Error "Azure CLI is not installed"
        exit 1
    }
    
    # Check if logged in
    try {
        $account = & python -m azure.cli account show 2>&1 | ConvertFrom-Json
        Write-Success "Logged in as: $($account.user.name)"
    } catch {
        Write-Error "Not logged in to Azure. Run: python -m azure.cli login"
        exit 1
    }
    
    Write-Success "Prerequisites check passed"
}

# Create resource group
function Create-ResourceGroup {
    Write-Info "Creating resource group: $ResourceGroup..."
    
    $exists = & python -m azure.cli group exists --name $ResourceGroup 2>&1
    
    if ($exists -eq "true") {
        Write-Warning "Resource group already exists"
    } else {
        & python -m azure.cli group create `
            --name $ResourceGroup `
            --location $Location
        Write-Success "Resource group created"
    }
}

# Deploy infrastructure
function Deploy-Infrastructure {
    Write-Info "Deploying Azure infrastructure..."
    
    & python -m azure.cli deployment group create `
        --resource-group $ResourceGroup `
        --template-file azure-resources.bicep `
        --parameters `
            appName=$AppName `
            location=$Location `
            minReplicas=$MinReplicas `
            maxReplicas=$MaxReplicas `
        --output table
    
    Write-Success "Infrastructure deployed"
}

# Configure secrets
function Configure-Secrets {
    Write-Info "Configuring secrets..."
    
    # Check if .env file exists
    if (-not (Test-Path "../.env")) {
        Write-Error ".env file not found. Please create it first."
        exit 1
    }
    
    # Read from .env
    $envContent = Get-Content "../.env"
    $apiKey = ($envContent | Select-String "AZURE_OPENAI_API_KEY" | ForEach-Object { $_.Line.Split('=')[1] }).Trim()
    
    if ([string]::IsNullOrEmpty($apiKey)) {
        Write-Error "AZURE_OPENAI_API_KEY not found in .env"
        exit 1
    }
    
    # Set secret
    & python -m azure.cli containerapp secret set `
        --name $AppName `
        --resource-group $ResourceGroup `
        --secrets "openai-key=$apiKey"
    
    Write-Success "Secrets configured"
}

# Configure environment variables
function Configure-EnvVars {
    Write-Info "Configuring environment variables..."
    
    $envContent = Get-Content "../.env"
    $endpoint = ($envContent | Select-String "AZURE_OPENAI_ENDPOINT" | ForEach-Object { $_.Line.Split('=')[1] }).Trim()
    $deployment = ($envContent | Select-String "AZURE_OPENAI_DEPLOYMENT_NAME" | ForEach-Object { $_.Line.Split('=')[1] }).Trim()
    
    & python -m azure.cli containerapp update `
        --name $AppName `
        --resource-group $ResourceGroup `
        --set-env-vars `
            AZURE_OPENAI_API_KEY=secretref:openai-key `
            AZURE_OPENAI_ENDPOINT="$endpoint" `
            AZURE_OPENAI_DEPLOYMENT_NAME="$deployment" `
            AZURE_OPENAI_API_VERSION="2024-12-01-preview" `
            LOG_LEVEL=INFO `
            PORT=8000
    
    Write-Success "Environment variables configured"
}

# Configure health checks
function Configure-HealthChecks {
    Write-Info "Configuring health checks..."
    
    & python -m azure.cli containerapp update `
        --name $AppName `
        --resource-group $ResourceGroup `
        --health-probe-type liveness `
        --health-probe-path /health `
        --health-probe-interval 30 `
        --health-probe-timeout 5
    
    Write-Success "Health checks configured"
}

# Configure auto-scaling
function Configure-AutoScaling {
    Write-Info "Configuring auto-scaling..."
    
    & python -m azure.cli containerapp update `
        --name $AppName `
        --resource-group $ResourceGroup `
        --min-replicas $MinReplicas `
        --max-replicas $MaxReplicas
    
    Write-Success "Auto-scaling configured (min: $MinReplicas, max: $MaxReplicas)"
}

# Setup monitoring
function Setup-Monitoring {
    Write-Info "Setting up monitoring..."
    
    & python -m azure.cli monitor app-insights component create `
        --app greenops-insights `
        --location $Location `
        --resource-group $ResourceGroup `
        --application-type web `
        --retention-time 30 2>&1 | Out-Null
    
    Write-Success "Monitoring configured"
}

# Test deployment
function Test-Deployment {
    Write-Info "Testing deployment..."
    Write-Info "Waiting for container to be ready (30 seconds)..."
    Start-Sleep -Seconds 30
    
    $appUrl = & python -m azure.cli containerapp show `
        --name $AppName `
        --resource-group $ResourceGroup `
        --query properties.configuration.ingress.fqdn -o tsv
    
    Write-Info "Testing health endpoint: https://$appUrl/health"
    
    try {
        $response = Invoke-WebRequest -Uri "https://$appUrl/health" -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Success "Health check passed"
        }
    } catch {
        Write-Warning "Health check failed. Container may still be starting up."
        Write-Info "Check logs with: python -m azure.cli containerapp logs show --name $AppName --resource-group $ResourceGroup --follow"
    }
}

# Get deployment info
function Get-DeploymentInfo {
    Write-Info "Retrieving deployment information..."
    
    $appUrl = & python -m azure.cli containerapp show `
        --name $AppName `
        --resource-group $ResourceGroup `
        --query properties.configuration.ingress.fqdn -o tsv
    
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host "  GreenOps AI Deployment Complete!" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Deployment Information:" -ForegroundColor Cyan
    Write-Host "  App URL:              https://$appUrl" -ForegroundColor Yellow
    Write-Host "  Resource Group:       $ResourceGroup" -ForegroundColor Yellow
    Write-Host "  Auto-scaling:         $MinReplicas-$MaxReplicas replicas" -ForegroundColor Yellow
    Write-Host "  Health Checks:        Enabled" -ForegroundColor Yellow
    Write-Host "  Monitoring:           Application Insights" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Useful Commands:" -ForegroundColor Cyan
    Write-Host "  View logs:             python -m azure.cli containerapp logs show --name $AppName --resource-group $ResourceGroup --follow" -ForegroundColor Yellow
    Write-Host "  Check status:          python -m azure.cli containerapp show --name $AppName --resource-group $ResourceGroup" -ForegroundColor Yellow
    Write-Host ""
}

# Main execution
function Main {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "  GreenOps AI - Azure Deployment Script (PowerShell)" -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host ""
    
    Check-Prerequisites
    Create-ResourceGroup
    Deploy-Infrastructure
    Configure-Secrets
    Configure-EnvVars
    Configure-HealthChecks
    Configure-AutoScaling
    Setup-Monitoring
    Test-Deployment
    Get-DeploymentInfo
    
    Write-Success "Deployment completed successfully!"
}

# Run main
Main
