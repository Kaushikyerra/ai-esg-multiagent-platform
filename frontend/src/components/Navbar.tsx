import { Page } from '../App'

interface Props {
  page: Page
  onNavigate: (p: Page) => void
  hasResult: boolean
}

export default function Navbar({ page, onNavigate, hasResult }: Props) {
  const links: { id: Page; label: string }[] = [
    { id: 'home',      label: 'Home' },
    { id: 'analyze',   label: 'Analyze' },
    { id: 'dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm shadow-sm">
            🌱
          </div>
          <span className="font-bold text-slate-900 text-lg">GreenOps <span className="gradient-text">AI</span></span>
        </button>

        {/* Links */}
        <div className="flex items-center gap-1">
          {links.map(l => {
            const disabled = l.id === 'dashboard' && !hasResult
            const active   = page === l.id
            return (
              <button
                key={l.id}
                onClick={() => !disabled && onNavigate(l.id)}
                disabled={disabled}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${active   ? 'bg-emerald-50 text-emerald-700'
                  : disabled ? 'text-slate-300 cursor-not-allowed'
                  :            'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {l.label}
                {l.id === 'dashboard' && hasResult && (
                  <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 align-middle" />
                )}
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <button
          onClick={() => onNavigate('analyze')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          Get Started
        </button>
      </div>
    </nav>
  )
}
