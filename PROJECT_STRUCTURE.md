# GreenOps AI - Project Structure

```
greenops-ai/
├── .github/
│   └── workflows/
│       ├── ci.yaml                    # CI pipeline (lint, test, build)
│       └── azure-deploy.yaml          # Azure deployment workflow
│
├── orchestrator/                      # Main application package
│   ├── __init__.py
│   ├── main.py                        # FastAPI server & orchestration
│   ├── config.py                      # Configuration management
│   └── agents/                        # Multi-agent system
│       ├── __init__.py
│       ├── base_agent.py              # Base agent class
│       ├── pipeline_analyzer.py       # Parses CI/CD configs
│       ├── carbon_estimator.py        # Carbon footprint calculation
│       ├── cost_calculator.py         # Cost estimation
│       ├── risk_scorer.py             # Risk assessment
│       └── policy_enforcer.py         # Policy gates
│
├── deploy/                            # Deployment resources
│   ├── deploy.sh                      # Azure deployment script
│   └── azure-resources.bicep          # Infrastructure as Code
│
├── examples/                          # Sample data for testing
│   ├── sample_pipeline.yaml           # Sample GitHub Actions pipeline
│   └── sample_request.json            # Sample API request
│
├── frontend/                          # Frontend resources (Member 2)
│   ├── README.md                      # Frontend setup guide
│   └── sample-component.tsx           # React component example
│
├── tests/                             # Test suite (Member 3)
│   ├── __init__.py
│   └── test_agents.py                 # Agent unit tests
│
├── docs/                              # Documentation (Member 3)
│   └── API.md                         # API documentation
│
├── .env.example                       # Environment template
├── .gitignore                         # Git ignore rules
├── Dockerfile                         # Container definition
├── requirements.txt                   # Python dependencies
├── test_api.py                        # Quick API test script
├── README.md                          # Project overview
├── SETUP.md                           # Setup instructions
├── HACKATHON.md                       # Hackathon submission doc
└── PROJECT_STRUCTURE.md               # This file
```

## Component Responsibilities

### Orchestrator (orchestrator/)
**Owner: Member 1**
- FastAPI server setup
- Multi-agent orchestration
- Request/response handling
- Agent coordination logic

### Agents (orchestrator/agents/)
**Owner: Member 1**
- Individual agent implementations
- Analysis algorithms
- Policy enforcement logic
- Scoring systems

### Cloud Infrastructure (deploy/)
**Owner: Member 4 (You)**
- Azure Bicep templates
- Deployment scripts
- CI/CD pipelines
- Container configuration

### Frontend (frontend/)
**Owner: Member 2**
- React/Next.js dashboard
- Data visualization
- User interface
- API integration

### Testing (tests/)
**Owner: Member 3**
- Unit tests for agents
- Integration tests
- API endpoint tests
- Test coverage reports

### Documentation (docs/, *.md)
**Owner: Member 3**
- API documentation
- Setup guides
- Architecture docs
- User guides

## Development Workflow

### 1. Initial Setup (All Members)
```bash
git clone <repo>
cd greenops-ai
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Add Azure OpenAI credentials to .env
```

### 2. Backend Development (Member 1)
```bash
# Run server
python orchestrator/main.py

# Test changes
python test_api.py

# Run tests
pytest tests/ -v
```

### 3. Frontend Development (Member 2)
```bash
cd frontend
# Setup your React/Next.js project
# API endpoint: http://localhost:8000
```

### 4. Testing (Member 3)
```bash
# Run all tests
pytest tests/ -v --cov=orchestrator

# Run specific test
pytest tests/test_agents.py::test_pipeline_analyzer -v

# Generate coverage report
pytest tests/ --cov=orchestrator --cov-report=html
```

### 5. Cloud/DevOps (Member 4)
```bash
# Test Docker build
docker build -t greenops-ai .
docker run -p 8000:8000 --env-file .env greenops-ai

# Deploy to Azure
cd deploy
./deploy.sh
```

## Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fixes

### Commit Convention
```
feat: Add carbon estimator agent
fix: Correct cost calculation
docs: Update API documentation
test: Add risk scorer tests
deploy: Update Azure Bicep template
```

## Demo Preparation Checklist

- [ ] Backend API running and tested
- [ ] Sample pipelines prepared
- [ ] Frontend dashboard deployed
- [ ] Azure deployment working
- [ ] Documentation complete
- [ ] Presentation slides ready
- [ ] Demo script practiced
- [ ] Backup plan for live demo

## Key Files for Demo

1. **HACKATHON.md** - Submission document
2. **examples/sample_pipeline.yaml** - Demo pipeline
3. **test_api.py** - Quick API demo
4. **Frontend dashboard** - Visual demo
5. **docs/API.md** - Technical reference
