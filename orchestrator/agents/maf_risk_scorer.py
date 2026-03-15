"""
Risk Scorer Agent - Microsoft Agent Framework
Official implementation for AI Dev Days Hackathon
"""
from typing import Dict, Any
from agents.maf_base_agent import MAFBaseAgent


class MAFRiskScorerAgent(MAFBaseAgent):
    """Risk assessment using Microsoft Agent Framework"""
    
    INSTRUCTIONS = """You are a DevOps risk assessment expert.
Analyze deployment risk factors in CI/CD pipelines and provide:
1. Risk score assessment (0-100)
2. Identification of potential failure points
3. Specific risk mitigation strategies
Focus on practical, actionable recommendations to reduce deployment risk."""
    
    def __init__(self):
        super().__init__("RiskScorer", self.INSTRUCTIONS)
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate risk score with Microsoft Agent Framework"""
        try:
            # Calculate base risk
            base_result = await self._fallback_analysis(context)
            
            # Enhance with AI
            if self.ai_available:
                prompt = self._build_prompt(context, base_result)
                ai_insights = await self.invoke_agent(prompt)
                base_result["ai_mitigation_plan"] = ai_insights
                base_result["ai_enhanced"] = True
                base_result["framework"] = "Microsoft Agent Framework"
            else:
                base_result["ai_enhanced"] = False
                base_result["framework"] = "Fallback Mode"
            
            self.log_analysis(base_result)
            return base_result
            
        except Exception as e:
            self.logger.error(f"Risk scoring failed: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    async def _fallback_analysis(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate risk score"""
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
        
        risk_score = min(risk_score, 100)
        
        return {
            "status": "success",
            "risk_score": risk_score,
            "risk_level": self._get_risk_level(risk_score),
            "risk_factors": risk_factors,
            "recommendations": self._get_basic_recommendations(risk_factors),
            "basic_recommendations": self._get_basic_recommendations(risk_factors)
        }
    
    def _build_prompt(self, context: Dict[str, Any], base_result: Dict[str, Any]) -> str:
        """Build prompt for Microsoft Agent Framework"""
        risk_factors_str = "\n".join([f"- {f['factor']} (severity: {f['severity']})" 
                                      for f in base_result['risk_factors']])
        
        return f"""Analyze this CI/CD pipeline's deployment risk:

Risk Score: {base_result['risk_score']}/100
Risk Level: {base_result['risk_level']}

Risk Factors:
{risk_factors_str if risk_factors_str else 'None identified'}

Pipeline Details:
- Steps: {context.get('steps_count')}
- Duration: {context.get('estimated_duration_minutes')} minutes
- Tests: {'Yes' if context.get('test_coverage_detected') else 'No'}
- Deployment: {'Yes' if context.get('deployment_detected') else 'No'}

Provide 3 specific risk mitigation strategies to reduce deployment failures.
Format: Numbered list, prioritized by impact."""
    
    def _get_risk_level(self, score: int) -> str:
        """Determine risk level"""
        if score < 20:
            return "LOW"
        elif score < 50:
            return "MEDIUM"
        elif score < 75:
            return "HIGH"
        return "CRITICAL"
    
    def _get_basic_recommendations(self, risk_factors: list) -> list:
        """Basic recommendations without AI"""
        recommendations = []
        
        for factor in risk_factors:
            if "test coverage" in factor["factor"].lower():
                recommendations.append("Add unit and integration tests")
            elif "complexity" in factor["factor"].lower():
                recommendations.append("Break down pipeline into smaller jobs")
            elif "duration" in factor["factor"].lower():
                recommendations.append("Optimize build caching and parallelization")
        
        return recommendations
