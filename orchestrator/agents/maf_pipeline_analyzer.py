"""
Pipeline Analyzer Agent - Microsoft Agent Framework
Official implementation for AI Dev Days Hackathon
"""
from typing import Dict, Any
import yaml
from agents.maf_base_agent import MAFBaseAgent


class MAFPipelineAnalyzerAgent(MAFBaseAgent):
    """Pipeline analysis using Microsoft Agent Framework"""
    
    INSTRUCTIONS = """You are a CI/CD pipeline analysis expert.
Parse and understand CI/CD configurations (GitHub Actions, Azure DevOps) and provide:
1. Key metrics extraction (jobs, steps, duration estimates)
2. Pipeline pattern identification
3. Structural improvement suggestions
Be specific about pipeline structure and optimization opportunities."""
    
    def __init__(self):
        super().__init__("PipelineAnalyzer", self.INSTRUCTIONS)
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze pipeline with Microsoft Agent Framework"""
        try:
            # Parse pipeline
            base_result = await self._fallback_analysis(context)
            
            # Enhance with AI
            if self.agent:
                prompt = self._build_prompt(context, base_result)
                ai_insights = await self.invoke_agent(prompt)
                base_result["ai_insights"] = ai_insights
                base_result["ai_enhanced"] = True
                base_result["framework"] = "Microsoft Agent Framework"
            else:
                base_result["ai_enhanced"] = False
                base_result["framework"] = "Fallback Mode"
            
            self.log_analysis(base_result)
            return base_result
            
        except Exception as e:
            self.logger.error(f"Pipeline analysis failed: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    async def _fallback_analysis(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Parse pipeline configuration"""
        pipeline_config = context.get("pipeline_config", "")
        pipeline_type = context.get("pipeline_type", "github_actions")
        
        try:
            config = yaml.safe_load(pipeline_config)
            # Ensure config is a dict
            if not isinstance(config, dict):
                config = {}
        except:
            config = {}
        
        # Extract jobs
        jobs = self._extract_jobs(config, pipeline_type)
        
        # Estimate duration
        estimated_duration = self._estimate_duration(jobs)
        
        # Detect patterns
        test_coverage = self._detect_tests(jobs)
        deployment = self._detect_deployment(jobs)
        
        # Determine compute size
        compute_size = self._determine_compute_size(jobs)
        
        return {
            "status": "success",
            "pipeline_type": pipeline_type,
            "jobs_count": len(jobs),
            "steps_count": sum(len(job.get("steps", [])) for job in jobs),
            "estimated_duration_minutes": estimated_duration,
            "compute_size": compute_size,
            "test_coverage_detected": test_coverage,
            "deployment_detected": deployment,
            "jobs": jobs
        }
    
    def _build_prompt(self, context: Dict[str, Any], base_result: Dict[str, Any]) -> str:
        """Build prompt for Microsoft Agent Framework"""
        return f"""Analyze this CI/CD pipeline structure:

Type: {base_result['pipeline_type']}
Jobs: {base_result['jobs_count']}
Steps: {base_result['steps_count']}
Duration: {base_result['estimated_duration_minutes']} minutes
Tests: {'Yes' if base_result['test_coverage_detected'] else 'No'}
Deployment: {'Yes' if base_result['deployment_detected'] else 'No'}

Provide 2-3 specific structural improvements for this pipeline.
Format: Numbered list, focus on efficiency and reliability."""
    
    def _extract_jobs(self, config: Dict, pipeline_type: str) -> list:
        """Extract jobs from pipeline config"""
        jobs = []
        
        if pipeline_type == "github_actions":
            jobs_dict = config.get("jobs", {})
            for job_name, job_config in jobs_dict.items():
                steps = job_config.get("steps", [])
                jobs.append({
                    "name": job_name,
                    "steps": steps,
                    "runs_on": job_config.get("runs-on", "ubuntu-latest")
                })
        
        return jobs
    
    def _estimate_duration(self, jobs: list) -> int:
        """Estimate pipeline duration in minutes"""
        if not jobs:
            return 10
        total_steps = sum(len(job.get("steps", [])) for job in jobs)
        return max(5, total_steps * 2)
    
    def _detect_tests(self, jobs: list) -> bool:
        """Detect if pipeline has tests"""
        test_keywords = ["test", "pytest", "jest", "mocha", "junit"]
        
        for job in jobs:
            job_name = job.get("name", "").lower()
            if any(keyword in job_name for keyword in test_keywords):
                return True
            
            for step in job.get("steps", []):
                step_name = str(step.get("name", "")).lower()
                step_run = str(step.get("run", "")).lower()
                if any(keyword in step_name or keyword in step_run for keyword in test_keywords):
                    return True
        
        return False
    
    def _detect_deployment(self, jobs: list) -> bool:
        """Detect if pipeline has deployment"""
        deploy_keywords = ["deploy", "release", "publish", "production"]
        
        for job in jobs:
            job_name = job.get("name", "").lower()
            if any(keyword in job_name for keyword in deploy_keywords):
                return True
        
        return False
    
    def _determine_compute_size(self, jobs: list) -> str:
        """Determine compute size based on runner"""
        for job in jobs:
            runs_on = job.get("runs_on", "").lower()
            if "16-core" in runs_on or "xlarge" in runs_on:
                return "xlarge"
            elif "8-core" in runs_on or "large" in runs_on:
                return "large"
            elif "4-core" in runs_on:
                return "medium"
        
        return "medium"
