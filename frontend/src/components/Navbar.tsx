import { useState, useRef, useEffect } from 'react'
import { LogOut, ChevronDown } from 'lucide-react'
import { Page } from '../App'
import { User } from '../pages/LoginPage'

interface Props {
  page: Page
  onNavigate: (p: Page) => void
  hasResult: boolean
  user?: User | null
  onLogout?: () => void
}

export default function Navbar({ page, onNavigate, hasResult, user, onLogout }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const links: { id: Page; label: string; authRequired: boolean }[] = [
    { id: 'home',      label: 'Home',      authRequired: false },
    { id: 'analyze',   label: 'Analyze',   authRequired: true  },
    { id: 'dashboard', label: 'Dashboard', authRequired: true  },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm shadow-sm">🌱</div>
          <span className="font-bold text-slate-900 text-lg">GreenOps <span className="gradient-text">AI</span></span>
        </button>

        <div className="flex items-center gap-1">
          {links.map(l => {
            const disabled = l.id === 'dashboard' && !hasResult && !!user
            const active   = page === l.id
            return (
              <button key={l.id} onClick={() => !disabled && onNavigate(l.id)} disabled={disabled}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${active   ? 'bg-emerald-50 text-emerald-700'
                  : disabled ? 'text-slate-300 cursor-not-allowed'
                  :            'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                {l.label}
                {l.id === 'dashboard' && hasResult && (
                  <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 align-middle" />
                )}
              </button>
            )
          })}
        </div>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all border border-slate-200">
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
              <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">{user.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
                <button onClick={() => { setDropdownOpen(false); onLogout?.() }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => onNavigate('login')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            Login
          </button>
        )}
      </div>
    </nav>
  )
}

