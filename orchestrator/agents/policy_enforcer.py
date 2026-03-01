from typing import Dict, Any
from .base_agent import BaseAgent

class PolicyEnforcerAgent(BaseAgent):
    """Enforces governance policies"""
    
    def __init__(self):
        super().__init__("PolicyEnforcer")
        self.policies = self._load_default_policies()
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Enforce policies and gates"""
        try:
            violations = []
            warnings = []
            passed = []
            
            # Carbon policy
            co2_kg = context.get("carbon_analysis", {}).get("co2_kg", 0)
            if co2_kg > 1.0:
                violations.append({
                    "policy": "Carbon Limit",
                    "threshold": "1.0 kg CO2",
                    "actual": f"{co2_kg} kg CO2",
                    "action": "BLOCK"
                })
            elif co2_kg > 0.5:
                warnings.append({
                    "policy": "Carbon Warning",
                    "threshold": "0.5 kg CO2",
                    "actual": f"{co2_kg} kg CO2",
                    "action": "WARN"
                })
            else:
                passed.append("Carbon Limit")
            
            # Cost policy
            cost = context.get("cost_analysis", {}).get("total_cost_usd", 0)
            if cost > 2.0:
                violations.append({
                    "policy": "Cost Limit",
                    "threshold": "$2.00",
                    "actual": f"${cost}",
                    "action": "BLOCK"
                })
            elif cost > 1.0:
                warnings.append({
                    "policy": "Cost Warning",
                    "threshold": "$1.00",
                    "actual": f"${cost}",
                    "action": "WARN"
                })
            else:
                passed.append("Cost Limit")
            
            # Risk policy
            risk_score = context.get("risk_analysis", {}).get("risk_score", 0)
            if risk_score >= 75:
                violations.append({
                    "policy": "Risk Threshold",
                    "threshold": "75",
                    "actual": str(risk_score),
                    "action": "BLOCK"
                })
            elif risk_score >= 50:
                warnings.append({
                    "policy": "Risk Warning",
                    "threshold": "50",
                    "actual": str(risk_score),
                    "action": "WARN"
                })
            else:
                passed.append("Risk Threshold")
            
            # Determine overall decision
            if violations:
                decision = "BLOCKED"
            elif warnings:
                decision = "APPROVED_WITH_WARNINGS"
            else:
                decision = "APPROVED"
            
            result = {
                "status": "success",
                "decision": decision,
                "violations": violations,
                "warnings": warnings,
                "passed": passed,
                "can_proceed": len(violations) == 0
            }
            
            self.log_analysis(result)
            return result
            
        except Exception as e:
            self.logger.error(f"Policy enforcement failed: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    def _load_default_policies(self) -> Dict[str, Any]:
        """Load default policy configuration"""
        return {
            "carbon_limit_kg": 1.0,
            "carbon_warning_kg": 0.5,
            "cost_limit_usd": 2.0,
            "cost_warning_usd": 1.0,
            "risk_limit": 75,
            "risk_warning": 50
        }
