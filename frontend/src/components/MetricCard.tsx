type Accent = 'emerald' | 'blue' | 'orange'
interface Detail { label: string; value: string }
interface Props {
  title: string; value: string; sub: string
  rating: string; accent: Accent; detail: Detail[]
}

const accentMap: Record<Accent, { badge: string; bar: string; val: string }> = {
  emerald: { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500', val: 'text-emerald-700' },
  blue:    { badge: 'bg-blue-100 text-blue-700 border-blue-200',          bar: 'bg-blue-500',    val: 'text-blue-700' },
  orange:  { badge: 'bg-orange-100 text-orange-700 border-orange-200',    bar: 'bg-orange-500',  val: 'text-orange-700' },
}
const ratingPct: Record<string, number> = { A: 95, B: 75, C: 55, D: 35, F: 15 }

export default function MetricCard({ title, value, sub, rating, accent, detail }: Props) {
  const a = accentMap[accent]
  const pct = ratingPct[rating] ?? 50

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm card-hover">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${a.badge}`}>{rating}</span>
      </div>

      <div className={`text-3xl font-extrabold ${a.val} mb-0.5`}>{value}</div>
      <p className="text-slate-400 text-xs mb-4">{sub}</p>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>Rating score</span><span>{rating}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${a.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100">
        {detail.map(d => (
          <div key={d.label} className="flex justify-between text-xs">
            <span className="text-slate-400">{d.label}</span>
            <span className="text-slate-700 font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
