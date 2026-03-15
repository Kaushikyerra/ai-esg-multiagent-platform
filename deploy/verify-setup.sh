#!/bin/bash

# GreenOps AI - Setup Verification Script
# This script verifies that all prerequisites and configurations are in place

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Functions
log_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

log_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Checking Prerequisites${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    
    # Check Azure CLI
    if command -v az &> /dev/null; then
        log_pass "Azure CLI installed"
        AZ_VERSION=$(az --version | head -1)
        log_info "Version: $AZ_VERSION"
    else
        log_fail "Azure CLI not installed"
    fi
    
    # Check Docker
    if command -v docker &> /dev/null; then
        log_pass "Docker installed"
        DOCKER_VERSION=$(docker --version)
        log_info "Version: $DOCKER_VERSION"
    else
        log_fail "Docker not installed"
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        log_pass "Git installed"
        GIT_VERSION=$(git --version)
        log_info "Version: $GIT_VERSION"
    else
        log_fail "Git not installed"
    fi
    
    # Check Python
    if command -v python &> /dev/null; then
        log_pass "Python installed"
        PYTHON_VERSION=$(python --version)
        log_info "Version: $PYTHON_VERSION"
    else
        log_fail "Python not installed"
    fi
}

# Check Azure configuration
check_azure_config() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Checking Azure Configuration${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    
    # Check Azure login
    if az account show &> /dev/null; then
        log_pass "Azure CLI authenticated"
        ACCOUNT=$(az account show --query name -o tsv)
        log_info "Account: $ACCOUNT"
    else
        log_fail "Azure CLI not authenticated - run 'az login'"
    fi
    
    # Check subscription
    if az account show &> /dev/null; then
        SUBSCRIPTION=$(az account show --query id -o tsv)
        log_pass "Subscription accessible"
        log_info "Subscription ID: $SUBSCRIPTION"
    else
        log_fail "Cannot access subscription"
    fi
}

# Check environment configuration
check_env_config() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Checking Environment Configuration${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    
    # Check .env file
    if [ -f ../.env ]; then
        log_pass ".env file exists"
        
        # Check required variables
        if grep -q "AZURE_OPENAI_API_KEY" ../.env; then
            log_pass "AZURE_OPENAI_API_KEY configured"
        else
            log_fail "AZURE_OPENAI_API_KEY not configured"
        fi
        
        if grep -q "AZURE_OPENAI_ENDPOINT" ../.env; then
            log_pass "AZURE_OPENAI_ENDPOINT configured"
        else
            log_fail "AZURE_OPENAI_ENDPOINT not configured"
        fi
        
        if grep -q "AZURE_OPENAI_DEPLOYMENT_NAME" ../.env; then
            log_pass "AZURE_OPENAI_DEPLOYMENT_NAME configured"
        else
            log_fail "AZURE_OPENAI_DEPLOYMENT_NAME not configured"
        fi
    else
        log_fail ".env file not found - copy from .env.example"
    fi
}

# Check project structure
check_project_structure() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Checking Project Structure${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    
    # Check required directories
    if [ -d ../orchestrator ]; then
        log_pass "orchestrator directory exists"
    else
        log_fail "orchestrator directory not found"
    fi
    
    if [ -d ../tests ]; then
        log_pass "tests directory exists"
    else
        log_fail "tests directory not found"
    fi
    
    if [ -d ../.github/workflows ]; then
        log_pass ".github/workflows directory exists"
    else
        log_fail ".github/workflows directory not found"
    fi
    
    # Check required files
    if [ -f ../Dockerfile ]; then
        log_pass "Dockerfile exists"
    else
        log_fail "Dockerfile not found"
    fi
    
    if [ -f ../requirements.txt ]; then
        log_pass "requirements.txt exists"
    else
        log_fail "requirements.txt not found"
    fi
    
    if [ -f azure-resources.bicep ]; then
        log_pass "azure-resources.bicep exists"
    else
        log_fail "azure-resources.bicep not found"
    fi
}

# Check Docker configuration
check_docker_config() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Checking Docker Configuration${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    
    # Try to build Docker image
    log_info "Building Docker image (this may take a minute)..."
    if docker build -t greenops-ai:test .. &> /dev/null; then
        log_pass "Docker image builds successfully"
        
        # Check image size
        IMAGE_SIZE=$(docker images greenops-ai:test --format "{{.Size}}")
        log_info "Image size: $IMAGE_SIZE"
    else
        log_fail "Docker image build failed"
    fi
}

# Check deployment files
check_deployment_files() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Checking Deployment Files${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    
    # Check deployment script
    if [ -f deploy.sh ]; then
        log_pass "deploy.sh exists"
        if [ -x deploy.sh ]; then
            log_pass "deploy.sh is executable"
        else
            log_warn "deploy.sh is not executable - run 'chmod +x deploy.sh'"
        fi
    else
        log_fail "deploy.sh not found"
    fi
    
    # Check monitoring script
    if [ -f monitoring-setup.sh ]; then
        log_pass "monitoring-setup.sh exists"
    else
        log_fail "monitoring-setup.sh not found"
    fi
    
    # Check Bicep template
    if [ -f azure-resources.bicep ]; then
        log_pass "azure-resources.bicep exists"
    else
        log_fail "azure-resources.bicep not found"
    fi
}

# Check documentation
check_documentation() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Checking Documentation${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    
    # Check deployment guide
    if [ -f DEPLOYMENT_GUIDE.md ]; then
        log_pass "DEPLOYMENT_GUIDE.md exists"
    else
        log_fail "DEPLOYMENT_GUIDE.md not found"
    fi
    
    # Check DevOps guide
    if [ -f ../DEVOPS_GUIDE.md ]; then
        log_pass "DEVOPS_GUIDE.md exists"
    else
        log_fail "DEVOPS_GUIDE.md not found"
    fi
    
    # Check scaling guide
    if [ -f SCALING_AND_PERFORMANCE.md ]; then
        log_pass "SCALING_AND_PERFORMANCE.md exists"
    else
        log_fail "SCALING_AND_PERFORMANCE.md not found"
    fi
    
    # Check disaster recovery guide
    if [ -f DISASTER_RECOVERY.md ]; then
        log_pass "DISASTER_RECOVERY.md exists"
    else
        log_fail "DISASTER_RECOVERY.md not found"
    fi
}

# Generate report
generate_report() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Verification Report${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    
    TOTAL=$((PASSED + FAILED + WARNINGS))
    
    echo ""
    echo -e "Total Checks: $TOTAL"
    echo -e "${GREEN}Passed: $PASSED${NC}"
    echo -e "${RED}Failed: $FAILED${NC}"
    echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
    echo ""
    
    if [ $FAILED -eq 0 ]; then
        echo -e "${GREEN}✅ All checks passed! Ready for deployment.${NC}"
        return 0
    else
        echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
        return 1
    fi
}

# Main execution
main() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║    GreenOps AI - Setup Verification Script                ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    
    check_prerequisites
    check_azure_config
    check_env_config
    check_project_structure
    check_docker_config
    check_deployment_files
    check_documentation
    generate_report
}

# Run main function
main
