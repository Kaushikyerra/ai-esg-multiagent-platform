"""
Downtime Predictor Agent - Microsoft Agent Framework
AI Dev Days Hackathon 2026
"""
from typing import Dict, Any
from agents.maf_base_agent import MAFBaseAgent


class MAFDowntimeAgent(MAFBaseAgent):
    """Predicts deployment downtime risk using Microsoft Agent Framework"""

    INSTRUCTIONS = """You are a DevOps reliability and uptime expert.
Analyze CI/CD pipelines for downtime risk and provide:
1. Downtime probability assessment
2. Specific preventative measures with cost implications
3. Redundancy and resilience recommendations
Be practical and quantify the cost of downtime vs prevention."""

    def __init__(self):
        super().__init__("DowntimePredictor", self.INSTRUCTIONS)

    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        try:
            base_result = await self._fallback_analysis(context)

            if self.ai_available:
                prompt = self._build_prompt(context, base_result)
                ai_insights = await self.invoke_agent(prompt)
                base_result["ai_insights"] = ai_insights
                base_result["ai_enhanced"] = True
                base_result["framework"] = "Microsoft Agent Framework"
            else:
                base_result["ai_enhanced"] = False
                base_result["framework"] = "Fallback Mode"

            self.log_analysis(base_result)
            return base_result

        except Exception as e:
            self.logger.error(f"Downtime prediction failed: {str(e)}")
            return {"status": "error", "error": str(e)}

    async def _fallback_analysis(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pipeline_config = context.get("pipeline_config", "").lower()
        risk_score = 0
        measures = []
        cost_notes = []

        if "fallback" not in pipeline_config and "secondary" not in pipeline_config:
            risk_score += 40
            measures.append("Add a secondary region or fallback routing mechanism")
            cost_notes.append("Secondary region: +$50/mo vs downtime loss: ~$500/hr")

        if "health" not in pipeline_config and "liveness" not in pipeline_config:
            risk_score += 30
            measures.append("Add health checks / liveness probes before routing traffic")
            cost_notes.append("Health checks: free to implement vs downtime loss: ~$500/hr")

        if "replicas" not in pipeline_config:
            risk_score += 20
            measures.append("Set replica count > 1 to avoid single points of failure")
            cost_notes.append("Extra replicas: +$20/mo vs downtime loss: ~$500/hr")

        if context.get("deployment_detected") and not context.get("test_coverage_detected"):
            risk_score += 10
            measures.append("Add smoke tests post-deployment to catch failures early")

        if risk_score >= 80:
            probability = "CRITICAL"
        elif risk_score >= 50:
            probability = "HIGH"
        elif risk_score >= 30:
            probability = "MEDIUM"
        else:
            probability = "LOW"

        return {
            "status": "success",
            "downtime_probability": probability,
            "downtime_risk_score": min(risk_score, 100),
            "preventative_measures": measures,
            "cost_implications": cost_notes,
        }

    def _build_prompt(self, context: Dict[str, Any], base_result: Dict[str, Any]) -> str:
        measures = "\n".join(f"- {m}" for m in base_result["preventative_measures"]) or "None"
        return f"""Analyze this pipeline's downtime risk:

Downtime Probability: {base_result['downtime_probability']}
Risk Score: {base_result['downtime_risk_score']}/100
Deployment Detected: {context.get('deployment_detected', False)}
Tests Detected: {context.get('test_coverage_detected', False)}

Current preventative measures needed:
{measures}

Provide 2-3 specific, actionable recommendations to minimize deployment downtime.
Format: Numbered list with estimated impact."""
