"""
GreenOps AI - Microsoft Agent Framework Implementation
Official implementation for AI Dev Days Hackathon

Uses ONLY Microsoft tools:
- Microsoft Agent Framework (official multi-agent framework)
- Azure OpenAI (GPT-4)
- Azure services
"""
import asyncio
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Import Microsoft Agent Framework agents
from agents.maf_pipeline_analyzer import MAFPipelineAnalyzerAgent
from agents.maf_carbon_estimator import MAFCarbonEstimatorAgent
from agents.maf_cost_calculator import MAFCostCalculatorAgent
from agents.maf_risk_scorer import MAFRiskScorerAgent
from agents.maf_policy_enforcer import MAFPolicyEnforcerAgent
from config import Config

# Setup logging
logging.basicConfig(
    level=getattr(logging, Config.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="GreenOps AI - Microsoft Agent Framework",
    version="2.0.0",
    description="AI-powered DevOps intelligence using Microsoft Agent Framework for AI Dev Days Hackathon"
)

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

# Initialize Microsoft Agent Framework agents
logger.info("="*60)
logger.info("Initializing Microsoft Agent Framework agents...")
logger.info("="*60)

pipeline_analyzer = MAFPipelineAnalyzerAgent()
carbon_estimator = MAFCarbonEstimatorAgent()
cost_calculator = MAFCostCalculatorAgent()
risk_scorer = MAFRiskScorerAgent()
policy_enforcer = MAFPolicyEnforcerAgent()

logger.info("✅ All Microsoft Agent Framework agents initialized")
logger.info(f"✅ Azure OpenAI configured: {Config.AZURE_OPENAI_API_KEY is not None}")
logger.info("="*60)

@app.get("/")
async def root():
    return {
        "service": "GreenOps AI",
        "version": "2.0.0",
        "framework": "Microsoft Agent Framework",
        "hackathon": "AI Dev Days 2026",
        "status": "operational",
        "ai_enhanced": Config.AZURE_OPENAI_API_KEY is not None,
        "microsoft_tools": [
            "Microsoft Agent Framework",
            "Azure OpenAI",
            "Azure Services"
        ]
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "framework": "Microsoft Agent Framework",
        "azure_openai_configured": Config.AZURE_OPENAI_API_KEY is not None,
        "agents": {
            "pipeline_analyzer": "ready",
            "carbon_estimator": "ready",
            "cost_calculator": "ready",
            "risk_scorer": "ready",
            "policy_enforcer": "ready"
        }
    }

@app.post("/analyze")
async def analyze_pipeline(request: PipelineAnalysisRequest):
    """
    Main analysis endpoint - orchestrates all Microsoft Agent Framework agents
    
    This endpoint demonstrates:
    - Multi-agent orchestration using Microsoft Agent Framework
    - AI-powered analysis with Azure OpenAI
    - Parallel agent execution
    - Policy-based governance
    """
    try:
        logger.info("="*60)
        logger.info("Starting Microsoft Agent Framework pipeline analysis")
        logger.info("="*60)
        
        # Step 1: Analyze pipeline
        context = {
            "pipeline_config": request.pipeline_config,
            "pipeline_type": request.pipeline_type,
            "region": request.region
        }
        
        logger.info("Step 1: Pipeline Analysis...")
        pipeline_result = await pipeline_analyzer.analyze(context)
        if pipeline_result.get("status") != "success":
            raise HTTPException(status_code=400, detail="Pipeline analysis failed")
        
        # Update context with pipeline analysis
        context.update(pipeline_result)
        
        # Step 2: Run parallel analysis (carbon, cost, risk)
        logger.info("Step 2: Parallel Agent Analysis (Carbon, Cost, Risk)...")
        carbon_task = carbon_estimator.analyze(context)
        cost_task = cost_calculator.analyze(context)
        risk_task = risk_scorer.analyze(context)
        
        carbon_result, cost_result, risk_result = await asyncio.gather(
            carbon_task, cost_task, risk_task
        )
        
        # Step 3: Enforce policies
        logger.info("Step 3: Policy Enforcement...")
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
            "framework": "Microsoft Agent Framework",
            "hackathon": "AI Dev Days 2026",
            "ai_enhanced": carbon_result.get("ai_enhanced", False),
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
        
        logger.info("="*60)
        logger.info(f"✅ Analysis complete: {report['summary']['decision']}")
        logger.info(f"✅ AI Enhanced: {report['ai_enhanced']}")
        logger.info("="*60)
        
        return report
        
    except Exception as e:
        logger.error(f"❌ Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    logger.info("="*60)
    logger.info("🚀 Starting GreenOps AI with Microsoft Agent Framework")
    logger.info("🏆 AI Dev Days Hackathon 2026")
    logger.info(f"✅ Azure OpenAI: {'Configured' if Config.AZURE_OPENAI_API_KEY else 'Fallback Mode'}")
    logger.info("="*60)
    uvicorn.run(app, host="0.0.0.0", port=Config.PORT)
