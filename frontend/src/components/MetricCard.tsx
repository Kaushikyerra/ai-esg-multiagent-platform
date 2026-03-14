type Accent = 'emerald' | 'blue' | 'orange'

interface Detail { label: string; value: string }

interface Props {
  title: string
  value: string
  sub: string
  rating: string
  accent: Accent
  detail: Detail[]
}

const accentMap: Record<Accent, { badge: string; bar: string; text: string }> = {
  emerald: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', bar: 'bg-emerald-500', text: 'text-emerald-400' },
  blue:    { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',          bar: 'bg-blue-500',    text: 'text-blue-400' },
  orange:  { badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',    bar: 'bg-orange-500',  text: 'text-orange-400' },
}

const ratingPct: Record<string, number> = { A: 95, B: 75, C: 55, D: 35, F: 15 }

export default function MetricCard({ title, value, sub, rating, accent, detail }: Props) {
  const a = accentMap[accent]
  const pct = ratingPct[rating] ?? 50

  return (
    <div className="bg-[#13151f] border border-white/5 rounded-xl p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${a.badge}`}>{rating}</span>
      </div>

      <div className="mb-1">
        <span className={`text-3xl font-bold ${a.text}`}>{value}</span>
      </div>
      <p className="text-slate-500 text-xs mb-4">{sub}</p>

      {/* Rating bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-600 mb-1">
          <span>Rating</span><span>{rating}</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full ${a.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Detail rows */}
      <div className="space-y-2 pt-3 border-t border-white/5">
        {detail.map(d => (
          <div key={d.label} className="flex justify-between text-xs">
            <span className="text-slate-500">{d.label}</span>
            <span className="text-slate-300 font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
