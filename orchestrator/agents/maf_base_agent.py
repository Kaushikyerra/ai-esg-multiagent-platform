"""
Microsoft Agent Framework Base Agent
Official framework for AI Dev Days Hackathon
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import logging
import os
from config import Config

logger = logging.getLogger(__name__)


class MAFBaseAgent(ABC):
    """Base class using Microsoft Agent Framework"""
    
    def __init__(self, name: str, instructions: str):
        self.name = name
        self.instructions = instructions
        self.logger = logging.getLogger(f"agent.{name}")
        self.agent: Optional[Any] = None
        self._initialize_agent()
    
    def _initialize_agent(self):
        """Initialize Microsoft Agent Framework agent"""
        try:
            if not Config.AZURE_OPENAI_API_KEY or not Config.AZURE_OPENAI_ENDPOINT:
                self.logger.warning(f"{self.name}: Azure OpenAI not configured, using fallback")
                return
            
            # Import Microsoft Agent Framework components
            try:
                from microsoft.agents.ai import AIAgent
                from azure.ai.inference import ChatCompletionsClient
                from azure.core.credentials import AzureKeyCredential
                
                # Create chat client
                client = ChatCompletionsClient(
                    endpoint=Config.AZURE_OPENAI_ENDPOINT,
                    credential=AzureKeyCredential(Config.AZURE_OPENAI_API_KEY)
                )
                
                # Create AI Agent
                self.agent = client.as_ai_agent(instructions=self.instructions)
                
                self.logger.info(f"{self.name}: Microsoft Agent Framework initialized")
                
            except ImportError as e:
                self.logger.warning(f"{self.name}: Microsoft Agent Framework not available: {e}")
                self.agent = None
            
        except Exception as e:
            self.logger.error(f"{self.name}: Failed to initialize MAF: {str(e)}")
            self.agent = None
    
    async def invoke_agent(self, prompt: str) -> str:
        """Invoke the AI agent"""
        if not self.agent:
            self.logger.warning(f"{self.name}: Agent not available, using fallback")
            return ""
        
        try:
            result = await self.agent.run(prompt)
            return str(result)
        except Exception as e:
            self.logger.error(f"{self.name}: Agent invocation failed: {str(e)}")
            return ""
    
    @abstractmethod
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent analysis"""
        pass
    
    @abstractmethod
    async def _fallback_analysis(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback when AI unavailable"""
        pass
    
    def log_analysis(self, result: Dict[str, Any]):
        """Log analysis results"""
        self.logger.info(f"{self.name} completed: {result.get('status', 'unknown')}")
