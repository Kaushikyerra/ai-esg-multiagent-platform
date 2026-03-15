"""
Policy Enforcer Agent - Microsoft Agent Framework
Official implementation for AI Dev Days Hackathon
"""
from typing import Dict, Any
from agents.maf_base_agent import MAFBaseAgent


class MAFPolicyEnforcerAgent(MAFBaseAgent):
    """Policy enforcement using Microsoft Agent Framework"""
    
    INSTRUCTIONS = """You are a DevOps governance and compliance expert.
Enforce organizational policies on deployments and provide:
1. Clear approve/block/warn decisions based on thresholds
2. Justification for policy decisions
3. Policy improvement suggestions
Be decisive and provide clear reasoning for all decisions."""
    
    def __init__(self):
        super().__init__("PolicyEnforcer", self.INSTRUCTIONS)
        self.policies = self._load_default_policies()
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Enforce policies with Microsoft Agent Framework"""
        try:
            # Make policy decision
            base_result = await self._fallback_analysis(context)
            
            # Enhance with AI reasoning
            if self.ai_available:
                prompt = self._build_prompt(context, base_result)
                ai_reasoning = await self.invoke_agent(prompt)
                base_result["ai_reasoning"] = ai_reasoning
                base_result["ai_enhanced"] = True
                base_result["framework"] = "Microsoft Agent Framework"
            else:
                base_result["ai_enhanced"] = False
                base_result["framework"] = "Fallback Mode"
            
            self.log_analysis(base_result)
            return base_result
            
        except Exception as e:
            self.logger.error(f"Policy enforcement failed: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    async def _fallback_analysis(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Enforce policies"""
        carbon_analysis = context.get("carbon_analysis", {})
        cost_analysis = context.get("cost_analysis", {})
        risk_analysis = context.get("risk_analysis", {})
        
        violations = []
        warnings = []
        
        # Check carbon policy
        co2_kg = carbon_analysis.get("co2_kg", 0)
        if co2_kg > self.policies["max_carbon_kg"]:
            violations.append(f"Carbon emissions ({co2_kg} kg) exceed limit ({self.policies['max_carbon_kg']} kg)")
        elif co2_kg > self.policies["warn_carbon_kg"]:
            warnings.append(f"Carbon emissions ({co2_kg} kg) approaching limit")
        
        # Check cost policy
        cost = cost_analysis.get("total_cost_usd", 0)
        if cost > self.policies["max_cost_usd"]:
            violations.append(f"Cost (${cost}) exceeds limit (${self.policies['max_cost_usd']})")
        elif cost > self.policies["warn_cost_usd"]:
            warnings.append(f"Cost (${cost}) approaching limit")
        
        # Check risk policy
        risk_score = risk_analysis.get("risk_score", 0)
        if risk_score > self.policies["max_risk_score"]:
            violations.append(f"Risk score ({risk_score}) exceeds limit ({self.policies['max_risk_score']})")
        elif risk_score > self.policies["warn_risk_score"]:
            warnings.append(f"Risk score ({risk_score}) elevated")
        
        # Make decision
        if violations:
            decision = "BLOCKED"
            can_proceed = False
        elif warnings:
            decision = "WARNING"
            can_proceed = True
        else:
            decision = "APPROVED"
            can_proceed = True
        
        # Build passed checks list
        passed = []
        if co2_kg <= self.policies["warn_carbon_kg"]:
            passed.append(f"Carbon emissions within limit ({co2_kg} kg Γëñ {self.policies['warn_carbon_kg']} kg)")
        if cost <= self.policies["warn_cost_usd"]:
            passed.append(f"Cost within limit (${cost} Γëñ ${self.policies['warn_cost_usd']})")
        if risk_score <= self.policies["warn_risk_score"]:
            passed.append(f"Risk score within limit ({risk_score} Γëñ {self.policies['warn_risk_score']})")

        return {
            "status": "success",
            "decision": decision,
            "can_proceed": can_proceed,
            "violations": violations,
            "warnings": warnings,
            "passed": passed,
            "policies_checked": list(self.policies.keys())
        }
    
    def _build_prompt(self, context: Dict[str, Any], base_result: Dict[str, Any]) -> str:
        """Build prompt for Microsoft Agent Framework"""
        return f"""Explain this policy decision:

Decision: {base_result['decision']}
Can Proceed: {base_result['can_proceed']}

Violations: {', '.join(base_result['violations']) if base_result['violations'] else 'None'}
Warnings: {', '.join(base_result['warnings']) if base_result['warnings'] else 'None'}

Provide a clear, executive-level explanation of this decision in 2-3 sentences."""
    
    def _load_default_policies(self) -> Dict[str, Any]:
        """Load default policy thresholds"""
        return {
            "max_carbon_kg": 0.08,      # Block if > 0.08 kg CO2
            "warn_carbon_kg": 0.01,     # Warn if > 0.01 kg CO2
            "max_cost_usd": 1.0,        # Block if > $1.00
            "warn_cost_usd": 0.15,      # Warn if > $0.15
            "max_risk_score": 35,       # Block if risk > 35
            "warn_risk_score": 8        # Warn if risk > 8
        }
