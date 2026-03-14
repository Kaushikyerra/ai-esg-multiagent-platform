import { Layers, GitBranch, Clock, Cpu } from 'lucide-react'

interface Props {
  data: {
    jobs_count: number; steps_count: number
    estimated_duration_minutes: number; compute_size: string
    deployment_detected: boolean; test_coverage_detected: boolean
  }
}

export default function PipelineStats({ data }: Props) {
  const stats = [
    { icon: GitBranch, label: 'Jobs',          value: data.jobs_count },
    { icon: Layers,    label: 'Steps',         value: data.steps_count },
    { icon: Clock,     label: 'Est. Duration', value: `${data.estimated_duration_minutes}m` },
    { icon: Cpu,       label: 'Compute',       value: data.compute_size },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <div className="text-slate-900 font-semibold text-sm">{value}</div>
            <div className="text-slate-400 text-xs">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
