import { useState, useEffect } from 'react'
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, AuthError } from 'firebase/auth'
import { auth } from '../firebase'
import { Eye, EyeOff, Mail, Lock, User as UserIcon, ArrowRight, Leaf, Zap, ShieldCheck, CheckCircle } from 'lucide-react'

export interface User { name: string; email: string; avatar: string; provider: 'google' | 'email' }
interface Props { onLogin: (user: User, mode: 'login' | 'signup') => void }

function validateEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }

function firebaseError(err: AuthError): string {
  switch (err.code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists. Sign in instead.'
    case 'auth/user-not-found': return 'No account found with this email. Sign up first.'
    case 'auth/wrong-password': return 'Incorrect password. Please try again.'
    case 'auth/invalid-credential': return 'Invalid email or password.'
    case 'auth/weak-password': return 'Password must be at least 6 characters.'
    case 'auth/invalid-email': return 'Enter a valid email address.'
    case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/popup-closed-by-user': return 'Sign-in popup was closed. Please try again.'
    case 'auth/cancelled-popup-request': return ''
    default: return err.message || 'Something went wrong. Please try again.'
  }
}

const PERKS = [
  { icon: Leaf, text: 'Carbon footprint analysis' },
  { icon: Zap, text: 'Real-time pipeline scoring' },
  { icon: ShieldCheck, text: 'Automated policy enforcement' },
  { icon: CheckCircle, text: 'Executive-ready reports' },
]

export default function LoginPage({ onLogin }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [strength, setStrength] = useState(0)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    setStrength(s)
  }, [password])

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500']

  const handleGoogle = async () => {
    setGoogleLoading(true); setError('')
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      const result = await signInWithPopup(auth, provider)
      const fbUser = result.user
      const isNew = (result as any)._tokenResponse?.isNewUser ?? false
      onLogin({ name: fbUser.displayName || fbUser.email || 'User', email: fbUser.email || '',
        avatar: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.displayName || 'U')}&background=4285F4&color=fff&size=64`,
        provider: 'google' }, isNew ? 'signup' : 'login')
    } catch (err: any) { const msg = firebaseError(err); if (msg) setError(msg) }
    finally { setGoogleLoading(false) }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return }
    if (!validateEmail(email.trim())) { setError('Enter a valid email address.'); return }
    setLoading(true)
    try {
      if (mode === 'signup') {
        if (!name.trim() || name.trim().length < 2) { setError('Enter your full name (min 2 chars).'); setLoading(false); return }
        if (strength < 2) { setError('Password too weak — add uppercase, numbers, or symbols.'); setLoading(false); return }
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
        await updateProfile(cred.user, { displayName: name.trim() })
        onLogin({ name: name.trim(), email: email.trim(),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=10b981&color=fff&size=64`,
          provider: 'email' }, 'signup')
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
        const u = cred.user
        onLogin({ name: u.displayName || email.split('@')[0], email: u.email || email.trim(),
          avatar: u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName || email.split('@')[0])}&background=10b981&color=fff&size=64`,
          provider: 'email' }, 'login')
      }
    } catch (err: any) { setError(firebaseError(err)) }
    finally { setLoading(false) }
  }

  const switchMode = () => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setPassword('') }

  return (
    <div className="min-h-screen flex overflow-hidden"
      onMouseMove={e => setMousePos({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 })}>

      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-700" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }} />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"
          style={{ transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)` }} />
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-lg">🌱</div>
          <span className="font-extrabold text-white text-xl">GreenOps <span className="text-emerald-200">AI</span></span>
        </div>
        <div className="relative z-10 -mt-20">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">Smarter Deployments.<br /><span className="text-emerald-200">Greener Operations.</span></h2>
          <p className="text-white/70 text-base mb-10 leading-relaxed">Analyze your CI/CD pipelines for carbon footprint, cost, and risk — all in under 30 seconds.</p>
          <div className="space-y-4">
            {PERKS.map(p => (
              <div key={p.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0"><p.icon className="w-4 h-4 text-white" /></div>
                <span className="text-white/85 text-sm font-medium">{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white relative">
        <div className="absolute top-6 right-6 lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm">🌱</div>
          <span className="font-bold text-slate-800 text-sm">GreenOps AI</span>
        </div>
        <div className="w-full max-w-md">
          <div className="mb-7">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
            <p className="text-slate-500 text-sm">{mode === 'login' ? 'Sign in to your GreenOps AI account' : 'Start optimizing your pipelines today'}</p>
          </div>
          <button onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-slate-200 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all font-semibold text-slate-700 text-sm mb-5 disabled:opacity-60 disabled:cursor-not-allowed">
            {googleLoading
              ? <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              : <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>}
            {googleLoading ? 'Opening Google...' : 'Continue with Google'}
          </button>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                  className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address"
                className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={password} onChange={e => setPassword(e.target.value)} type={showPw ? 'text' : 'password'} placeholder="Password"
                className="w-full pl-10 pr-11 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400" />
              <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === 'signup' && password && (
              <div className="space-y-1.5">
                <div className="flex gap-1">{[1,2,3,4].map(i => (<div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-slate-200'}`} />))}</div>
                <p className={`text-xs font-medium ${strength >= 3 ? 'text-emerald-600' : strength >= 2 ? 'text-blue-500' : 'text-amber-500'}`}>{strengthLabel[strength]}</p>
              </div>
            )}
            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Forgot password?</button>
              </div>
            )}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex gap-2">
                <span>&#9888;&#65039;</span><span>{error}</span>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="group w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-200 hover:-translate-y-0.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0">
              {loading
                ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <>{mode === 'login' ? 'Sign In' : 'Create Account'}<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={switchMode} className="text-emerald-600 hover:text-emerald-700 font-semibold">{mode === 'login' ? 'Sign up' : 'Sign in'}</button>
          </p>
          <p className="text-center text-[11px] text-slate-400 mt-4">
            By continuing, you agree to our <span className="underline cursor-pointer hover:text-slate-600">Terms</span> and <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}



