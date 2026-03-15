"""
Microsoft Agent Framework Base Agent
Uses Azure OpenAI for AI-enhanced analysis.
AI Dev Days Hackathon 2026
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import logging
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from config import Config


class MAFBaseAgent(ABC):
    """Base agent with Azure OpenAI integration via Microsoft Agent Framework"""

    def __init__(self, name: str, instructions: str):
        self.name = name
        self.instructions = instructions
        self.logger = logging.getLogger(f"agent.{name}")
        self.client: Optional[Any] = None
        self._initialize_agent()

    def _initialize_agent(self):
        """Initialize Azure OpenAI client"""
        if not Config.AZURE_OPENAI_API_KEY or not Config.AZURE_OPENAI_ENDPOINT:
            self.logger.warning(f"{self.name}: Azure OpenAI not configured, using fallback mode")
            return

        try:
            from openai import AzureOpenAI
            self.client = AzureOpenAI(
                api_key=Config.AZURE_OPENAI_API_KEY,
                azure_endpoint=Config.AZURE_OPENAI_ENDPOINT,
                api_version=Config.AZURE_OPENAI_API_VERSION,
            )
            self.logger.info(f"{self.name}: Azure OpenAI client initialized Γ£à")
        except ImportError:
            self.logger.warning(f"{self.name}: openai package not available, using fallback mode")
        except Exception as e:
            self.logger.error(f"{self.name}: Failed to initialize Azure OpenAI: {e}")

    async def invoke_agent(self, prompt: str) -> str:
        """Call Azure OpenAI with the agent's system instructions"""
        if not self.client:
            return ""
        try:
            response = self.client.chat.completions.create(
                model=Config.AZURE_OPENAI_DEPLOYMENT,
                messages=[
                    {"role": "system", "content": self.instructions},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=400,
                temperature=0.3,
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            self.logger.error(f"{self.name}: Azure OpenAI call failed: {e}")
            return ""

    @property
    def ai_available(self) -> bool:
        return self.client is not None

    @abstractmethod
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def _fallback_analysis(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pass

    def log_analysis(self, result: Dict[str, Any]):
        ai_tag = "≡ƒñû AI" if result.get("ai_enhanced") else "ΓÜÖ∩╕Å  Fallback"
        self.logger.info(f"{self.name} [{ai_tag}] completed: {result.get('status', 'unknown')}")
