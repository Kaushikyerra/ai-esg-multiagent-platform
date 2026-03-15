# GreenOps AI - Complete Azure Deployment Script
# This script builds Docker image, pushes to ACR, and deploys to Azure

param(
    [string]$ResourceGroup = "greenops-rg",
    [string]$Location = "eastus",
    [string]$AppName = "greenops-ai",
    [string]$AcrName = "greenopsacr",
    [string]$DockerPath = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
)

# Helper functions
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
        Write-Success "Azure CLI: $($version[0])"
    } catch {
        Write-Error "Azure CLI not found"
        exit 1
    }
    
    # Check Docker
    if (Test-Path $DockerPath) {
        $dockerVersion = & $DockerPath --version
        Write-Success "Docker: $dockerVersion"
    } else {
        Write-Error "Docker not found at $DockerPath"
        exit 1
    }
    
    # Check if logged in to Azure
    try {
        $account = & python -m azure.cli account show 2>&1 | ConvertFrom-Json
        Write-Success "Azure: Logged in as $($account.user.name)"
    } catch {
        Write-Error "Not logged in to Azure"
        exit 1
    }
}

# Create resource group
function Create-ResourceGroup {
    Write-Info "Creating resource group: $ResourceGroup..."
    
    $exists = & python -m azure.cli group exists --name $ResourceGroup 2>&1
    
    if ($exists -eq "true") {
        Write-Warning "Resource group already exists"
    } else {
        & python -m azure.cli group create --name $ResourceGroup --location $Location
        Write-Success "Resource group created"
    }
}

# Deploy infrastructure
function Deploy-Infrastructure {
    Write-Info "Deploying Azure infrastructure (Bicep)..."
    
    & python -m azure.cli deployment group create `
        --resource-group $ResourceGroup `
        --template-file azure-resources-simple.bicep `
        --parameters appName=$AppName location=$Location `
        --output table
    
    Write-Success "Infrastructure deployed"
}

# Build Docker image
function Build-DockerImage {
    Write-Info "Building Docker image..."
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    
    & $DockerPath build `
        -t "${AppName}:latest" `
        -t "${AppName}:${timestamp}" `
        -f ../Dockerfile `
        ../
    
    Write-Success "Docker image built: ${AppName}:latest"
}

# Get ACR login server
function Get-AcrLoginServer {
    Write-Info "Getting ACR login server..."
    
    $loginServer = & python -m azure.cli acr show `
        --name $AcrName `
        --resource-group $ResourceGroup `
        --query loginServer -o tsv
    
    Write-Success "ACR Login Server: $loginServer"
    return $loginServer
}

# Login to ACR
function Login-ToAcr {
    param([string]$AcrName)
    
    Write-Info "Logging in to Azure Container Registry..."
    
    & python -m azure.cli acr login --name $AcrName
    
    Write-Success "Logged in to ACR"
}

# Push image to ACR
function Push-ToAcr {
    param([string]$LoginServer)
    
    Write-Info "Pushing image to ACR..."
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    
    # Tag image
    & $DockerPath tag "${AppName}:latest" "${LoginServer}/greenops:latest"
    & $DockerPath tag "${AppName}:latest" "${LoginServer}/greenops:${timestamp}"
    
    # Push image
    & $DockerPath push "${LoginServer}/greenops:latest"
    & $DockerPath push "${LoginServer}/greenops:${timestamp}"
    
    Write-Success "Image pushed to ACR"
}

# Configure secrets
function Configure-Secrets {
    Write-Info "Configuring secrets..."
    
    if (-not (Test-Path "../.env")) {
        Write-Error ".env file not found"
        exit 1
    }
    
    $envContent = Get-Content "../.env"
    $apiKey = ($envContent | Select-String "AZURE_OPENAI_API_KEY" | ForEach-Object { $_.Line.Split('=')[1] }).Trim()
    
    if ([string]::IsNullOrEmpty($apiKey)) {
        Write-Error "AZURE_OPENAI_API_KEY not found in .env"
        exit 1
    }
    
    & python -m azure.cli containerapp secret set `
        --name $AppName `
        --resource-group $ResourceGroup `
        --secrets "openai-key=$apiKey"
    
    Write-Success "Secrets configured"
}

# Update container app
function Update-ContainerApp {
    param([string]$LoginServer)
    
    Write-Info "Updating container app..."
    
    & python -m azure.cli containerapp update `
        --name $AppName `
        --resource-group $ResourceGroup `
        --image "${LoginServer}/greenops:latest"
    
    Write-Success "Container app updated"
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

# Test deployment
function Test-Deployment {
    Write-Info "Testing deployment..."
    Write-Info "Waiting 30 seconds for container to be ready..."
    Start-Sleep -Seconds 30
    
    $appUrl = & python -m azure.cli containerapp show `
        --name $AppName `
        --resource-group $ResourceGroup `
        --query properties.configuration.ingress.fqdn -o tsv
    
    Write-Info "Testing health endpoint: https://$appUrl/health"
    
    try {
        $response = Invoke-WebRequest -Uri "https://$appUrl/health" -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Success "Health check passed!"
        }
    } catch {
        Write-Warning "Health check failed (container may still be starting)"
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
    Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Deployment Information:" -ForegroundColor Cyan
    Write-Host "  App URL:              https://$appUrl" -ForegroundColor Yellow
    Write-Host "  Resource Group:       $ResourceGroup" -ForegroundColor Yellow
    Write-Host "  Container Registry:   $AcrName" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Useful Commands:" -ForegroundColor Cyan
    Write-Host "  View logs:             python -m azure.cli containerapp logs show --name $AppName --resource-group $ResourceGroup --follow" -ForegroundColor Yellow
    Write-Host "  Check status:          python -m azure.cli containerapp show --name $AppName --resource-group $ResourceGroup" -ForegroundColor Yellow
    Write-Host "  Restart app:           python -m azure.cli containerapp revision restart --name $AppName --resource-group $ResourceGroup" -ForegroundColor Yellow
    Write-Host ""
}

# Main execution
function Main {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "  GreenOps AI - Complete Azure Deployment" -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host ""
    
    Check-Prerequisites
    Create-ResourceGroup
    Deploy-Infrastructure
    Build-DockerImage
    $loginServer = Get-AcrLoginServer
    Login-ToAcr $AcrName
    Push-ToAcr $loginServer
    Configure-Secrets
    Update-ContainerApp $loginServer
    Configure-EnvVars
    Test-Deployment
    Get-DeploymentInfo
    
    Write-Success "Deployment completed successfully!"
}

# Run main
Main
