import { Lightbulb } from 'lucide-react'

interface Props { costOptimizations: string[]; riskRecommendations: string[] }

export default function RecommendationsCard({ costOptimizations, riskRecommendations }: Props) {
  const all = [
    ...costOptimizations.map(t => ({ text: t, type: 'cost' as const })),
    ...riskRecommendations.map(t => ({ text: t, type: 'risk' as const })),
  ]

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recommendations</span>
      </div>

      {all.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
            <span className="text-emerald-500 text-lg">✓</span>
          </div>
          <p className="text-sm font-medium text-slate-700">Pipeline is optimized</p>
          <p className="text-xs text-slate-400 mt-1">No recommendations at this time</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {all.map((r, i) => (
            <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${r.type === 'cost' ? 'bg-blue-500' : 'bg-orange-500'}`} />
              <div>
                <p className="text-xs text-slate-700">{r.text}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {r.type === 'cost' ? 'Cost optimization' : 'Risk mitigation'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
