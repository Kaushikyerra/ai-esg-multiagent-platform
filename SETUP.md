# GreenOps AI - Setup Guide

## Prerequisites
- Python 3.11+
- Azure account with OpenAI access
- Docker (for deployment)
- Azure CLI (for deployment)

## Local Development Setup

### 1. Clone and Setup Environment
```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Azure OpenAI
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your Azure OpenAI credentials:
# AZURE_OPENAI_API_KEY=your_key_here
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
```

### 3. Run the API Server
```bash
python orchestrator/main.py
```

Server will start at `http://localhost:8000`

### 4. Test the API
```bash
# In another terminal
python test_api.py
```

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Analyze Pipeline
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d @examples/sample_request.json
```

## Azure Deployment

### 1. Login to Azure
```bash
az login
```

### 2. Run Deployment Script
```bash
cd deploy
chmod +x deploy.sh
./deploy.sh
```

### 3. Set Environment Variables
```bash
az containerapp update \
  --name greenops-ai \
  --resource-group greenops-rg \
  --set-env-vars \
    AZURE_OPENAI_API_KEY=your_key \
    AZURE_OPENAI_ENDPOINT=your_endpoint
```

## Team Workflow

### Member 1 (Backend/Agents)
- Work in `orchestrator/agents/` directory
- Add new agents by extending `BaseAgent`
- Test with `test_api.py`

### Member 2 (Frontend)
- API base URL: `http://localhost:8000`
- Key endpoints: `/analyze`, `/health`
- Response format documented in API section

### Member 3 (Documentation/Testing)
- Add tests in `tests/` directory
- Update documentation in `docs/`
- Test with sample pipelines in `examples/`

### Member 4 (Cloud/DevOps)
- Azure resources in `deploy/`
- CI/CD in `.github/workflows/`
- Monitor with Azure Portal

## Troubleshooting

### Import Errors
```bash
# Make sure you're in the project root
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### Azure OpenAI Connection Issues
- Verify API key and endpoint in `.env`
- Check Azure OpenAI deployment name
- Ensure API version is correct

### Docker Build Issues
```bash
# Test locally first
docker build -t greenops-test .
docker run -p 8000:8000 --env-file .env greenops-test
```
