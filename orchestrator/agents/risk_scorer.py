from typing import Dict, Any
from .base_agent import BaseAgent

class RiskScorerAgent(BaseAgent):
    """Scores deployment risk"""
    
    def __init__(self):
        super().__init__("RiskScorer")
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate risk score"""
        try:
            risk_factors = []
            risk_score = 0
            
            # Check for tests
            if not context.get("test_coverage_detected", False):
                risk_score += 30
                risk_factors.append({
                    "factor": "No test coverage detected",
                    "severity": "high",
                    "impact": 30
                })
            
            # Check for deployment
            if context.get("deployment_detected", False):
                risk_score += 10
                risk_factors.append({
                    "factor": "Production deployment detected",
                    "severity": "medium",
                    "impact": 10
                })
            
            # Check pipeline complexity
            steps_count = context.get("steps_count", 0)
            if steps_count > 20:
                risk_score += 15
                risk_factors.append({
                    "factor": "High pipeline complexity",
                    "severity": "medium",
                    "impact": 15
                })
            
            # Check duration
            duration = context.get("estimated_duration_minutes", 0)
            if duration > 30:
                risk_score += 10
                risk_factors.append({
                    "factor": "Long pipeline duration",
                    "severity": "low",
                    "impact": 10
                })
            
            # Calculate final score (0-100)
            risk_score = min(risk_score, 100)
            
            result = {
                "status": "success",
                "risk_score": risk_score,
                "risk_level": self._get_risk_level(risk_score),
                "risk_factors": risk_factors,
                "recommendations": self._get_recommendations(risk_factors)
            }
            
            self.log_analysis(result)
            return result
            
        except Exception as e:
            self.logger.error(f"Risk scoring failed: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    def _get_risk_level(self, score: int) -> str:
        """Determine risk level"""
        if score < 20:
            return "LOW"
        elif score < 50:
            return "MEDIUM"
        elif score < 75:
            return "HIGH"
        return "CRITICAL"
    
    def _get_recommendations(self, risk_factors: list) -> list:
        """Generate recommendations"""
        recommendations = []
        
        for factor in risk_factors:
            if "test coverage" in factor["factor"].lower():
                recommendations.append("Add unit and integration tests")
            elif "complexity" in factor["factor"].lower():
                recommendations.append("Break down pipeline into smaller, focused jobs")
            elif "duration" in factor["factor"].lower():
                recommendations.append("Optimize build caching and parallelization")
        
        return recommendations
