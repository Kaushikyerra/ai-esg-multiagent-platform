from abc import ABC, abstractmethod
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    """Base class for all GreenOps AI agents"""
    
    def __init__(self, name: str):
        self.name = name
        self.logger = logging.getLogger(f"agent.{name}")
    
    @abstractmethod
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent analysis"""
        pass
    
    def log_analysis(self, result: Dict[str, Any]):
        self.logger.info(f"{self.name} completed: {result.get('status', 'unknown')}")
