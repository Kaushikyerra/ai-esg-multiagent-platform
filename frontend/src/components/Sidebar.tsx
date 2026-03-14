import { LayoutDashboard, GitBranch, Activity } from 'lucide-react'

interface Props {
  activeTab: 'analyze' | 'dashboard'
  onTabChange: (tab: 'analyze' | 'dashboard') => void
  hasResult: boolean
}

export default function Sidebar({ activeTab, onTabChange, hasResult }: Props) {
  const nav = [
    { id: 'analyze',   label: 'Analyze',   icon: GitBranch },
    { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  ] as const

  return (
    <aside className="w-60 flex-shrink-0 bg-[#13151f] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-base">
            🌱
          </div>
          <div>
            <div className="text-sm font-semibold text-white">GreenOps AI</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">DevOps Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          const disabled = id === 'dashboard' && !hasResult
          return (
            <button
              key={id}
              onClick={() => !disabled && onTabChange(id)}
              disabled={disabled}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${active
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                  : disabled
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {id === 'dashboard' && hasResult && (
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Status */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Activity className="w-3 h-3 text-emerald-500" />
          <span>6 agents active</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-600">AI Dev Days Hackathon</div>
      </div>
    </aside>
  )
}
