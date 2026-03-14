import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

interface Props {
  summary: {
    decision: string
    can_proceed: boolean
    carbon_rating: string
    cost_rating: string
    risk_level: string
  }
}

const config = {
  APPROVED: {
    icon: CheckCircle2,
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    label: 'Approved',
    desc: 'All checks passed. Pipeline is cleared to proceed.',
  },
  APPROVED_WITH_WARNINGS: {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    label: 'Approved with Warnings',
    desc: 'Pipeline can proceed but review the warnings below.',
  },
  BLOCKED: {
    icon: XCircle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    label: 'Blocked',
    desc: 'Pipeline has critical violations and cannot proceed.',
  },
}

const ratingColor = (r: string) =>
  ({ A: 'text-emerald-400', B: 'text-teal-400', C: 'text-amber-400', D: 'text-orange-400', F: 'text-red-400' }[r] ?? 'text-slate-400')

const riskColor = (r: string) =>
  ({ LOW: 'text-emerald-400', MEDIUM: 'text-amber-400', HIGH: 'text-orange-400', CRITICAL: 'text-red-400' }[r] ?? 'text-slate-400')

export default function DecisionBanner({ summary }: Props) {
  const c = config[summary.decision as keyof typeof config] ?? config.APPROVED
  const Icon = c.icon

  return (
    <div className={`${c.bg} ${c.border} border rounded-xl px-5 py-4 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${c.text} flex-shrink-0`} />
        <div>
          <div className={`font-semibold ${c.text}`}>{c.label}</div>
          <div className="text-slate-400 text-sm">{c.desc}</div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <div className={`text-xl font-bold ${ratingColor(summary.carbon_rating)}`}>{summary.carbon_rating}</div>
          <div className="text-slate-500 text-xs mt-0.5">Carbon</div>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <div className={`text-xl font-bold ${ratingColor(summary.cost_rating)}`}>{summary.cost_rating}</div>
          <div className="text-slate-500 text-xs mt-0.5">Cost</div>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <div className={`text-xl font-bold ${riskColor(summary.risk_level)}`}>{summary.risk_level}</div>
          <div className="text-slate-500 text-xs mt-0.5">Risk</div>
        </div>
      </div>
    </div>
  )
}
