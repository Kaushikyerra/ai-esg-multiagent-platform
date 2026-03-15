import asyncio
import logging
import sys
import os
import random
from pathlib import Path
from typing import Dict

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
from agents.downtime_agent import DowntimeAgent
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
carbon_estimator  = CarbonEstimatorAgent()
cost_calculator   = CostCalculatorAgent()
risk_scorer       = RiskScorerAgent()
policy_enforcer   = PolicyEnforcerAgent()
downtime_agent    = DowntimeAgent()

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
            raise HTTPException(status_code=400, detail=f"Pipeline analysis failed: {pipeline_result.get('error', 'unknown error')}")
        
        # Update context with pipeline analysis
        context.update(pipeline_result)
        
        # Step 2: Run parallel analysis (carbon, cost, risk, downtime)
        carbon_task   = carbon_estimator.analyze(context)
        cost_task     = cost_calculator.analyze(context)
        risk_task     = risk_scorer.analyze(context)
        downtime_task = downtime_agent.analyze(context)

        carbon_result, cost_result, risk_result, downtime_result = await asyncio.gather(
            carbon_task, cost_task, risk_task, downtime_task
        )
        
        # Step 3: Enforce policies
        policy_context = {
            **context,
            "carbon_analysis":   carbon_result,
            "cost_analysis":     cost_result,
            "risk_analysis":     risk_result,
            "downtime_analysis": downtime_result,
        }
        
        policy_result = await policy_enforcer.analyze(policy_context)
        
        # Step 4: Compile final report
        # Normalise downtime_probability to a number (agent returns string label)
        prob_map = {"Low": 15, "Medium": 45, "High": 70, "Critical": 90}
        raw_prob = downtime_result.get("downtime_probability", "Low")
        downtime_result["downtime_probability"] = prob_map.get(raw_prob, raw_prob) if isinstance(raw_prob, str) else raw_prob

        report = {
            "status": "success",
            "pipeline_analysis": pipeline_result,
            "carbon_analysis":   carbon_result,
            "cost_analysis":     cost_result,
            "risk_analysis":     risk_result,
            "downtime_analysis": downtime_result,
            "policy_decision":   policy_result,
            "summary": {
                "can_proceed":    policy_result.get("can_proceed", False),
                "decision":       policy_result.get("decision", "UNKNOWN"),
                "carbon_rating":  carbon_result.get("rating", "N/A"),
                "cost_rating":    cost_result.get("cost_rating", "N/A"),
                "risk_level":     risk_result.get("risk_level", "N/A"),
            }
        }
        
        logger.info(f"Analysis complete: {report['summary']['decision']}")
        return report
        
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ── OTP store (phone → code, expires after use) ───────────────────────────
otp_store: Dict[str, str] = {}

class OTPSendRequest(BaseModel):
    phone: str   # full E.164 format e.g. +919876543210

class OTPVerifyRequest(BaseModel):
    phone: str
    code: str

@app.post("/send-otp")
async def send_otp(req: OTPSendRequest):
    """Generate OTP and send via Twilio SMS"""
    account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
    auth_token  = os.getenv("TWILIO_AUTH_TOKEN", "")
    from_number = os.getenv("TWILIO_PHONE_NUMBER", "")

    if not account_sid or not auth_token or not from_number:
        raise HTTPException(status_code=500, detail="Twilio credentials not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env")

    # Validate phone format
    phone = req.phone.strip()
    if not phone.startswith("+") or len(phone) < 8:
        raise HTTPException(status_code=400, detail="Phone must be in E.164 format e.g. +919876543210")

    # Generate 6-digit OTP
    code = str(random.randint(100000, 999999))
    otp_store[phone] = code

    try:
        from twilio.rest import Client
        client = Client(account_sid, auth_token)
        client.messages.create(
            body=f"Your GreenOps AI verification code is: {code}. Valid for 10 minutes.",
            from_=from_number,
            to=phone
        )
        logger.info(f"OTP sent to {phone}")
        return {"success": True, "message": f"OTP sent to {phone}"}
    except Exception as e:
        logger.error(f"Twilio error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send SMS: {str(e)}")

@app.post("/verify-otp")
async def verify_otp(req: OTPVerifyRequest):
    """Verify OTP code"""
    phone = req.phone.strip()
    stored = otp_store.get(phone)
    if not stored:
        raise HTTPException(status_code=400, detail="No OTP found for this number. Request a new one.")
    if stored != req.code.strip():
        raise HTTPException(status_code=400, detail="Incorrect code. Please try again.")
    # Consume OTP — single use
    del otp_store[phone]
    return {"success": True, "message": "Phone verified successfully"}


