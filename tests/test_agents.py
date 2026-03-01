"""Tests for GreenOps AI agents"""
import pytest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from orchestrator.agents.pipeline_analyzer import PipelineAnalyzerAgent
from orchestrator.agents.carbon_estimator import CarbonEstimatorAgent
from orchestrator.agents.cost_calculator import CostCalculatorAgent
from orchestrator.agents.risk_scorer import RiskScorerAgent
from orchestrator.agents.policy_enforcer import PolicyEnforcerAgent

@pytest.mark.asyncio
async def test_pipeline_analyzer():
    """Test pipeline analyzer agent"""
    agent = PipelineAnalyzerAgent()
    
    context = {
        "pipeline_config": """
name: Test Pipeline
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Build
        run: echo "Building"
""",
        "pipeline_type": "github_actions"
    }
    
    result = await agent.analyze(context)
    
    assert result["status"] == "success"
    assert result["jobs_count"] >= 1
    assert "estimated_duration_minutes" in result

@pytest.mark.asyncio
async def test_carbon_estimator():
    """Test carbon estimator agent"""
    agent = CarbonEstimatorAgent()
    
    context = {
        "estimated_duration_minutes": 10,
        "compute_size": "medium",
        "region": "azure_eastus"
    }
    
    result = await agent.analyze(context)
    
    assert result["status"] == "success"
    assert result["co2_kg"] > 0
    assert result["rating"] in ["A", "B", "C", "D", "F"]

@pytest.mark.asyncio
async def test_cost_calculator():
    """Test cost calculator agent"""
    agent = CostCalculatorAgent()
    
    context = {
        "estimated_duration_minutes": 10,
        "compute_size": "medium",
        "jobs_count": 2
    }
    
    result = await agent.analyze(context)
    
    assert result["status"] == "success"
    assert result["total_cost_usd"] > 0
    assert result["cost_rating"] in ["A", "B", "C", "D", "F"]

@pytest.mark.asyncio
async def test_risk_scorer():
    """Test risk scorer agent"""
    agent = RiskScorerAgent()
    
    context = {
        "test_coverage_detected": False,
        "deployment_detected": True,
        "steps_count": 25
    }
    
    result = await agent.analyze(context)
    
    assert result["status"] == "success"
    assert 0 <= result["risk_score"] <= 100
    assert result["risk_level"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

@pytest.mark.asyncio
async def test_policy_enforcer():
    """Test policy enforcer agent"""
    agent = PolicyEnforcerAgent()
    
    context = {
        "carbon_analysis": {"co2_kg": 0.3},
        "cost_analysis": {"total_cost_usd": 0.5},
        "risk_analysis": {"risk_score": 30}
    }
    
    result = await agent.analyze(context)
    
    assert result["status"] == "success"
    assert result["decision"] in ["APPROVED", "APPROVED_WITH_WARNINGS", "BLOCKED"]
    assert "can_proceed" in result
