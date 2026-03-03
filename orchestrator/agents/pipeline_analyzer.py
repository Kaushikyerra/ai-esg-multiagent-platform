from typing import Dict, Any
import yaml
from agents.base_agent import BaseAgent

class PipelineAnalyzerAgent(BaseAgent):
    """Analyzes CI/CD pipeline configurations"""
    
    def __init__(self):
        super().__init__("PipelineAnalyzer")
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Parse and analyze pipeline configuration"""
        pipeline_config = context.get("pipeline_config", "")
        pipeline_type = context.get("pipeline_type", "github_actions")
        
        try:
            # Parse YAML config
            if isinstance(pipeline_config, str):
                config = yaml.safe_load(pipeline_config)
            else:
                config = pipeline_config
            
            # Extract key metrics
            jobs = self._extract_jobs(config, pipeline_type)
            steps_count = sum(len(job.get("steps", [])) for job in jobs)
            estimated_duration = self._estimate_duration(jobs)
            compute_size = self._estimate_compute_size(jobs)
            
            result = {
                "status": "success",
                "jobs_count": len(jobs),
                "steps_count": steps_count,
                "estimated_duration_minutes": estimated_duration,
                "compute_size": compute_size,
                "jobs": jobs,
                "deployment_detected": self._detect_deployment(jobs),
                "test_coverage_detected": self._detect_tests(jobs)
            }
            
            self.log_analysis(result)
            return result
            
        except Exception as e:
            self.logger.error(f"Pipeline analysis failed: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    def _extract_jobs(self, config: Dict, pipeline_type: str) -> list:
        """Extract jobs from pipeline config"""
        if pipeline_type == "github_actions":
            return [{"name": k, **v} for k, v in config.get("jobs", {}).items()]
        elif pipeline_type == "azure_devops":
            return config.get("stages", [])
        return []
    
    def _estimate_duration(self, jobs: list) -> int:
        """Estimate pipeline duration in minutes"""
        # Simplified: 5 min per job + 2 min per step
        base_time = len(jobs) * 5
        steps_time = sum(len(job.get("steps", [])) * 2 for job in jobs)
        return base_time + steps_time
    
    def _estimate_compute_size(self, jobs: list) -> str:
        """Estimate compute resource size"""
        total_steps = sum(len(job.get("steps", [])) for job in jobs)
        if total_steps < 5:
            return "small"
        elif total_steps < 15:
            return "medium"
        elif total_steps < 30:
            return "large"
        return "xlarge"
    
    def _detect_deployment(self, jobs: list) -> bool:
        """Check if pipeline includes deployment"""
        deploy_keywords = ["deploy", "release", "publish", "production"]
        for job in jobs:
            job_name = job.get("name", "").lower()
            if any(kw in job_name for kw in deploy_keywords):
                return True
        return False
    
    def _detect_tests(self, jobs: list) -> bool:
        """Check if pipeline includes tests"""
        test_keywords = ["test", "pytest", "jest", "unittest"]
        for job in jobs:
            job_name = job.get("name", "").lower()
            steps = job.get("steps", [])
            if any(kw in job_name for kw in test_keywords):
                return True
            for step in steps:
                step_name = str(step.get("name", "")).lower()
                if any(kw in step_name for kw in test_keywords):
                    return True
        return False
