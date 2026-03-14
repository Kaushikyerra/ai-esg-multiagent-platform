import { Lightbulb } from 'lucide-react'

interface Props {
  costOptimizations: string[]
  riskRecommendations: string[]
}

export default function RecommendationsCard({ costOptimizations, riskRecommendations }: Props) {
  const allRecommendations = [
    ...costOptimizations.map(r => ({ text: r, type: 'cost' })),
    ...riskRecommendations.map(r => ({ text: r, type: 'risk' }))
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
      </div>

      {allRecommendations.length > 0 ? (
        <div className="space-y-3">
          {allRecommendations.map((rec, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                rec.type === 'cost' ? 'bg-blue-500' : 'bg-orange-500'
              }`} />
              <div className="flex-1">
                <div className="text-sm text-gray-700">{rec.text}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {rec.type === 'cost' ? 'Cost Optimization' : 'Risk Mitigation'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-green-600 text-4xl mb-2">✓</div>
          <div className="text-gray-600 font-medium">No recommendations</div>
          <div className="text-sm text-gray-500 mt-1">Your pipeline is optimized!</div>
        </div>
      )}
    </div>
  )
}
