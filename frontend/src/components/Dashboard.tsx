import { AnalysisResult } from '../types'
import SummaryCard from './SummaryCard'
import CarbonCard from './CarbonCard'
import CostCard from './CostCard'
import RiskCard from './RiskCard'
import PolicyCard from './PolicyCard'
import RecommendationsCard from './RecommendationsCard'

interface Props {
  result: AnalysisResult
}

export default function Dashboard({ result }: Props) {
  return (
    <div className="space-y-6">
      <SummaryCard summary={result.summary} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CarbonCard data={result.carbon_analysis} />
        <CostCard data={result.cost_analysis} />
        <RiskCard data={result.risk_analysis} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PolicyCard data={result.policy_decision} />
        <RecommendationsCard 
          costOptimizations={result.cost_analysis.optimization_potential}
          riskRecommendations={result.risk_analysis.recommendations}
        />
      </div>
    </div>
  )
}
