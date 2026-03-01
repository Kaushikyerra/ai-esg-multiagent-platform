# GreenOps AI - API Documentation

## Base URL
```
http://localhost:8000
```

## Endpoints

### GET /
Health check endpoint

**Response:**
```json
{
  "service": "GreenOps AI",
  "version": "1.0.0",
  "status": "operational"
}
```

### GET /health
Service health status

**Response:**
```json
{
  "status": "healthy"
}
```

### POST /analyze
Analyze CI/CD pipeline configuration

**Request Body:**
```json
{
  "pipeline_config": "string (YAML content)",
  "pipeline_type": "github_actions | azure_devops",
  "region": "azure_eastus | azure_westeurope | aws_us_east_1 | gcp_us_central1"
}
```

**Response:**
```json
{
  "status": "success",
  "pipeline_analysis": {
    "status": "success",
    "jobs_count": 3,
    "steps_count": 8,
    "estimated_duration_minutes": 25,
    "compute_size": "medium",
    "deployment_detected": true,
    "test_coverage_detected": true
  },
  "carbon_analysis": {
    "status": "success",
    "co2_grams": 156.25,
    "co2_kg": 0.1563,
    "power_consumption_kwh": 0.0625,
    "carbon_intensity": 415,
    "region": "azure_eastus",
    "trees_equivalent_per_year": 0.0027,
    "rating": "B"
  },
  "cost_analysis": {
    "status": "success",
    "compute_cost_usd": 0.1667,
    "storage_cost_usd": 0.03,
    "network_cost_usd": 0.06,
    "total_cost_usd": 0.2567,
    "monthly_projection_usd": 7.70,
    "cost_rating": "B",
    "optimization_potential": [
      "Add tests to catch issues early"
    ]
  },
  "risk_analysis": {
    "status": "success",
    "risk_score": 10,
    "risk_level": "LOW",
    "risk_factors": [
      {
        "factor": "Production deployment detected",
        "severity": "medium",
        "impact": 10
      }
    ],
    "recommendations": []
  },
  "policy_decision": {
    "status": "success",
    "decision": "APPROVED",
    "violations": [],
    "warnings": [],
    "passed": ["Carbon Limit", "Cost Limit", "Risk Threshold"],
    "can_proceed": true
  },
  "summary": {
    "can_proceed": true,
    "decision": "APPROVED",
    "carbon_rating": "B",
    "cost_rating": "B",
    "risk_level": "LOW"
  }
}
```

## Rating System

### Carbon Rating (A-F)
- A: < 50g CO₂ (Excellent)
- B: 50-150g CO₂ (Good)
- C: 150-300g CO₂ (Average)
- D: 300-500g CO₂ (Poor)
- F: > 500g CO₂ (Critical)

### Cost Rating (A-F)
- A: < $0.10 (Excellent)
- B: $0.10-$0.50 (Good)
- C: $0.50-$1.00 (Average)
- D: $1.00-$2.00 (Poor)
- F: > $2.00 (Critical)

### Risk Level
- LOW: 0-19
- MEDIUM: 20-49
- HIGH: 50-74
- CRITICAL: 75-100

## Policy Decisions
- **APPROVED**: All checks passed
- **APPROVED_WITH_WARNINGS**: Passed but has warnings
- **BLOCKED**: Failed one or more critical policies

## Error Responses

**400 Bad Request:**
```json
{
  "detail": "Pipeline analysis failed"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Error message"
}
```
