import asyncio
import logging
import sys
from pathlib import Path

# Add orchestrator directory to path
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from agents.pipeline_analyzer import PipelineAnalyzerAgent
from agents.carbon_estimator import CarbonEstimatorAgent
from agents.cost_calculator import CostCalculatorAgent
from agents.risk_scorer import RiskScorerAgent
from agents.policy_enforcer import PolicyEnforcerAgent
from config import Config

# Setup logging
logging.basicConfig(
    level=getattr(logging, Config.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(title="GreenOps AI", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class PipelineAnalysisRequest(BaseModel):
    pipeline_config: str
    pipeline_type: str = "github_actions"
    region: Optional[str] = "azure_eastus"

# Initialize agents
pipeline_analyzer = PipelineAnalyzerAgent()
carbon_estimator = CarbonEstimatorAgent()
cost_calculator = CostCalculatorAgent()
risk_scorer = RiskScorerAgent()
policy_enforcer = PolicyEnforcerAgent()

@app.get("/")
async def root():
    return {
        "service": "GreenOps AI",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze_pipeline(request: PipelineAnalysisRequest):
    """Main analysis endpoint - orchestrates all agents"""
    try:
        logger.info("Starting pipeline analysis")
        
        # Step 1: Analyze pipeline
        context = {
            "pipeline_config": request.pipeline_config,
            "pipeline_type": request.pipeline_type,
            "region": request.region
        }
        
        pipeline_result = await pipeline_analyzer.analyze(context)
        if pipeline_result.get("status") != "success":
            raise HTTPException(status_code=400, detail="Pipeline analysis failed")
        
        # Update context with pipeline analysis
        context.update(pipeline_result)
        
        # Step 2: Run parallel analysis (carbon, cost, risk)
        carbon_task = carbon_estimator.analyze(context)
        cost_task = cost_calculator.analyze(context)
        risk_task = risk_scorer.analyze(context)
        
        carbon_result, cost_result, risk_result = await asyncio.gather(
            carbon_task, cost_task, risk_task
        )
        
        # Step 3: Enforce policies
        policy_context = {
            **context,
            "carbon_analysis": carbon_result,
            "cost_analysis": cost_result,
            "risk_analysis": risk_result
        }
        
        policy_result = await policy_enforcer.analyze(policy_context)
        
        # Step 4: Compile final report
        report = {
            "status": "success",
            "pipeline_analysis": pipeline_result,
            "carbon_analysis": carbon_result,
            "cost_analysis": cost_result,
            "risk_analysis": risk_result,
            "policy_decision": policy_result,
            "summary": {
                "can_proceed": policy_result.get("can_proceed", False),
                "decision": policy_result.get("decision", "UNKNOWN"),
                "carbon_rating": carbon_result.get("rating", "N/A"),
                "cost_rating": cost_result.get("cost_rating", "N/A"),
                "risk_level": risk_result.get("risk_level", "N/A")
            }
        }
        
        logger.info(f"Analysis complete: {report['summary']['decision']}")
        return report
        
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting GreenOps AI server...")
    uvicorn.run(app, host="0.0.0.0", port=Config.PORT)