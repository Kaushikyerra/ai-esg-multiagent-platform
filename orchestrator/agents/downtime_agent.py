from typing import Dict, Any
from .base_agent import BaseAgent

class DowntimeAgent(BaseAgent):
    """Predicts deployment downtime and suggests preventative measures"""
    
    def __init__(self):
        super().__init__("DowntimeAgent")
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate downtime risk and recommend measures"""
        try:
            downtime_risk_score = 0
            downtime_probability = "Low"
            preventative_measures = []
            cost_implications = []
            
            pipeline_config = context.get("pipeline_config", "").lower()
            
            # Check for redundancy/fallback
            if "fallback" not in pipeline_config and "secondary" not in pipeline_config:
                downtime_risk_score += 40
                preventative_measures.append("Deploy to a secondary region or add a fallback routing mechanism.")
                cost_implications.append("Secondary region: +$50/mo vs Potential downtime loss: $500/hr")
                
            # Check for health checks/liveness probes
            if "health" not in pipeline_config and "liveness" not in pipeline_config:
                downtime_risk_score += 30
                preventative_measures.append("Implement health checks/liveness probes to verify deployment success before routing traffic.")
                cost_implications.append("Health checks: +$0/mo (Implementation time) vs Potential downtime loss: $500/hr")
                
            # Check for replicas
            if "replicas" not in pipeline_config:
                downtime_risk_score += 20
                preventative_measures.append("Increase replica count to >1 to avoid single points of failure during deployment.")
                cost_implications.append("Extra replicas: +$20/mo vs Potential downtime loss: $500/hr")
                
            # Determine probability based on score
            if downtime_risk_score >= 80:
                downtime_probability = "Critical"
            elif downtime_risk_score >= 50:
                downtime_probability = "High"
            elif downtime_risk_score >= 30:
                downtime_probability = "Medium"
                
            result = {
                "status": "success",
                "downtime_probability": downtime_probability,
                "downtime_risk_score": downtime_risk_score,
                "preventative_measures": preventative_measures,
                "cost_implications": cost_implications
            }
            
            self.log_analysis(result)
            return result
            
        except Exception as e:
            self.logger.error(f"Downtime prediction failed: {str(e)}")
            return {"status": "error", "error": str(e)}
