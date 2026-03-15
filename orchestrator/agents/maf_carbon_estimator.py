"""
Carbon Estimator Agent - Microsoft Agent Framework
Official implementation for AI Dev Days Hackathon
"""
from typing import Dict, Any
from agents.maf_base_agent import MAFBaseAgent
from config import Config


class MAFCarbonEstimatorAgent(MAFBaseAgent):
    """Carbon footprint analysis using Microsoft Agent Framework"""
    
    INSTRUCTIONS = """You are a carbon footprint analysis expert for DevOps pipelines.
Analyze CI/CD pipeline configurations and provide:
1. Carbon emission estimates based on compute resources
2. Actionable recommendations to reduce carbon footprint
3. Regional optimization suggestions
Be concise and data-driven. Provide specific, measurable recommendations."""
    
    def __init__(self):
        super().__init__("CarbonEstimator", self.INSTRUCTIONS)
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze carbon footprint with Microsoft Agent Framework"""
        try:
            # Calculate base metrics
            base_result = await self._fallback_analysis(context)
            
            # Enhance with AI if available
            if self.ai_available:
                prompt = self._build_prompt(context, base_result)
                ai_insights = await self.invoke_agent(prompt)
                base_result["ai_recommendations"] = ai_insights
                base_result["ai_enhanced"] = True
                base_result["framework"] = "Microsoft Agent Framework"
            else:
                base_result["ai_enhanced"] = False
                base_result["framework"] = "Fallback Mode"
            
            self.log_analysis(base_result)
            return base_result
            
        except Exception as e:
            self.logger.error(f"Carbon estimation failed: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    async def _fallback_analysis(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate carbon footprint (works without AI)"""
        duration_minutes = context.get("estimated_duration_minutes", 10)
        compute_size = context.get("compute_size", "medium")
        region = context.get("region", "azure_eastus")
        
        # Calculate power consumption (kWh)
        power_consumption = self._calculate_power_consumption(duration_minutes, compute_size)
        
        # Get carbon intensity for region
        carbon_intensity = Config.CARBON_INTENSITY.get(region, 400)
        
        # Calculate CO2 emissions (grams)
        co2_grams = power_consumption * carbon_intensity
        co2_kg = co2_grams / 1000
        
        # Calculate tree equivalents (1 tree absorbs ~21 kg CO2/year)
        trees_per_year = co2_kg / 21 * 365
        
        return {
            "status": "success",
            "co2_grams": round(co2_grams, 2),
            "co2_kg": round(co2_kg, 4),
            "power_consumption_kwh": round(power_consumption, 4),
            "carbon_intensity": carbon_intensity,
            "region": region,
            "trees_equivalent_per_year": round(trees_per_year, 4),
            "rating": self._get_carbon_rating(co2_grams),
            "basic_recommendations": self._get_basic_recommendations(context)
        }
    
    def _build_prompt(self, context: Dict[str, Any], base_result: Dict[str, Any]) -> str:
        """Build prompt for Microsoft Agent Framework"""
        return f"""Analyze this CI/CD pipeline's carbon footprint:

Carbon Emissions: {base_result['co2_kg']} kg CO2
Power Consumption: {base_result['power_consumption_kwh']} kWh
Region: {base_result['region']} (Carbon Intensity: {base_result['carbon_intensity']} gCO2/kWh)
Rating: {base_result['rating']}

Pipeline Details:
- Duration: {context.get('estimated_duration_minutes', 'unknown')} minutes
- Compute Size: {context.get('compute_size', 'unknown')}
- Jobs Count: {context.get('jobs_count', 'unknown')}

Provide 3 specific, actionable recommendations to reduce carbon footprint.
Format: Numbered list, each recommendation in one sentence."""
    
    def _calculate_power_consumption(self, duration_minutes: int, compute_size: str) -> float:
        """Calculate power consumption in kWh"""
        power_draw = {
            "small": 50,    # 2 vCPU
            "medium": 150,  # 4 vCPU
            "large": 400,   # 8 vCPU
            "xlarge": 800   # 16 vCPU
        }
        watts = power_draw.get(compute_size, 150)
        hours = duration_minutes / 60
        kwh = (watts * hours) / 1000
        return kwh
    
    def _get_carbon_rating(self, co2_grams: float) -> str:
        """Rate carbon impact"""
        if co2_grams < 50:
            return "A"
        elif co2_grams < 150:
            return "B"
        elif co2_grams < 300:
            return "C"
        elif co2_grams < 500:
            return "D"
        return "F"
    
    def _get_basic_recommendations(self, context: Dict[str, Any]) -> list:
        """Basic recommendations without AI"""
        recommendations = []
        
        compute_size = context.get("compute_size", "medium")
        if compute_size in ["large", "xlarge"]:
            recommendations.append("Consider using smaller compute instances")
        
        region = context.get("region", "")
        if "eastus" in region:
            recommendations.append("Consider azure_northeurope region (lower carbon intensity)")
        
        duration = context.get("estimated_duration_minutes", 0)
        if duration > 20:
            recommendations.append("Optimize build caching to reduce pipeline duration")
        
        return recommendations
