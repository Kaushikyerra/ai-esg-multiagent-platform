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
import json
import uuid
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List

# Import Microsoft Agent Framework agents
from agents.maf_pipeline_analyzer import MAFPipelineAnalyzerAgent
from agents.maf_carbon_estimator import MAFCarbonEstimatorAgent
from agents.maf_cost_calculator import MAFCostCalculatorAgent
from agents.maf_risk_scorer import MAFRiskScorerAgent
from agents.maf_policy_enforcer import MAFPolicyEnforcerAgent
from agents.maf_downtime_agent import MAFDowntimeAgent
from config import Config
from database import db

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

# In-memory history store (last 50 analyses)
analysis_history: List[dict] = []

# Initialize Microsoft Agent Framework agents
logger.info("="*60)
logger.info("Initializing Microsoft Agent Framework agents...")
logger.info("="*60)

pipeline_analyzer = MAFPipelineAnalyzerAgent()
carbon_estimator = MAFCarbonEstimatorAgent()
cost_calculator = MAFCostCalculatorAgent()
risk_scorer = MAFRiskScorerAgent()
downtime_agent = MAFDowntimeAgent()
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
        "database": "Azure Table Storage" if db.is_connected else "In-Memory",
        "microsoft_tools": [
            "Microsoft Agent Framework",
            "Azure OpenAI GPT-4o",
            "Azure Table Storage"
        ]
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "framework": "Microsoft Agent Framework",
        "azure_openai_configured": Config.AZURE_OPENAI_API_KEY is not None,
        "database": "Azure Table Storage" if db.is_connected else "In-Memory",
        "agents": {
            "pipeline_analyzer": "ready",
            "carbon_estimator": "ready",
            "cost_calculator": "ready",
            "risk_scorer": "ready",
            "downtime_agent": "ready",
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
        
        # Step 3: Downtime prediction
        logger.info("Step 3: Downtime Prediction...")
        downtime_context = {**context, **risk_result}
        downtime_result = await downtime_agent.analyze(downtime_context)

        # Step 4: Enforce policies
        logger.info("Step 4: Policy Enforcement...")
        policy_context = {
            **context,
            "carbon_analysis": carbon_result,
            "cost_analysis": cost_result,
            "risk_analysis": risk_result,
            "downtime_analysis": downtime_result
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
            "downtime_analysis": downtime_result,
            "policy_decision": policy_result,
            "summary": {
                "can_proceed": policy_result.get("can_proceed", False),
                "decision": policy_result.get("decision", "UNKNOWN"),
                "carbon_rating": carbon_result.get("rating", "N/A"),
                "cost_rating": cost_result.get("cost_rating", "N/A"),
                "risk_level": risk_result.get("risk_level", "N/A"),
                "downtime_risk_score": downtime_result.get("downtime_risk_score", 0),
                "downtime_probability": downtime_result.get("downtime_probability", "N/A")
            }
        }
        
        logger.info("="*60)
        logger.info(f"✅ Analysis complete: {report['summary']['decision']}")
        logger.info(f"✅ AI Enhanced: {report['ai_enhanced']}")
        logger.info("="*60)
        
        # Store in Azure Table Storage
        analysis_id = str(uuid.uuid4())
        db.save_analysis(analysis_id, {
            "pipeline_type": request.pipeline_type,
            "region": request.region,
        }, report)

        # Also keep in-memory for fast access
        history_entry = {
            "id": analysis_id,
            "timestamp": datetime.utcnow().isoformat(),
            "pipeline_type": request.pipeline_type,
            "region": request.region,
            "decision": report["summary"]["decision"],
            "co2_kg": report["carbon_analysis"].get("co2_kg", 0),
            "cost_usd": report["cost_analysis"].get("total_cost_usd", 0),
            "risk_score": report["risk_analysis"].get("risk_score", 0),
        }
        analysis_history.append(history_entry)
        if len(analysis_history) > 50:
            analysis_history.pop(0)
        
        return report
        
    except Exception as e:
        logger.error(f"❌ Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history():
    """Return analysis history from Azure Table Storage"""
    db_history = db.get_history(50)
    if db_history:
        return {"history": db_history, "total": len(db_history), "source": "Azure Table Storage"}
    # Fallback to in-memory
    return {"history": list(reversed(analysis_history)), "total": len(analysis_history), "source": "in-memory"}


@app.get("/stats")
async def get_stats():
    """Aggregate stats from Azure Table Storage"""
    return db.get_stats()


@app.post("/report", response_class=HTMLResponse)
async def generate_report(request: PipelineAnalysisRequest):
    """Generate an HTML compliance report for a pipeline"""
    try:
        context = {
            "pipeline_config": request.pipeline_config,
            "pipeline_type": request.pipeline_type,
            "region": request.region
        }

        pipeline_result = await pipeline_analyzer.analyze(context)
        if pipeline_result.get("status") != "success":
            raise HTTPException(status_code=400, detail="Pipeline analysis failed")
        context.update(pipeline_result)

        carbon_result, cost_result, risk_result = await asyncio.gather(
            carbon_estimator.analyze(context),
            cost_calculator.analyze(context),
            risk_scorer.analyze(context)
        )

        policy_context = {**context, "carbon_analysis": carbon_result,
                          "cost_analysis": cost_result, "risk_analysis": risk_result}
        policy_result = await policy_enforcer.analyze(policy_context)

        decision = policy_result.get("decision", "UNKNOWN")
        decision_color = {"APPROVED": "#16a34a", "WARNING": "#d97706", "BLOCKED": "#dc2626"}.get(decision, "#6b7280")
        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

        violations_html = "".join(f"<li>❌ {v}</li>" for v in policy_result.get("violations", []))
        warnings_html = "".join(f"<li>⚠️ {w}</li>" for w in policy_result.get("warnings", []))
        passed_html = "".join(f"<li>✅ {p}</li>" for p in policy_result.get("passed", []))
        risk_factors_html = "".join(
            f"<li><strong>{f['factor']}</strong> — severity: {f['severity']}</li>"
            for f in risk_result.get("risk_factors", [])
        )
        recommendations_html = "".join(
            f"<li>{r}</li>" for r in (
                cost_result.get("optimization_potential", []) +
                risk_result.get("recommendations", [])
            )
        )

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>GreenOps AI - Compliance Report</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; background: #f9fafb; color: #111827; }}
    .header {{ background: linear-gradient(135deg, #16a34a, #059669); color: white; padding: 32px 48px; }}
    .header h1 {{ margin: 0; font-size: 28px; }}
    .header p {{ margin: 4px 0 0; opacity: 0.85; font-size: 14px; }}
    .container {{ max-width: 900px; margin: 32px auto; padding: 0 24px; }}
    .decision-banner {{ border-radius: 12px; padding: 24px 32px; margin-bottom: 24px; border: 2px solid {decision_color}; background: {decision_color}18; }}
    .decision-banner h2 {{ margin: 0; font-size: 32px; color: {decision_color}; }}
    .decision-banner p {{ margin: 4px 0 0; color: #374151; }}
    .grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }}
    .card {{ background: white; border-radius: 10px; padding: 20px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,.06); }}
    .card .label {{ font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; }}
    .card .value {{ font-size: 28px; font-weight: 700; margin-top: 4px; }}
    .card .sub {{ font-size: 13px; color: #6b7280; margin-top: 2px; }}
    .section {{ background: white; border-radius: 10px; padding: 24px; border: 1px solid #e5e7eb; margin-bottom: 16px; }}
    .section h3 {{ margin: 0 0 16px; font-size: 16px; color: #374151; }}
    ul {{ margin: 0; padding-left: 20px; }}
    li {{ margin-bottom: 6px; font-size: 14px; color: #374151; }}
    .footer {{ text-align: center; padding: 24px; font-size: 12px; color: #9ca3af; }}
  </style>
</head>
<body>
  <div class="header">
    <h1>🌱 GreenOps AI — Compliance Report</h1>
    <p>AI Dev Days Hackathon 2026 · Microsoft Agent Framework · Generated {timestamp}</p>
  </div>
  <div class="container">
    <div class="decision-banner">
      <h2>{decision}</h2>
      <p>Pipeline type: {request.pipeline_type} · Region: {request.region} · Can proceed: {policy_result.get('can_proceed', False)}</p>
    </div>

    <div class="grid">
      <div class="card">
        <div class="label">Carbon Emissions</div>
        <div class="value" style="color:#16a34a">{carbon_result.get('co2_kg', 0)} kg</div>
        <div class="sub">Rating: {carbon_result.get('rating', 'N/A')} · {carbon_result.get('co2_grams', 0)} g CO₂</div>
      </div>
      <div class="card">
        <div class="label">Deployment Cost</div>
        <div class="value" style="color:#2563eb">${cost_result.get('total_cost_usd', 0)}</div>
        <div class="sub">Monthly: ${cost_result.get('monthly_projection_usd', 0)} · Rating: {cost_result.get('cost_rating', 'N/A')}</div>
      </div>
      <div class="card">
        <div class="label">Risk Score</div>
        <div class="value" style="color:#d97706">{risk_result.get('risk_score', 0)}/100</div>
        <div class="sub">Level: {risk_result.get('risk_level', 'N/A')}</div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(4, 1fr)">
      <div class="card">
        <div class="label">Jobs</div>
        <div class="value">{pipeline_result.get('jobs_count', 0)}</div>
      </div>
      <div class="card">
        <div class="label">Steps</div>
        <div class="value">{pipeline_result.get('steps_count', 0)}</div>
      </div>
      <div class="card">
        <div class="label">Duration</div>
        <div class="value">{pipeline_result.get('estimated_duration_minutes', 0)}<span style="font-size:14px;font-weight:400"> min</span></div>
      </div>
      <div class="card">
        <div class="label">Compute</div>
        <div class="value" style="font-size:18px">{pipeline_result.get('compute_size', 'N/A').upper()}</div>
      </div>
    </div>

    <div class="section">
      <h3>🛡️ Policy Checks</h3>
      {"<ul>" + passed_html + "</ul>" if passed_html else ""}
      {"<ul>" + warnings_html + "</ul>" if warnings_html else ""}
      {"<ul>" + violations_html + "</ul>" if violations_html else ""}
    </div>

    {"<div class='section'><h3>⚠️ Risk Factors</h3><ul>" + risk_factors_html + "</ul></div>" if risk_factors_html else ""}

    {"<div class='section'><h3>💡 Recommendations</h3><ul>" + recommendations_html + "</ul></div>" if recommendations_html else ""}

    <div class="footer">GreenOps AI · Microsoft Agent Framework · AI Dev Days Hackathon 2026</div>
  </div>
</body>
</html>"""
        return HTMLResponse(content=html)

    except Exception as e:
        logger.error(f"Report generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    logger.info("="*60)
    logger.info("🚀 Starting GreenOps AI with Microsoft Agent Framework")
    logger.info("🏆 AI Dev Days Hackathon 2026")
    logger.info(f"✅ Azure OpenAI: {'Configured' if Config.AZURE_OPENAI_API_KEY else 'Fallback Mode'}")
    logger.info("="*60)
    uvicorn.run(app, host="0.0.0.0", port=Config.PORT)
