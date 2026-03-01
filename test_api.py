"""Quick test script for GreenOps AI API"""
import requests
import json

# Sample pipeline config
with open("examples/sample_pipeline.yaml", "r") as f:
    pipeline_config = f.read()

# API endpoint
url = "http://localhost:8000/analyze"

# Request payload
payload = {
    "pipeline_config": pipeline_config,
    "pipeline_type": "github_actions",
    "region": "azure_eastus"
}

# Send request
print("Analyzing pipeline...")
response = requests.post(url, json=payload)

if response.status_code == 200:
    result = response.json()
    print("\n=== ANALYSIS RESULTS ===")
    print(json.dumps(result["summary"], indent=2))
    print(f"\nDecision: {result['summary']['decision']}")
    print(f"Carbon Rating: {result['summary']['carbon_rating']}")
    print(f"Cost Rating: {result['summary']['cost_rating']}")
    print(f"Risk Level: {result['summary']['risk_level']}")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
