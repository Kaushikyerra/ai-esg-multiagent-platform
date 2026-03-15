import { ArrowLeft, RefreshCw } from 'lucide-react'
import { AnalysisResult } from '../types'
import DecisionBanner from '../components/DecisionBanner'
import MetricCard from '../components/MetricCard'
import RiskCard from '../components/RiskCard'
import PolicyCard from '../components/PolicyCard'
import RecommendationsCard from '../components/RecommendationsCard'
import PipelineStats from '../components/PipelineStats'
import ChartsSection from '../components/ChartsSection'

interface Props {
  result: AnalysisResult
  onNewAnalysis: () => void
  onDownloadReport?: () => void
}

export default function DashboardPage({ result, onNewAnalysis, onDownloadReport }: Props) {
  const { summary, carbon_analysis, cost_analysis, risk_analysis, policy_decision, pipeline_analysis } = result

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in-up space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analysis Results</h1>
          <p className="text-slate-500 text-sm mt-1">Pipeline evaluation complete — review the findings below.</p>
        </div>
        <button
          onClick={onNewAnalysis}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
          New Analysis
        </button>
      </div>

      {/* Decision banner */}
      <DecisionBanner summary={summary} />

      {/* Pipeline stats */}
      <PipelineStats data={pipeline_analysis} />

      {/* 3 metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Carbon Impact"
          value={`${carbon_analysis.co2_kg.toFixed(3)} kg`}
          sub={`${carbon_analysis.co2_grams.toFixed(1)}g CO₂ per deployment`}
          rating={carbon_analysis.rating}
          accent="emerald"
          detail={[
            { label: 'Power usage',  value: `${carbon_analysis.power_consumption_kwh.toFixed(4)} kWh` },
            { label: 'Trees / year', value: carbon_analysis.trees_equivalent_per_year.toFixed(4) },
            { label: 'Region',       value: carbon_analysis.region.replace(/_/g, ' ') },
          ]}
        />
        <MetricCard
          title="Cost Estimate"
          value={`$${cost_analysis.total_cost_usd.toFixed(3)}`}
          sub={`$${cost_analysis.monthly_projection_usd.toFixed(2)} / month projected`}
          rating={cost_analysis.cost_rating}
          accent="blue"
          detail={[
            { label: 'Compute', value: `$${cost_analysis.compute_cost_usd.toFixed(3)}` },
            { label: 'Storage', value: `$${cost_analysis.storage_cost_usd.toFixed(3)}` },
            { label: 'Network', value: `$${cost_analysis.network_cost_usd.toFixed(3)}` },
          ]}
        />
        <RiskCard data={risk_analysis} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PolicyCard data={policy_decision} />
        <RecommendationsCard
          costOptimizations={cost_analysis.optimization_potential}
          riskRecommendations={risk_analysis.recommendations}
        />
      </div>

      {/* Charts & Analytics */}
      <ChartsSection result={result} />

      {/* Footer action */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onNewAnalysis}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Run another analysis
        </button>
        {onDownloadReport && (
          <button
            onClick={onDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            📄 Download Report
          </button>
        )}
      </div>
    </div>
  )
}