@app.post("/report")
async def download_report(request: PipelineAnalysisRequest):
    """Run full analysis and return a downloadable HTML report"""
    from fastapi.responses import HTMLResponse
    try:
        context = {
            "pipeline_config": request.pipeline_config,
            "pipeline_type":   request.pipeline_type,
            "region":          request.region,
        }
        pipeline_result = await pipeline_analyzer.analyze(context)
        context.update(pipeline_result)

        carbon_result, cost_result, risk_result, downtime_result = await asyncio.gather(
            carbon_estimator.analyze(context),
            cost_calculator.analyze(context),
            risk_scorer.analyze(context),
            downtime_agent.analyze(context),
        )
        prob_map = {"Low": 15, "Medium": 45, "High": 70, "Critical": 90}
        raw_prob = downtime_result.get("downtime_probability", "Low")
        downtime_prob = prob_map.get(raw_prob, raw_prob) if isinstance(raw_prob, str) else raw_prob

        policy_result = await policy_enforcer.analyze({
            **context,
            "carbon_analysis": carbon_result, "cost_analysis": cost_result,
            "risk_analysis": risk_result, "downtime_analysis": downtime_result,
        })

        decision_color = "#10b981" if policy_result.get("can_proceed") else "#ef4444"
        html = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>GreenOps AI Report</title>
<style>
  body{{font-family:Inter,sans-serif;max-width:900px;margin:40px auto;padding:0 24px;color:#1e293b}}
  h1{{color:#10b981;font-size:28px;margin-bottom:4px}}
  .badge{{display:inline-block;padding:4px 12px;border-radius:20px;font-weight:700;font-size:14px;color:#fff;background:{decision_color}}}
  .section{{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:16px 0}}
  .section h2{{font-size:16px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin:0 0 12px}}
  .grid{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}
  .stat{{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px}}
  .stat-label{{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em}}
  .stat-value{{font-size:22px;font-weight:800;color:#1e293b;margin-top:2px}}
  ul{{margin:8px 0;padding-left:20px}} li{{margin:4px 0;font-size:14px}}
  .footer{{text-align:center;color:#94a3b8;font-size:12px;margin-top:40px}}
</style></head><body>
<h1>🌱 GreenOps AI — Pipeline Report</h1>
<p style="color:#64748b;margin-bottom:8px">Pipeline type: {request.pipeline_type} &nbsp;|&nbsp; Region: {request.region}</p>
<span class="badge">{policy_result.get('decision','UNKNOWN')}</span>

<div class="section"><h2>Carbon Impact</h2><div class="grid">
  <div class="stat"><div class="stat-label">CO₂ per deployment</div><div class="stat-value">{carbon_result.get('co2_kg',0):.4f} kg</div></div>
  <div class="stat"><div class="stat-label">Rating</div><div class="stat-value">{carbon_result.get('rating','N/A')}</div></div>
  <div class="stat"><div class="stat-label">Power usage</div><div class="stat-value">{carbon_result.get('power_consumption_kwh',0):.4f} kWh</div></div>
  <div class="stat"><div class="stat-label">Trees / year</div><div class="stat-value">{carbon_result.get('trees_equivalent_per_year',0):.4f}</div></div>
</div></div>

<div class="section"><h2>Cost Estimate</h2><div class="grid">
  <div class="stat"><div class="stat-label">Total cost</div><div class="stat-value">${cost_result.get('total_cost_usd',0):.4f}</div></div>
  <div class="stat"><div class="stat-label">Monthly projection</div><div class="stat-value">${cost_result.get('monthly_projection_usd',0):.2f}</div></div>
</div></div>

<div class="section"><h2>Risk Assessment</h2><div class="grid">
  <div class="stat"><div class="stat-label">Risk score</div><div class="stat-value">{risk_result.get('risk_score',0)} / 100</div></div>
  <div class="stat"><div class="stat-label">Risk level</div><div class="stat-value">{risk_result.get('risk_level','N/A')}</div></div>
</div></div>

<div class="section"><h2>Downtime Analysis</h2><div class="grid">
  <div class="stat"><div class="stat-label">Probability</div><div class="stat-value">{downtime_prob}%</div></div>
  <div class="stat"><div class="stat-label">Risk score</div><div class="stat-value">{downtime_result.get('downtime_risk_score',0)} / 100</div></div>
</div>
<ul>{''.join(f"<li>{m}</li>" for m in downtime_result.get('preventative_measures',[]))}</ul>
</div>

<div class="section"><h2>Policy Decision</h2>
<ul>{''.join(f"<li>✅ {p}</li>" for p in policy_result.get('passed',[]))}</ul>
{'<ul>' + ''.join(f"<li>⚠️ {w}</li>" for w in policy_result.get('warnings',[])) + '</ul>' if policy_result.get('warnings') else ''}
{'<ul>' + ''.join(f"<li>❌ {v}</li>" for v in policy_result.get('violations',[])) + '</ul>' if policy_result.get('violations') else ''}
</div>

<div class="footer">Generated by GreenOps AI · {request.pipeline_type} · {request.region}</div>
</body></html>"""
        return HTMLResponse(content=html)
    except Exception as e:
        logger.error(f"Report generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting GreenOps AI server...")
    uvicorn.run(app, host="0.0.0.0", port=Config.PORT)
