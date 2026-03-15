import { ShieldAlert, CheckCircle } from 'lucide-react'

interface Props {
  data: {
    downtime_probability: number
    downtime_risk_score: number
    preventative_measures: string[]
  }
}

function probabilityColor(p: number) {
  if (p < 20)  return { bar: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Low' }
  if (p < 50)  return { bar: 'bg-amber-500',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700 border-amber-200',     label: 'Medium' }
  if (p < 75)  return { bar: 'bg-orange-500',  text: 'text-orange-700',  badge: 'bg-orange-100 text-orange-700 border-orange-200',  label: 'High' }
  return             { bar: 'bg-red-500',      text: 'text-red-700',     badge: 'bg-red-100 text-red-700 border-red-200',           label: 'Critical' }
}

export default function DowntimeCard({ data }: Props) {
  const prob  = Math.round(data.downtime_probability ?? 0)
  const score = Math.round(data.downtime_risk_score  ?? 0)
  const c     = probabilityColor(prob)
  const measures = data.preventative_measures ?? []

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Downtime Analysis</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${c.badge}`}>{c.label}</span>
      </div>

      {/* Two stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Probability</p>
          <p className={`text-2xl font-extrabold ${c.text}`}>{prob}<span className="text-sm font-normal text-slate-400">%</span></p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Risk Score</p>
          <p className={`text-2xl font-extrabold ${c.text}`}>{score}<span className="text-sm font-normal text-slate-400">/100</span></p>
        </div>
      </div>

      {/* Probability bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>Downtime probability</span><span>{prob}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${c.bar} rounded-full transition-all duration-700`} style={{ width: `${prob}%` }} />
        </div>
      </div>

      {/* Preventative measures */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Preventative Measures</p>
        {measures.length === 0 ? (
          <p className="text-xs text-slate-400">No measures required</p>
        ) : (
          <ul className="space-y-1.5">
            {measures.slice(0, 4).map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
