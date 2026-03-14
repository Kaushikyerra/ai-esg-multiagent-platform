interface Props {
  data: {
    risk_score: number
    risk_level: string
    risk_factors: Array<{ factor: string; severity: string; impact: number }>
  }
}

const levelStyle: Record<string, { val: string; bar: string; badge: string }> = {
  LOW:      { val: 'text-emerald-700', bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  MEDIUM:   { val: 'text-amber-700',   bar: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  HIGH:     { val: 'text-orange-700',  bar: 'bg-orange-500',  badge: 'bg-orange-100 text-orange-700 border-orange-200' },
  CRITICAL: { val: 'text-red-700',     bar: 'bg-red-500',     badge: 'bg-red-100 text-red-700 border-red-200' },
}

const sevBadge: Record<string, string> = {
  low:      'bg-emerald-100 text-emerald-700',
  medium:   'bg-amber-100 text-amber-700',
  high:     'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
}

export default function RiskCard({ data }: Props) {
  const s = levelStyle[data.risk_level] ?? levelStyle.LOW

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm card-hover">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Assessment</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${s.badge}`}>{data.risk_level}</span>
      </div>

      <div className={`text-3xl font-extrabold ${s.val} mb-0.5`}>
        {data.risk_score}<span className="text-slate-400 text-base font-normal ml-1">/ 100</span>
      </div>
      <p className="text-slate-400 text-xs mb-4">Risk score</p>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>Score</span><span>{data.risk_score}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${s.bar} rounded-full transition-all duration-700`} style={{ width: `${data.risk_score}%` }} />
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100">
        {data.risk_factors.length === 0 ? (
          <p className="text-xs text-slate-400">No risk factors detected</p>
        ) : (
          data.risk_factors.slice(0, 3).map((f, i) => (
            <div key={i} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-600 truncate flex-1">{f.factor}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${sevBadge[f.severity] ?? 'bg-slate-100 text-slate-500'}`}>
                {f.severity}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
