// Sample React component for Member 2
// This shows how to integrate with the GreenOps AI API

import { useState } from 'react';

interface AnalysisResult {
  summary: {
    decision: string;
    carbon_rating: string;
    cost_rating: string;
    risk_level: string;
  };
  carbon_analysis: {
    co2_kg: number;
    trees_equivalent_per_year: number;
  };
  cost_analysis: {
    total_cost_usd: number;
    monthly_projection_usd: number;
  };
  risk_analysis: {
    risk_score: number;
    risk_factors: Array<{factor: string; severity: string}>;
  };
}

export default function PipelineAnalyzer() {
  const [pipelineConfig, setPipelineConfig] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzePipeline = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipeline_config: pipelineConfig,
          pipeline_type: 'github_actions',
          region: 'azure_eastus'
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">GreenOps AI Dashboard</h1>
      
      {/* Input Section */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Pipeline Configuration</label>
        <textarea
          className="w-full h-64 p-4 border rounded font-mono text-sm"
          value={pipelineConfig}
          onChange={(e) => setPipelineConfig(e.target.value)}
          placeholder="Paste your CI/CD pipeline YAML here..."
        />
        <button
          onClick={analyzePipeline}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Analyze Pipeline'}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carbon Card */}
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Carbon Impact</h3>
            <div className="text-3xl font-bold text-green-700">
              {result.carbon_analysis.co2_kg} kg CO₂
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Rating: {result.summary.carbon_rating}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ≈ {result.carbon_analysis.trees_equivalent_per_year.toFixed(4)} trees/year
            </div>
          </div>

          {/* Cost Card */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Cost Analysis</h3>
            <div className="text-3xl font-bold text-blue-700">
              ${result.cost_analysis.total_cost_usd}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Rating: {result.summary.cost_rating}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Monthly: ${result.cost_analysis.monthly_projection_usd}
            </div>
          </div>

          {/* Risk Card */}
          <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Risk Score</h3>
            <div className="text-3xl font-bold text-orange-700">
              {result.risk_analysis.risk_score}/100
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Level: {result.summary.risk_level}
            </div>
          </div>

          {/* Decision Banner */}
          <div className={`col-span-full p-6 rounded-lg ${
            result.summary.decision === 'APPROVED' ? 'bg-green-100 border-green-300' :
            result.summary.decision === 'BLOCKED' ? 'bg-red-100 border-red-300' :
            'bg-yellow-100 border-yellow-300'
          } border-2`}>
            <h3 className="text-xl font-bold mb-2">
              Decision: {result.summary.decision}
            </h3>
            {result.risk_analysis.risk_factors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Risk Factors:</h4>
                <ul className="list-disc list-inside">
                  {result.risk_analysis.risk_factors.map((factor, i) => (
                    <li key={i} className="text-sm">{factor.factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
