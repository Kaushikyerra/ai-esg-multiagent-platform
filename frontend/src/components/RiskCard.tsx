interface Props {
  data: {
    risk_score: number
    risk_level: string
    risk_factors: Array<{ factor: string; severity: string; impact: number }>
  }
}

const levelColor: Record<string, string> = {
  LOW:      'text-emerald-400',
  MEDIUM:   'text-amber-400',
  HIGH:     'text-orange-400',
  CRITICAL: 'text-red-400',
}

const levelBar: Record<string, string> = {
  LOW:      'bg-emerald-500',
  MEDIUM:   'bg-amber-500',
  HIGH:     'bg-orange-500',
  CRITICAL: 'bg-red-500',
}

const severityBadge: Record<string, string> = {
  low:      'bg-emerald-500/10 text-emerald-400',
  medium:   'bg-amber-500/10 text-amber-400',
  high:     'bg-orange-500/10 text-orange-400',
  critical: 'bg-red-500/10 text-red-400',
}

export default function RiskCard({ data }: Props) {
  const color = levelColor[data.risk_level] ?? 'text-slate-400'
  const bar   = levelBar[data.risk_level]   ?? 'bg-slate-500'

  return (
    <div className="bg-[#13151f] border border-white/5 rounded-xl p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Risk Assessment</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded border bg-orange-500/10 text-orange-400 border-orange-500/20`}>
          {data.risk_level}
        </span>
      </div>

      <div className="mb-1">
        <span className={`text-3xl font-bold ${color}`}>{data.risk_score}</span>
        <span className="text-slate-500 text-sm ml-1">/ 100</span>
      </div>
      <p className="text-slate-500 text-xs mb-4">Risk score</p>

      {/* Score bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-600 mb-1">
          <span>Score</span><span>{data.risk_score}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full ${bar} rounded-full transition-all duration-700`} style={{ width: `${data.risk_score}%` }} />
        </div>
      </div>

      {/* Risk factors */}
      <div className="space-y-2 pt-3 border-t border-white/5">
        {data.risk_factors.length === 0 ? (
          <p className="text-xs text-slate-500">No risk factors detected</p>
        ) : (
          data.risk_factors.slice(0, 3).map((f, i) => (
            <div key={i} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 truncate flex-1">{f.factor}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${severityBadge[f.severity] ?? 'bg-slate-500/10 text-slate-400'}`}>
                {f.severity}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
