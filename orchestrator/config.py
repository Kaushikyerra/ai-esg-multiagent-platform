import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Azure OpenAI
    AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
    AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
    AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4")
    AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")
    
    # App Settings
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    PORT = int(os.getenv("PORT", 8000))
    
    # Carbon Intensity (gCO2/kWh) - Average values
    CARBON_INTENSITY = {
        "azure_eastus": 415,
        "azure_westeurope": 295,
        "azure_northeurope": 180,
        "aws_us_east_1": 415,
        "gcp_us_central1": 394
    }
    
    # Cost per compute hour (USD) - Simplified
    COMPUTE_COST = {
        "small": 0.05,
        "medium": 0.20,
        "large": 0.80,
        "xlarge": 2.00
    }
