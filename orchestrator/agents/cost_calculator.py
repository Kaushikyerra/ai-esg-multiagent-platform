from typing import Dict, Any
from .base_agent import BaseAgent
from ..config import Config

class CostCalculatorAgent(BaseAgent):
    """Calculates deployment costs"""
    
    def __init__(self):
        super().__init__("CostCalculator")
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate deployment costs"""
        try:
            duration_minutes = context.get("estimated_duration_minutes", 10)
            compute_size = context.get("compute_size", "medium")
            jobs_count = context.get("jobs_count", 1)
            
            # Calculate compute cost
            cost_per_hour = Config.COMPUTE_COST.get(compute_size, 0.20)
            hours = duration_minutes / 60
            compute_cost = cost_per_hour * hours * jobs_count
            
            # Add storage and network costs (simplified)
            storage_cost = 0.01 * jobs_count
            network_cost = 0.02 * jobs_count
            
            total_cost = compute_cost + storage_cost + network_cost
            
            # Monthly projection (assuming 30 deployments/month)
            monthly_projection = total_cost * 30
            
            result = {
                "status": "success",
                "compute_cost_usd": round(compute_cost, 4),
                "storage_cost_usd": round(storage_cost, 4),
                "network_cost_usd": round(network_cost, 4),
                "total_cost_usd": round(total_cost, 4),
                "monthly_projection_usd": round(monthly_projection, 2),
                "cost_rating": self._get_cost_rating(total_cost),
                "optimization_potential": self._suggest_optimizations(context)
            }
            
            self.log_analysis(result)
            return result
            
        except Exception as e:
            self.logger.error(f"Cost calculation failed: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    def _get_cost_rating(self, cost: float) -> str:
        """Rate cost efficiency"""
        if cost < 0.10:
            return "A"  # Excellent
        elif cost < 0.50:
            return "B"  # Good
        elif cost < 1.00:
            return "C"  # Average
        elif cost < 2.00:
            return "D"  # Poor
        return "F"  # Critical
    
    def _suggest_optimizations(self, context: Dict[str, Any]) -> list:
        """Suggest cost optimizations"""
        suggestions = []
        
        compute_size = context.get("compute_size", "medium")
        if compute_size in ["large", "xlarge"]:
            suggestions.append("Consider using smaller compute instances")
        
        if not context.get("test_coverage_detected"):
            suggestions.append("Add tests to catch issues early and reduce deployment failures")
        
        if context.get("jobs_count", 0) > 5:
            suggestions.append("Parallelize jobs to reduce total runtime")
        
        return suggestions
