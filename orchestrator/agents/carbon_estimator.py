from typing import Dict, Any
from .base_agent import BaseAgent
from ..config import Config

class CarbonEstimatorAgent(BaseAgent):
    """Estimates carbon footprint of deployments"""
    
    def __init__(self):
        super().__init__("CarbonEstimator")
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate carbon emissions"""
        try:
            duration_minutes = context.get("estimated_duration_minutes", 10)
            compute_size = context.get("compute_size", "medium")
            region = context.get("region", "azure_eastus")
            
            # Calculate power consumption (kWh)
            power_consumption = self._calculate_power_consumption(
                duration_minutes, compute_size
            )
            
            # Get carbon intensity for region
            carbon_intensity = Config.CARBON_INTENSITY.get(region, 400)
            
            # Calculate CO2 emissions (grams)
            co2_grams = power_consumption * carbon_intensity
            co2_kg = co2_grams / 1000
            
            # Calculate tree equivalents (1 tree absorbs ~21 kg CO2/year)
            trees_per_year = co2_kg / 21 * 365
            
            result = {
                "status": "success",
                "co2_grams": round(co2_grams, 2),
                "co2_kg": round(co2_kg, 4),
                "power_consumption_kwh": round(power_consumption, 4),
                "carbon_intensity": carbon_intensity,
                "region": region,
                "trees_equivalent_per_year": round(trees_per_year, 4),
                "rating": self._get_carbon_rating(co2_grams)
            }
            
            self.log_analysis(result)
            return result
            
        except Exception as e:
            self.logger.error(f"Carbon estimation failed: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    def _calculate_power_consumption(self, duration_minutes: int, compute_size: str) -> float:
        """Calculate power consumption in kWh"""
        # Power draw estimates (watts)
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
            return "A"  # Excellent
        elif co2_grams < 150:
            return "B"  # Good
        elif co2_grams < 300:
            return "C"  # Average
        elif co2_grams < 500:
            return "D"  # Poor
        return "F"  # Critical
