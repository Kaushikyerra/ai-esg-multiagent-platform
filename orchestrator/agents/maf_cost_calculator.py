"""
Cost Calculator Agent - Microsoft Agent Framework
Official implementation for AI Dev Days Hackathon
"""
from typing import Dict, Any
from agents.maf_base_agent import MAFBaseAgent
from config import Config


class MAFCostCalculatorAgent(MAFBaseAgent):
    """Cost analysis using Microsoft Agent Framework"""
    
    INSTRUCTIONS = """You are a cloud cost optimization expert for DevOps pipelines.
Analyze CI/CD pipeline costs and provide:
1. Cost breakdown across compute, storage, and network
2. Specific cost-saving recommendations with estimated savings
3. Monthly cost projections
Be specific with dollar amounts and percentage savings."""
    
    def __init__(self):
        super().__init__("CostCalculator", self.INSTRUCTIONS)
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate costs with Microsoft Agent Framework"""
        try:
            # Calculate base costs
            base_result = await self._fallback_analysis(context)
            
            # Enhance with AI
            if self.agent:
                prompt = self._build_prompt(context, base_result)
                ai_insights = await self.invoke_agent(prompt)
                base_result["ai_optimization_plan"] = ai_insights
                base_result["ai_enhanced"] = True
                base_result["framework"] = "Microsoft Agent Framework"
            else:
                base_result["ai_enhanced"] = False
                base_result["framework"] = "Fallback Mode"
            
            self.log_analysis(base_result)
            return base_result
            
        except Exception as e:
            self.logger.error(f"Cost calculation failed: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    async def _fallback_analysis(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate deployment costs"""
        duration_minutes = context.get("estimated_duration_minutes", 10)
        compute_size = context.get("compute_size", "medium")
        jobs_count = context.get("jobs_count", 1)
        
        # Calculate compute cost
        cost_per_hour = Config.COMPUTE_COST.get(compute_size, 0.20)
        hours = duration_minutes / 60
        compute_cost = cost_per_hour * hours * jobs_count
        
        # Add storage and network costs
        storage_cost = 0.01 * jobs_count
        network_cost = 0.02 * jobs_count
        
        total_cost = compute_cost + storage_cost + network_cost
        monthly_projection = total_cost * 30
        
        return {
            "status": "success",
            "compute_cost_usd": round(compute_cost, 4),
            "storage_cost_usd": round(storage_cost, 4),
            "network_cost_usd": round(network_cost, 4),
            "total_cost_usd": round(total_cost, 4),
            "monthly_projection_usd": round(monthly_projection, 2),
            "cost_rating": self._get_cost_rating(total_cost),
            "optimization_potential": self._get_basic_optimizations(context),
            "basic_optimizations": self._get_basic_optimizations(context)
        }
    
    def _build_prompt(self, context: Dict[str, Any], base_result: Dict[str, Any]) -> str:
        """Build prompt for Microsoft Agent Framework"""
        return f"""Analyze this CI/CD pipeline's cost structure:

Total Cost: ${base_result['total_cost_usd']} per deployment
Monthly Projection: ${base_result['monthly_projection_usd']}
Cost Rating: {base_result['cost_rating']}

Breakdown:
- Compute: ${base_result['compute_cost_usd']}
- Storage: ${base_result['storage_cost_usd']}
- Network: ${base_result['network_cost_usd']}

Pipeline Details:
- Duration: {context.get('estimated_duration_minutes')} minutes
- Compute Size: {context.get('compute_size')}
- Jobs: {context.get('jobs_count')}

Provide 3 specific cost optimization recommendations with estimated savings.
Format: Numbered list with dollar/percentage savings."""
    
    def _get_cost_rating(self, cost: float) -> str:
        """Rate cost efficiency"""
        if cost < 0.10:
            return "A"
        elif cost < 0.50:
            return "B"
        elif cost < 1.00:
            return "C"
        elif cost < 2.00:
            return "D"
        return "F"
    
    def _get_basic_optimizations(self, context: Dict[str, Any]) -> list:
        """Basic optimizations without AI"""
        suggestions = []
        
        compute_size = context.get("compute_size", "medium")
        if compute_size in ["large", "xlarge"]:
            suggestions.append("Downsize compute instances to reduce costs by 50-75%")
        
        if not context.get("test_coverage_detected"):
            suggestions.append("Add tests to catch issues early")
        
        if context.get("jobs_count", 0) > 5:
            suggestions.append("Parallelize jobs to reduce total runtime")
        
        return suggestions
