import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Azure OpenAI
    AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
    AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
    AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")
    AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2025-01-01-preview")

    # Azure Table Storage
    AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
    AZURE_STORAGE_TABLE_NAME = os.getenv("AZURE_STORAGE_TABLE_NAME", "analyses")

    # App Settings
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    PORT = int(os.getenv("PORT", 8000))

    # Carbon Intensity (gCO2/kWh)
    CARBON_INTENSITY = {
        "azure_eastus":      415,
        "azure_westeurope":  295,
        "azure_northeurope": 180,
        "aws_us_east_1":     415,
        "gcp_us_central1":   394
    }

    # Compute cost per hour (USD)
    COMPUTE_COST = {
        "small":  0.05,
        "medium": 0.20,
        "large":  0.80,
        "xlarge": 2.00
    }
