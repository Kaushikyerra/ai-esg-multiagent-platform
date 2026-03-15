import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react'

interface PolicyItem {
  policy?: string
  threshold?: string
  actual?: string
  action?: string
}

interface Props {
  data: { decision: string; violations: (string | PolicyItem)[]; warnings: (string | PolicyItem)[]; passed: string[]; can_proceed: boolean }
}

function formatItem(item: string | PolicyItem): string {
  if (typeof item === 'string') return item
  if (item.policy && item.threshold && item.actual) {
    return `${item.policy} exceeded — limit is ${item.threshold}, actual was ${item.actual}`
  }
  return JSON.stringify(item)
}

export default function PolicyCard({ data }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-purple-500" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Policy Enforcement</span>
      </div>

      <div className="space-y-4">
        {data.passed.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> Passed ({data.passed.length})
            </div>
            {data.passed.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-500 pl-1 mb-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />{p}
              </div>
            ))}
          </div>
        )}

        {data.warnings.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mb-2">
              <AlertTriangle className="w-3.5 h-3.5" /> Warnings ({data.warnings.length})
            </div>
            {data.warnings.map((w, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-500 pl-1 mb-1.5">
                <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                {formatItem(w)}
              </div>
            ))}
          </div>
        )}

        {data.violations.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold mb-2">
              <XCircle className="w-3.5 h-3.5" /> Violations ({data.violations.length})
            </div>
            {data.violations.map((v, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-500 pl-1 mb-1.5">
                <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                {formatItem(v)}
              </div>
            ))}
          </div>
        )}

        {!data.passed.length && !data.warnings.length && !data.violations.length && (
          <p className="text-xs text-slate-400">No policy checks configured.</p>
        )}
      </div>
    </div>
  )
}
