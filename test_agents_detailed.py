"""
Detailed Agent Testing Script
Tests all agents with various scenarios
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_scenario(name, pipeline_config, expected_decision=None):
    """Test a specific scenario"""
    print(f"\n{'='*60}")
    print(f"TEST: {name}")
    print(f"{'='*60}")
    
    payload = {
        "pipeline_config": pipeline_config,
        "pipeline_type": "github_actions",
        "region": "azure_eastus"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/analyze", json=payload)
        result = response.json()
        
        # Print summary
        summary = result.get("summary", {})
        print(f"\n✅ Decision: {summary.get('decision')}")
        print(f"🌱 Carbon Rating: {summary.get('carbon_rating')}")
        print(f"💰 Cost Rating: {summary.get('cost_rating')}")
        print(f"⚠️  Risk Level: {summary.get('risk_level')}")
        
        # Print detailed metrics
        carbon = result.get("carbon_analysis", {})
        print(f"\n📊 Carbon: {carbon.get('co2_kg')} kg CO2")
        print(f"   Trees/year: {carbon.get('trees_equivalent_per_year')}")
        
        cost = result.get("cost_analysis", {})
        print(f"\n💵 Cost: ${cost.get('total_cost_usd')}")
        print(f"   Monthly: ${cost.get('monthly_projection_usd')}")
        
        risk = result.get("risk_analysis", {})
        print(f"\n🎯 Risk Score: {risk.get('risk_score')}/100")
        if risk.get('risk_factors'):
            print("   Risk Factors:")
            for factor in risk['risk_factors']:
                print(f"   - {factor['factor']} (severity: {factor['severity']})")
        
        # Validation
        if expected_decision and summary.get('decision') != expected_decision:
            print(f"\n❌ FAILED: Expected {expected_decision}, got {summary.get('decision')}")
        else:
            print(f"\n✅ PASSED")
            
        return result
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        return None

# Test Scenarios
print("="*60)
print("GREENOPS AI - AGENT TESTING SUITE")
print("="*60)

# Scenario 1: Simple, efficient pipeline
test_scenario(
    "Simple Pipeline (Should be APPROVED)",
    """
name: Simple Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
""",
    expected_decision="APPROVED"
)

# Scenario 2: Complex pipeline without tests
test_scenario(
    "Complex Pipeline No Tests (Should be WARNING/BLOCKED)",
    """
name: Complex Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build
        run: npm run build
      - name: Deploy to production
        run: kubectl apply -f deployment.yaml
      - name: Run migrations
        run: npm run migrate
      - name: Notify team
        run: echo "Deployed"
      - name: Update docs
        run: npm run docs
      - name: Cache cleanup
        run: npm run clean
      - name: Health check
        run: curl https://api.example.com/health
"""
)

# Scenario 3: Large compute pipeline
test_scenario(
    "Large Compute Pipeline",
    """
name: Heavy Processing
on: [push]
jobs:
  process:
    runs-on: ubuntu-latest-16-cores
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: pytest
      - name: Heavy computation
        run: python train_model.py
      - name: Process data
        run: python process_large_dataset.py
      - name: Generate reports
        run: python generate_reports.py
"""
)

# Scenario 4: Multi-region deployment
test_scenario(
    "Multi-Region Deployment",
    """
name: Global Deploy
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
  deploy-us:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy US
        run: kubectl apply -f us-deployment.yaml
  deploy-eu:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy EU
        run: kubectl apply -f eu-deployment.yaml
  deploy-asia:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Asia
        run: kubectl apply -f asia-deployment.yaml
"""
)

# Scenario 5: Minimal pipeline
test_scenario(
    "Minimal Pipeline (Best Carbon/Cost)",
    """
name: Quick Check
on: [push]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Lint
        run: npm run lint
"""
)

print("\n" + "="*60)
print("TESTING COMPLETE")
print("="*60)
print("\n📝 Review the results above to verify:")
print("  ✅ All agents are responding")
print("  ✅ Ratings are appropriate for each scenario")
print("  ✅ Policy decisions make sense")
print("  ✅ Recommendations are actionable")
we 