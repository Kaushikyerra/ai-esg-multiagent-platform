import { ArrowLeft } from 'lucide-react'
import { AnalysisResult } from '../types'
import DecisionBanner from './DecisionBanner'
import MetricCard from './MetricCard'
import RiskCard from './RiskCard'
import PolicyCard from './PolicyCard'
import RecommendationsCard from './RecommendationsCard'
import PipelineStats from './PipelineStats'

interface Props {
  result: AnalysisResult
  onReset: () => void
}

export default function Dashboard({ result, onReset }: Props) {
  const { summary, carbon_analysis, cost_analysis, risk_analysis, policy_decision, pipeline_analysis } = result

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Analysis Results</h1>
          <p className="text-slate-400 text-sm mt-1">Pipeline evaluation complete</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          New Analysis
        </button>
      </div>

      {/* Decision banner */}
      <DecisionBanner summary={summary} />

      {/* Pipeline stats row */}
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
            { label: 'Power usage',    value: `${carbon_analysis.power_consumption_kwh.toFixed(4)} kWh` },
            { label: 'Trees/year',     value: carbon_analysis.trees_equivalent_per_year.toFixed(4) },
            { label: 'Region',         value: carbon_analysis.region.replace('_', ' ') },
          ]}
        />
        <MetricCard
          title="Cost Estimate"
          value={`$${cost_analysis.total_cost_usd.toFixed(3)}`}
          sub={`$${cost_analysis.monthly_projection_usd.toFixed(2)} / month projected`}
          rating={cost_analysis.cost_rating}
          accent="blue"
          detail={[
            { label: 'Compute',  value: `$${cost_analysis.compute_cost_usd.toFixed(3)}` },
            { label: 'Storage',  value: `$${cost_analysis.storage_cost_usd.toFixed(3)}` },
            { label: 'Network',  value: `$${cost_analysis.network_cost_usd.toFixed(3)}` },
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
    </div>
  )
}
