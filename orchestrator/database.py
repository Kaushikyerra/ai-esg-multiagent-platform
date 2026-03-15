"""
Azure Table Storage - Persistent storage for GreenOps AI analysis history
AI Dev Days Hackathon 2026
"""
import logging
import json
from datetime import datetime
from typing import List, Dict, Any
from config import Config

logger = logging.getLogger(__name__)


class AnalysisDatabase:
    """Azure Table Storage client for persisting pipeline analysis results"""

    def __init__(self):
        self.client = None
        self.table_client = None
        self._initialize()

    def _initialize(self):
        if not Config.AZURE_STORAGE_CONNECTION_STRING:
            logger.warning("Azure Table Storage not configured — using in-memory fallback")
            return
        try:
            from azure.data.tables import TableServiceClient
            service = TableServiceClient.from_connection_string(
                Config.AZURE_STORAGE_CONNECTION_STRING
            )
            # Create table if it doesn't exist
            service.create_table_if_not_exists(Config.AZURE_STORAGE_TABLE_NAME)
            self.table_client = service.get_table_client(Config.AZURE_STORAGE_TABLE_NAME)
            logger.info("✅ Azure Table Storage connected — table: %s", Config.AZURE_STORAGE_TABLE_NAME)
        except Exception as e:
            logger.error("Azure Table Storage init failed: %s", e)
            self.table_client = None

    def save_analysis(self, analysis_id: str, request_data: Dict, result: Dict) -> bool:
        """Save a full analysis result to Azure Table Storage"""
        if not self.table_client:
            return False
        try:
            summary = result.get("summary", {})
            carbon  = result.get("carbon_analysis", {})
            cost    = result.get("cost_analysis", {})
            risk    = result.get("risk_analysis", {})

            entity = {
                "PartitionKey": "analysis",
                "RowKey": analysis_id,
                "timestamp":      datetime.utcnow().isoformat(),
                "pipeline_type":  request_data.get("pipeline_type", ""),
                "region":         request_data.get("region", ""),
                "decision":       summary.get("decision", "UNKNOWN"),
                "can_proceed":    summary.get("can_proceed", False),
                "carbon_rating":  summary.get("carbon_rating", ""),
                "cost_rating":    summary.get("cost_rating", ""),
                "risk_level":     summary.get("risk_level", ""),
                "co2_kg":         float(carbon.get("co2_kg", 0)),
                "cost_usd":       float(cost.get("total_cost_usd", 0)),
                "monthly_usd":    float(cost.get("monthly_projection_usd", 0)),
                "risk_score":     int(risk.get("risk_score", 0)),
                "jobs_count":     int(result.get("pipeline_analysis", {}).get("jobs_count", 0)),
                "steps_count":    int(result.get("pipeline_analysis", {}).get("steps_count", 0)),
                "ai_enhanced":    result.get("ai_enhanced", False),
                # Store full result as JSON string for complete retrieval
                "full_result":    json.dumps(result)[:32000],  # Table Storage 32KB limit per property
            }
            self.table_client.upsert_entity(entity)
            logger.info("💾 Saved analysis %s to Azure Table Storage", analysis_id)
            return True
        except Exception as e:
            logger.error("Failed to save analysis: %s", e)
            return False

    def get_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve recent analyses from Azure Table Storage"""
        if not self.table_client:
            return []
        try:
            entities = list(self.table_client.list_entities())
            # Sort by timestamp descending
            entities.sort(key=lambda e: e.get("timestamp", ""), reverse=True)
            results = []
            for e in entities[:limit]:
                results.append({
                    "id":            e.get("RowKey"),
                    "timestamp":     e.get("timestamp"),
                    "pipeline_type": e.get("pipeline_type"),
                    "region":        e.get("region"),
                    "decision":      e.get("decision"),
                    "can_proceed":   e.get("can_proceed"),
                    "co2_kg":        e.get("co2_kg"),
                    "cost_usd":      e.get("cost_usd"),
                    "monthly_usd":   e.get("monthly_usd"),
                    "risk_score":    e.get("risk_score"),
                    "carbon_rating": e.get("carbon_rating"),
                    "cost_rating":   e.get("cost_rating"),
                    "risk_level":    e.get("risk_level"),
                    "ai_enhanced":   e.get("ai_enhanced"),
                })
            return results
        except Exception as e:
            logger.error("Failed to get history: %s", e)
            return []

    def get_stats(self) -> Dict[str, Any]:
        """Get aggregate stats from all stored analyses"""
        if not self.table_client:
            return {}
        try:
            entities = list(self.table_client.list_entities())
            if not entities:
                return {"total": 0}
            decisions = [e.get("decision") for e in entities]
            return {
                "total":        len(entities),
                "approved":     decisions.count("APPROVED"),
                "warnings":     decisions.count("WARNING"),
                "blocked":      decisions.count("BLOCKED"),
                "avg_co2_kg":   round(sum(float(e.get("co2_kg", 0)) for e in entities) / len(entities), 4),
                "avg_cost_usd": round(sum(float(e.get("cost_usd", 0)) for e in entities) / len(entities), 4),
                "avg_risk":     round(sum(int(e.get("risk_score", 0)) for e in entities) / len(entities), 1),
            }
        except Exception as e:
            logger.error("Failed to get stats: %s", e)
            return {}

    @property
    def is_connected(self) -> bool:
        return self.table_client is not None


# Singleton instance
db = AnalysisDatabase()
