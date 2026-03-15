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

const cfg = {
  APPROVED: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50', border: 'border-emerald-200',
    text: 'text-emerald-700', sub: 'text-emerald-600',
    label: 'Pipeline Approved',
    desc: 'All governance checks passed. Pipeline is cleared to proceed.',
  },
  APPROVED_WITH_WARNINGS: {
    icon: AlertTriangle,
    bg: 'bg-amber-50', border: 'border-amber-200',
    text: 'text-amber-700', sub: 'text-amber-600',
    label: 'Approved with Warnings',
    desc: 'Pipeline can proceed but review the warnings below.',
  },
  BLOCKED: {
    icon: XCircle,
    bg: 'bg-red-50', border: 'border-red-200',
    text: 'text-red-700', sub: 'text-red-600',
    label: 'Pipeline Blocked',
    desc: 'Critical violations detected. Pipeline cannot proceed.',
  },
}

const ratingColor = (r: string) =>
  ({ A: 'text-emerald-600', B: 'text-teal-600', C: 'text-amber-600', D: 'text-orange-600', F: 'text-red-600' }[r] ?? 'text-slate-500')

const riskColor = (r: string) =>
  ({ LOW: 'text-emerald-600', MEDIUM: 'text-amber-600', HIGH: 'text-orange-600', CRITICAL: 'text-red-600' }[r] ?? 'text-slate-500')

export default function DecisionBanner({ summary }: Props) {
  const c = cfg[summary.decision as keyof typeof cfg] ?? cfg.APPROVED
  const Icon = c.icon

  return (
    <div className={`${c.bg} ${c.border} border rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-6 h-6 ${c.text} flex-shrink-0`} />
        <div>
          <div className={`font-semibold text-base ${c.text}`}>{c.label}</div>
          <div className={`text-sm ${c.sub}`}>{c.desc}</div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm flex-shrink-0">
        <div className="text-center">
          <div className={`text-2xl font-extrabold ${ratingColor(summary.carbon_rating)}`}>{summary.carbon_rating}</div>
          <div className="text-slate-400 text-xs mt-0.5">Carbon</div>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="text-center">
          <div className={`text-2xl font-extrabold ${ratingColor(summary.cost_rating)}`}>{summary.cost_rating}</div>
          <div className="text-slate-400 text-xs mt-0.5">Cost</div>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="text-center">
          <div className={`text-2xl font-extrabold ${riskColor(summary.risk_level)}`}>{summary.risk_level}</div>
          <div className="text-slate-400 text-xs mt-0.5">Risk</div>
        </div>
      </div>
    </div>
  )
}
