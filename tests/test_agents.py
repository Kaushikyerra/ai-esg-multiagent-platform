"""
GreenOps AI - Agent Test Suite
Tests all 5 Microsoft Agent Framework agents with 3 demo scenarios
"""
import asyncio
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'orchestrator'))

from agents.maf_pipeline_analyzer import MAFPipelineAnalyzerAgent
from agents.maf_carbon_estimator import MAFCarbonEstimatorAgent
from agents.maf_cost_calculator import MAFCostCalculatorAgent
from agents.maf_risk_scorer import MAFRiskScorerAgent
from agents.maf_policy_enforcer import MAFPolicyEnforcerAgent
from agents.maf_downtime_agent import MAFDowntimeAgent

# ─── Demo Pipeline Configs ────────────────────────────────────────────────────

APPROVED_PIPELINE = """
name: Clean Pipeline
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      - name: Lint
        run: npm run lint
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build
        run: npm run build
"""

WARNING_PIPELINE = """
name: Warning Pipeline
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: pytest tests/
  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy staging
        run: kubectl apply -f k8s/staging/
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Deploy production
        run: kubectl apply -f k8s/production/
      - name: Health check
        run: curl https://api.example.com/health
      - name: Update monitoring
        run: npm run monitoring:update
"""

BLOCKED_PIPELINE = """
name: Heavy Pipeline
on: [push]
jobs:
  heavy-build:
    runs-on: ubuntu-latest-16-cores
    steps:
      - uses: actions/checkout@v3
      - name: Train model
        run: python train_model.py --epochs 100
      - name: Process large dataset
        run: python process_data.py
      - name: Generate reports
        run: python generate_reports.py
      - name: Package artifacts
        run: tar -czf artifacts.tar.gz ./output
      - name: Upload to storage
        run: az storage blob upload-batch
  deploy:
    needs: heavy-build
    runs-on: ubuntu-latest-16-cores
    steps:
      - name: Deploy US
        run: kubectl apply -f k8s/us/
      - name: Deploy EU
        run: kubectl apply -f k8s/eu/
      - name: Deploy Asia
        run: kubectl apply -f k8s/asia/
      - name: Run migrations
        run: python manage.py migrate
"""

# ─── Test Runner ──────────────────────────────────────────────────────────────

async def run_full_analysis(pipeline_config: str, region: str = "azure_eastus") -> dict:
    """Run all 6 agents on a pipeline"""
    pipeline_analyzer = MAFPipelineAnalyzerAgent()
    carbon_estimator = MAFCarbonEstimatorAgent()
    cost_calculator = MAFCostCalculatorAgent()
    risk_scorer = MAFRiskScorerAgent()
    downtime_agent = MAFDowntimeAgent()
    policy_enforcer = MAFPolicyEnforcerAgent()

    # Step 1: Pipeline analysis
    context = {
        "pipeline_config": pipeline_config,
        "pipeline_type": "github_actions",
        "region": region
    }
    pipeline_result = await pipeline_analyzer.analyze(context)
    context.update(pipeline_result)

    # Step 2: Parallel analysis
    carbon_result, cost_result, risk_result = await asyncio.gather(
        carbon_estimator.analyze(context),
        cost_calculator.analyze(context),
        risk_scorer.analyze(context)
    )

    # Step 3: Downtime prediction
    downtime_result = await downtime_agent.analyze({**context, **risk_result})

    # Step 4: Policy enforcement
    policy_context = {
        **context,
        "carbon_analysis": carbon_result,
        "cost_analysis": cost_result,
        "risk_analysis": risk_result,
        "downtime_analysis": downtime_result
    }
    policy_result = await policy_enforcer.analyze(policy_context)

    return {
        "pipeline": pipeline_result,
        "carbon": carbon_result,
        "cost": cost_result,
        "risk": risk_result,
        "downtime": downtime_result,
        "policy": policy_result
    }


