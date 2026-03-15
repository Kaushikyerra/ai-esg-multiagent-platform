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

    # ─── Downtime Analysis Validation ────────────────────────────────────────
    print("\n=== DOWNTIME ANALYSIS ===")
    downtime = result.get("downtime_analysis", {})
    assert downtime, "❌ downtime_analysis missing from response"
    assert "downtime_probability" in downtime, "❌ missing downtime_probability"
    assert "downtime_risk_score" in downtime, "❌ missing downtime_risk_score"
    assert "preventative_measures" in downtime, "❌ missing preventative_measures"
    assert "cost_implications" in downtime, "❌ missing cost_implications"
    assert isinstance(downtime["preventative_measures"], list), "❌ preventative_measures must be a list"
    assert 0 <= downtime["downtime_risk_score"] <= 100, "❌ downtime_risk_score out of range"

    print(f"Downtime Probability : {downtime['downtime_probability']}")
    print(f"Downtime Risk Score  : {downtime['downtime_risk_score']}/100")
    print(f"Preventative Measures:")
    for m in downtime["preventative_measures"]:
        print(f"  - {m}")
    print(f"Cost Implications:")
    for c in downtime["cost_implications"]:
        print(f"  - {c}")

    # Summary downtime fields
    assert "downtime_risk_score" in result["summary"], "❌ downtime_risk_score missing from summary"
    assert "downtime_probability" in result["summary"], "❌ downtime_probability missing from summary"
    print(f"\n✅ downtime_analysis validation passed")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
