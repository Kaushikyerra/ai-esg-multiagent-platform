"""Quick backend health check — hits all endpoints"""
import requests
import json

BASE = "http://localhost:8000"

PIPELINE = """
name: Test Pipeline
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: kubectl apply -f k8s/
      - name: Health check
        run: curl https://api.example.com/health
"""

def check(label, r):
    ok = "✅" if r.status_code == 200 else "❌"
    print(f"  {ok} {label} -> HTTP {r.status_code}")
    return r.status_code == 200

print("\n" + "="*55)
print("  GREENOPS AI — BACKEND HEALTH CHECK")
print("="*55)

# 1. Root
r = requests.get(f"{BASE}/")
check("GET /", r)
d = r.json()
print(f"     Service  : {d['service']} v{d['version']}")
print(f"     AI       : {d['ai_enhanced']}")
print(f"     Database : {d['database']}")

# 2. Health
r = requests.get(f"{BASE}/health")
check("GET /health", r)
d = r.json()
for agent, status in d["agents"].items():
    print(f"     {agent:<22}: {status}")

# 3. Analyze (main test)
print("\n  ⏳ POST /analyze  (running all 6 agents)...")
payload = {
    "pipeline_config": PIPELINE,
    "pipeline_type": "github_actions",
    "region": "azure_eastus"
}
r = requests.post(f"{BASE}/analyze", json=payload, timeout=120)
check("POST /analyze", r)
d = r.json()
s = d["summary"]
print(f"     Decision         : {s['decision']}")
print(f"     Carbon Rating    : {s['carbon_rating']}")
print(f"     Cost Rating      : {s['cost_rating']}")
print(f"     Risk Level       : {s['risk_level']}")
print(f"     Downtime         : {s['downtime_probability']} (score: {s['downtime_risk_score']})")
print(f"     AI Enhanced      : {d['ai_enhanced']}")
print(f"     CO2              : {d['carbon_analysis']['co2_kg']} kg")
print(f"     Total Cost       : ${d['cost_analysis']['total_cost_usd']}")

# 4. History
r = requests.get(f"{BASE}/history")
check("GET /history", r)
d = r.json()
print(f"     Source   : {d['source']}")
print(f"     Records  : {d['total']}")

# 5. Stats
r = requests.get(f"{BASE}/stats")
check("GET /stats", r)
d = r.json()
print(f"     Total analyses : {d.get('total', d.get('total_analyses', 0))}")

print("\n" + "="*55)
print("  DONE")
print("="*55 + "\n")
