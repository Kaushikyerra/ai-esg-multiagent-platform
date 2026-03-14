import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react'

interface Props {
  data: {
    decision: string
    violations: string[]
    warnings: string[]
    passed: string[]
    can_proceed: boolean
  }
}

export default function PolicyCard({ data }: Props) {
  return (
    <div className="bg-[#13151f] border border-white/5 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Policy Enforcement</span>
      </div>

      <div className="space-y-4">
        {data.passed.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> Passed ({data.passed.length})
            </div>
            <div className="space-y-1.5">
              {data.passed.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400 pl-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                  {p}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.warnings.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-2">
              <AlertTriangle className="w-3.5 h-3.5" /> Warnings ({data.warnings.length})
            </div>
            <div className="space-y-1.5">
              {data.warnings.map((w, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400 pl-1">
                  <span className="w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                  {typeof w === 'string' ? w : JSON.stringify(w)}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.violations.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium mb-2">
              <XCircle className="w-3.5 h-3.5" /> Violations ({data.violations.length})
            </div>
            <div className="space-y-1.5">
              {data.violations.map((v, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400 pl-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                  {typeof v === 'string' ? v : JSON.stringify(v)}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.passed.length === 0 && data.warnings.length === 0 && data.violations.length === 0 && (
          <p className="text-xs text-slate-500">No policy checks configured.</p>
        )}
      </div>
    </div>
  )
}