def print_result(scenario_name: str, result: dict, expected_decision: str):
    """Print test result in a clean format"""
    policy = result["policy"]
    carbon = result["carbon"]
    cost = result["cost"]
    risk = result["risk"]
    downtime = result["downtime"]
    pipeline = result["pipeline"]

    decision = policy.get("decision", "UNKNOWN")
    passed = decision == expected_decision

    print(f"\n{'='*60}")
    print(f"  SCENARIO: {scenario_name}")
    print(f"{'='*60}")
    print(f"  Pipeline Jobs   : {pipeline.get('jobs_count', 0)}")
    print(f"  Pipeline Steps  : {pipeline.get('steps_count', 0)}")
    print(f"  Duration        : {pipeline.get('estimated_duration_minutes', 0)} min")
    print(f"  Compute Size    : {pipeline.get('compute_size', 'N/A')}")
    print(f"  Tests Detected  : {'Yes' if pipeline.get('test_coverage_detected') else 'No'}")
    print(f"  Deployment      : {'Yes' if pipeline.get('deployment_detected') else 'No'}")
    print(f"  ─────────────────────────────────────────────────────")
    print(f"  CO2 Emissions   : {carbon.get('co2_kg', 0)} kg  [{carbon.get('rating', 'N/A')}]")
    print(f"  Cost            : ${cost.get('total_cost_usd', 0)}  [{cost.get('cost_rating', 'N/A')}]")
    print(f"  Monthly Cost    : ${cost.get('monthly_projection_usd', 0)}")
    print(f"  Risk Score      : {risk.get('risk_score', 0)}/100  [{risk.get('risk_level', 'N/A')}]")
    print(f"  Downtime Risk   : {downtime.get('downtime_risk_score', 0)}/100  [{downtime.get('downtime_probability', 'N/A')}]")
    print(f"  ─────────────────────────────────────────────────────")
    print(f"  Decision        : {decision}")
    print(f"  Can Proceed     : {policy.get('can_proceed', False)}")

    if policy.get("violations"):
        print(f"  Violations:")
        for v in policy["violations"]:
            print(f"    ❌ {v}")

    if policy.get("warnings"):
        print(f"  Warnings:")
        for w in policy["warnings"]:
            print(f"    ⚠️  {w}")

    if risk.get("risk_factors"):
        print(f"  Risk Factors:")
        for f in risk["risk_factors"]:
            print(f"    • {f['factor']} (severity: {f['severity']})")

    status = "✅ PASS" if passed else f"❌ FAIL (expected {expected_decision})"
    print(f"\n  Test Result     : {status}")
    print(f"{'='*60}")

    return passed


async def main():
    print("\n" + "="*60)
    print("  GREENOPS AI - AGENT TEST SUITE")
    print("  Microsoft Agent Framework | AI Dev Days Hackathon")
    print("="*60)

    results = []

    # Test 1: APPROVED scenario
    print("\n⏳ Running Scenario 1: Clean Pipeline (expect APPROVED)...")
    result1 = await run_full_analysis(APPROVED_PIPELINE, "azure_northeurope")
    passed1 = print_result("Clean Pipeline - Should be APPROVED", result1, "APPROVED")
    results.append(passed1)

    # Test 2: WARNING scenario
    print("\n⏳ Running Scenario 2: Warning Pipeline (expect WARNING)...")
    result2 = await run_full_analysis(WARNING_PIPELINE, "azure_eastus")
    passed2 = print_result("Multi-Deploy Pipeline - Should be WARNING", result2, "WARNING")
    results.append(passed2)

    # Test 3: BLOCKED scenario
    print("\n⏳ Running Scenario 3: Heavy Pipeline (expect BLOCKED)...")
    result3 = await run_full_analysis(BLOCKED_PIPELINE, "azure_eastus")
    passed3 = print_result("Heavy Compute Pipeline - Should be BLOCKED", result3, "BLOCKED")
    results.append(passed3)

    # Summary
    passed = sum(results)
    total = len(results)
    print(f"\n{'='*60}")
    print(f"  TEST SUMMARY: {passed}/{total} scenarios passed")
    print(f"  Framework: Microsoft Agent Framework")
    print(f"  Status: {'✅ ALL PASSED' if passed == total else '⚠️  SOME FAILED - check thresholds'}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    asyncio.run(main())
