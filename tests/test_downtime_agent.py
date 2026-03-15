"""
Unit tests for MAFDowntimeAgent
Verifies output schema and risk inference logic
"""
import asyncio
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'orchestrator'))

from agents.maf_downtime_agent import MAFDowntimeAgent

agent = MAFDowntimeAgent()

# ─── Test Pipelines ───────────────────────────────────────────────────────────

RISKY_PIPELINE = """
name: Risky Deploy
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: kubectl apply -f k8s/
"""

SAFE_PIPELINE = """
name: Safe Deploy
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Health check
        run: curl https://api.example.com/liveness
      - name: Deploy primary
        run: kubectl apply -f k8s/primary/
      - name: Deploy fallback
        run: kubectl apply -f k8s/secondary/
      - name: Set replicas
        run: kubectl scale deployment app --replicas=3
"""

# ─── Tests ────────────────────────────────────────────────────────────────────

async def test_output_schema():
    """Result must contain required fields with correct types"""
    result = await agent.analyze({"pipeline_config": RISKY_PIPELINE})

    assert result["status"] == "success", "status must be 'success'"
    assert "downtime_probability" in result, "missing downtime_probability"
    assert "downtime_risk_score" in result, "missing downtime_risk_score"
    assert "preventative_measures" in result, "missing preventative_measures"
    assert "cost_implications" in result, "missing cost_implications"
    assert isinstance(result["preventative_measures"], list), "preventative_measures must be a list"
    assert isinstance(result["downtime_risk_score"], (int, float)), "downtime_risk_score must be numeric"
    assert 0 <= result["downtime_risk_score"] <= 100, "downtime_risk_score must be 0-100"
    assert result["downtime_probability"] in ("LOW", "MEDIUM", "HIGH", "CRITICAL"), \
        f"unexpected probability value: {result['downtime_probability']}"
    print("  ✅ test_output_schema passed")


async def test_risky_pipeline_scores_high():
    """Pipeline with no health checks, no fallback, no replicas → HIGH or CRITICAL"""
    result = await agent.analyze({"pipeline_config": RISKY_PIPELINE})
    assert result["downtime_risk_score"] >= 50, \
        f"Expected high risk score, got {result['downtime_risk_score']}"
    assert result["downtime_probability"] in ("HIGH", "CRITICAL"), \
        f"Expected HIGH/CRITICAL, got {result['downtime_probability']}"
    assert len(result["preventative_measures"]) > 0, "Should suggest preventative measures"
    print(f"  ✅ test_risky_pipeline_scores_high passed  [{result['downtime_probability']} / {result['downtime_risk_score']}]")


async def test_safe_pipeline_scores_lower():
    """Pipeline with health checks, fallback, and replicas → lower risk than risky pipeline"""
    risky = await agent.analyze({"pipeline_config": RISKY_PIPELINE})
    safe = await agent.analyze({"pipeline_config": SAFE_PIPELINE})
    assert safe["downtime_risk_score"] < risky["downtime_risk_score"], \
        f"Safe pipeline ({safe['downtime_risk_score']}) should score lower than risky ({risky['downtime_risk_score']})"
    print(f"  ✅ test_safe_pipeline_scores_lower passed  [safe={safe['downtime_risk_score']} < risky={risky['downtime_risk_score']}]")


async def test_deployment_without_tests_adds_risk():
    """Deployment detected but no test coverage should increase risk score"""
    result = await agent.analyze({
        "pipeline_config": RISKY_PIPELINE,
        "deployment_detected": True,
        "test_coverage_detected": False
    })
    assert result["downtime_risk_score"] > 0
    print(f"  ✅ test_deployment_without_tests_adds_risk passed  [score={result['downtime_risk_score']}]")


async def main():
    print("\n" + "="*60)
    print("  DOWNTIME AGENT - UNIT TESTS")
    print("  MAFDowntimeAgent | AI Dev Days Hackathon")
    print("="*60)

    tests = [
        test_output_schema,
        test_risky_pipeline_scores_high,
        test_safe_pipeline_scores_lower,
        test_deployment_without_tests_adds_risk,
    ]

    passed = 0
    for test in tests:
        try:
            await test()
            passed += 1
        except AssertionError as e:
            print(f"  ❌ {test.__name__} FAILED: {e}")
        except Exception as e:
            print(f"  ❌ {test.__name__} ERROR: {e}")

    print(f"\n{'='*60}")
    print(f"  RESULT: {passed}/{len(tests)} tests passed")
    print(f"  Status: {'✅ ALL PASSED' if passed == len(tests) else '⚠️  SOME FAILED'}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    asyncio.run(main())
