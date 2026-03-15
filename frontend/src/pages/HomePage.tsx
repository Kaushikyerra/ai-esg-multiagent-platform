import { useEffect, useRef, useState, useCallback } from 'react'
import { ArrowRight, Leaf, DollarSign, ShieldCheck, Zap, BarChart3, GitBranch,
  CheckCircle, Globe, Activity, Cpu, Cloud } from 'lucide-react'

interface Props { onGetStarted: () => void }

/* ── hooks ── */
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let t0: number
    const step = (ts: number) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

function useTypewriter(words: string[], speed = 75, pause = 2200) {
  const [display, setDisplay] = useState('')
  const [wi, setWi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)
  useEffect(() => {
    const word = words[wi]
    const id = setTimeout(() => {
      if (!del) {
        setDisplay(word.slice(0, ci + 1))
        if (ci + 1 === word.length) setTimeout(() => setDel(true), pause)
        else setCi(c => c + 1)
      } else {
        setDisplay(word.slice(0, ci - 1))
        if (ci - 1 === 0) { setDel(false); setWi(i => (i + 1) % words.length); setCi(0) }
        else setCi(c => c - 1)
      }
    }, del ? speed / 2 : speed)
    return () => clearTimeout(id)
  }, [ci, del, wi, words, speed, pause])
  return display
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

/* ── Particle canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf: number
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const N = 55
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(16,185,129,0.35)'
        ctx.fill()
      })
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(16,185,129,${0.12 * (1 - d / 120)})`
          ctx.lineWidth = 0.8; ctx.stroke()
        }
      }))
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

/* ── Live pipeline flow ── */
const PIPELINE_NODES = [
  { id: 'build',   label: 'Build',      color: '#3b82f6' },
  { id: 'test',    label: 'Test',       color: '#8b5cf6' },
  { id: 'scan',    label: 'Scan',       color: '#f59e0b' },
  { id: 'deploy',  label: 'Deploy',     color: '#10b981' },
  { id: 'monitor', label: 'Monitor',    color: '#06b6d4' },
]

function PipelineFlow() {
  const [active, setActive] = useState(0)
  const [done, setDone] = useState<number[]>([])
  useEffect(() => {
    const id = setInterval(() => {
      setActive(a => {
        const next = (a + 1) % PIPELINE_NODES.length
        if (next === 0) setDone([])
        else setDone(d => [...d, a])
        return next
      })
    }, 1100)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex items-center justify-center gap-0 py-2">
      {PIPELINE_NODES.map((n, i) => (
        <div key={n.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold transition-all duration-500
              ${active === i ? 'scale-125 shadow-lg ring-2 ring-offset-2' : done.includes(i) ? 'opacity-90' : 'opacity-40 scale-90'}`}
              style={{ background: n.color, boxShadow: active === i ? `0 0 20px ${n.color}60` : undefined,
                outline: active === i ? `2px solid ${n.color}` : undefined }}>
              {done.includes(i) ? '✓' : active === i ? <span className="animate-spin-slow">⟳</span> : i + 1}
            </div>
            <span className={`text-[9px] font-semibold transition-all ${active === i ? 'text-slate-800' : 'text-slate-400'}`}>{n.label}</span>
          </div>
          {i < PIPELINE_NODES.length - 1 && (
            <div className={`w-8 h-0.5 mx-1 mb-4 transition-all duration-700 ${done.includes(i) ? 'bg-emerald-400' : 'bg-slate-200'}`}>
              {done.includes(i) && <div className="h-full bg-emerald-400 pipeline-flow-line" />}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Live metrics ticker ── */
function MetricsTicker() {
  const [metrics, setMetrics] = useState([
    { label: 'CO₂ Saved Today', value: 12.4, unit: 'kg', delta: +0.3, color: 'text-emerald-600' },
    { label: 'Cost Saved',      value: 847,  unit: '$',  delta: +12,  color: 'text-blue-600' },
    { label: 'Pipelines Scanned', value: 234, unit: '',  delta: +3,   color: 'text-purple-600' },
    { label: 'Avg Risk Score',  value: 18,   unit: '/100', delta: -2, color: 'text-orange-600' },
  ])
  useEffect(() => {
    const id = setInterval(() => {
      setMetrics(m => m.map(x => ({
        ...x,
        value: +(x.value + (Math.random() - 0.4) * x.delta).toFixed(1),
      })))
    }, 2000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map(m => (
        <div key={m.label} className="bg-white/70 backdrop-blur rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{m.label}</div>
          <div className={`text-2xl font-extrabold ${m.color} tabular-nums transition-all`}>
            {m.unit === '$' ? `$${m.value}` : `${m.value}${m.unit}`}
          </div>
          <div className={`text-[10px] mt-1 ${m.delta > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
            {m.delta > 0 ? '▲' : '▼'} live
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── data ── */
const features = [
  { icon: Leaf,        grad: 'from-emerald-400 to-teal-500',  bg: 'bg-emerald-50',  text: 'text-emerald-600', title: 'Carbon Analysis',    desc: 'Measure CO₂ per deployment with A–F ratings and region-aware carbon intensity.' },
  { icon: DollarSign,  grad: 'from-blue-400 to-indigo-500',   bg: 'bg-blue-50',     text: 'text-blue-600',    title: 'Cost Estimation',    desc: 'Break down compute, storage, and network costs with monthly projections.' },
  { icon: ShieldCheck, grad: 'from-purple-400 to-violet-500', bg: 'bg-purple-50',   text: 'text-purple-600',  title: 'Risk Scoring',       desc: 'Score deployment risk 0–100 with factor-level breakdown and severity tags.' },
  { icon: Zap,         grad: 'from-amber-400 to-orange-500',  bg: 'bg-amber-50',    text: 'text-amber-600',   title: 'Policy Enforcement', desc: 'Automated governance gates that approve, warn, or block pipelines instantly.' },
  { icon: BarChart3,   grad: 'from-rose-400 to-pink-500',     bg: 'bg-rose-50',     text: 'text-rose-600',    title: 'Executive Reports',  desc: 'Compliance-ready dashboards with actionable optimization recommendations.' },
  { icon: GitBranch,   grad: 'from-teal-400 to-cyan-500',     bg: 'bg-teal-50',     text: 'text-teal-600',    title: 'Multi-Platform',     desc: 'Supports GitHub Actions, Azure DevOps across Azure, AWS, and GCP regions.' },
]

export default function HomePage({ onGetStarted }: Props) {
  const [statsVisible, setStatsVisible] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const typed = useTypewriter(['CI/CD Pipelines.', 'Carbon Footprint.', 'Deployment Costs.', 'Release Risk.'])

  const c1 = useCounter(40, 1600, statsVisible)
  const c2 = useCounter(30, 1800, statsVisible)
  const c3 = useCounter(6,  1200, statsVisible)
  const c4 = useCounter(99, 2000, statsVisible)

  const feat = useScrollReveal()
  const how  = useScrollReveal()
  const live = useScrollReveal()

  // Mouse parallax on hero
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = heroRef.current?.getBoundingClientRect()
    if (!r) return
    setMousePos({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 })
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} onMouseMove={onMouseMove}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 overflow-hidden">

        {/* Particle network */}
        <ParticleCanvas />

        {/* Animated gradient bg */}
        <div className="absolute inset-0 hero-bg" />

        {/* Parallax orbs */}
        <div className="absolute top-24 left-[8%] w-80 h-80 bg-emerald-300/25 rounded-full blur-3xl orb-1 pointer-events-none"
          style={{ transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)` }} />
        <div className="absolute bottom-20 right-[8%] w-96 h-96 bg-blue-300/20 rounded-full blur-3xl orb-2 pointer-events-none"
          style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }} />
        <div className="absolute top-1/3 right-[20%] w-48 h-48 bg-purple-300/20 rounded-full blur-2xl pointer-events-none"
          style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }} />

        {/* Dot grid */}
        <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">

          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-emerald-200 shadow-md mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">AI-Powered DevOps Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.08] mb-6 animate-fade-in-up delay-100">
            Optimize Your<br />
            <span className="gradient-text-animated">
              {typed}<span className="animate-blink text-emerald-500">|</span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            GreenOps AI analyzes CI/CD pipelines in real time — measuring carbon footprint,
            estimating costs, scoring risk, and enforcing governance automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-in-up delay-300">
            <button onClick={onGetStarted}
              className="group relative flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-300/50 hover:shadow-emerald-400/60 hover:-translate-y-1 text-sm overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">Analyze a Pipeline</span>
              <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur border border-slate-200 text-slate-700 hover:bg-white font-semibold rounded-2xl transition-all text-sm shadow-sm hover:-translate-y-0.5">
              See How It Works
            </a>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-5 animate-fade-in-up delay-400">
            {[
              { icon: CheckCircle, text: 'Azure OpenAI Powered' },
              { icon: Globe,       text: 'Multi-Cloud' },
              { icon: Activity,    text: 'Real-time Analysis' },
              { icon: Cpu,         text: '6 Parallel Agents' },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-1.5 text-xs text-slate-500 bg-white/60 backdrop-blur px-3 py-1.5 rounded-full border border-slate-100">
                <b.icon className="w-3.5 h-3.5 text-emerald-500" />
                {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Hero dashboard card */}
        <div className="relative z-10 w-full max-w-3xl mx-auto mt-14 animate-fade-in-up delay-400 px-4">
          <div className="glass-card rounded-3xl overflow-hidden shadow-2xl shadow-slate-400/20 border border-white/70"
            style={{ transform: `perspective(1000px) rotateX(${mousePos.y * -3}deg) rotateY(${mousePos.x * 3}deg)`, transition: 'transform 0.1s ease' }}>
            {/* Terminal bar */}
            <div className="bg-slate-900 px-5 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="ml-2 text-xs text-slate-400 font-mono">greenops-ai — pipeline analysis</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-mono">● LIVE</span>
              </div>
            </div>
            {/* Pipeline flow */}
            <div className="bg-slate-800/95 px-6 py-4 border-b border-slate-700">
              <PipelineFlow />
            </div>
            {/* Results */}
            <div className="bg-white p-6">
              <div className="flex items-center gap-3 mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200 text-sm">✓</div>
                <div>
                  <div className="text-sm font-bold text-emerald-800">Pipeline Approved</div>
                  <div className="text-xs text-emerald-600 mt-0.5">All 4 governance checks passed · 2.3s</div>
                </div>
                <div className="ml-auto flex gap-5 text-center">
                  {[['B','Carbon'],['A','Cost'],['LOW','Risk']].map(([v,l]) => (
                    <div key={l}><div className="text-xl font-extrabold text-emerald-700">{v}</div><div className="text-[10px] text-slate-400">{l}</div></div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'CO₂ Emissions', value: '0.156 kg', sub: 'per deployment', bar: 35, color: 'bg-emerald-500', glow: 'shadow-emerald-200' },
                  { label: 'Total Cost',     value: '$0.26',    sub: 'per run',        bar: 26, color: 'bg-blue-500',   glow: 'shadow-blue-200' },
                  { label: 'Risk Score',     value: '10/100',   sub: 'LOW risk',       bar: 10, color: 'bg-orange-400', glow: 'shadow-orange-200' },
                ].map(c => (
                  <div key={c.label} className={`bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:shadow-md hover:${c.glow} transition-all`}>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{c.label}</div>
                    <div className="text-2xl font-extrabold text-slate-800 mb-1">{c.value}</div>
                    <div className="text-[10px] text-slate-400 mb-2">{c.sub}</div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full bar-fill`} style={{ '--bar-w': `${c.bar}%` } as React.CSSProperties} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── LIVE METRICS ── */}
      <div ref={live.ref} className={`py-12 px-6 bg-gradient-to-br from-slate-50 to-white transition-all duration-700 ${live.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Platform Metrics</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>
          <MetricsTicker />
        </div>
      </div>

      {/* ── STATS ── */}
      <section ref={statsRef} className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: `${c1}%`, label: 'Carbon Reduction' },
            { value: `${c2}%`, label: 'Cost Savings' },
            { value: `${c3}`,  label: 'AI Agents' },
            { value: `${c4}%`, label: 'Uptime SLA' },
          ].map(s => (
            <div key={s.label} className="group cursor-default">
              <div className="text-4xl md:text-5xl font-extrabold gradient-text mb-1 group-hover:scale-110 transition-transform duration-300">{s.value}</div>
              <div className="text-sm text-slate-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <div ref={how.ref} className={`py-24 px-6 bg-slate-50 transition-all duration-700 ${how.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <section id="how-it-works" className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2 mb-3">How It Works</h2>
            <p className="text-slate-500 max-w-lg mx-auto">From pipeline YAML to full analysis in three steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300" />
            {[
              { num: '01', title: 'Paste or Upload', desc: 'Drop your pipeline YAML or upload a PDF config file.', grad: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-200' },
              { num: '02', title: 'AI Analyzes',     desc: '6 agents run in parallel — carbon, cost, risk, policy.', grad: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-200' },
              { num: '03', title: 'Get Results',     desc: 'Instant dashboard with charts, scores, and recommendations.', grad: 'from-purple-400 to-violet-500', shadow: 'shadow-purple-200' },
            ].map((s, i) => (
              <div key={s.num} className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center text-xl font-extrabold text-white shadow-lg ${s.shadow} bg-gradient-to-br ${s.grad} group-hover:scale-110 transition-transform`}>
                  {s.num}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── FEATURES ── */}
      <div ref={feat.ref} className={`py-24 px-6 bg-white transition-all duration-700 ${feat.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <section id="features" className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Capabilities</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2 mb-3">Six AI Agents, One Platform</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Specialized agents work in parallel to give you a complete picture of every deployment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={f.title}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="group relative bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-default"
                style={{ transitionDelay: `${i * 50}ms` }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${f.grad} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300`} />
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${f.grad} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-300`} />
                <div className={`relative w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                  <f.icon className={`w-6 h-6 ${f.text}`} />
                </div>
                <h3 className="relative font-bold text-slate-900 text-base mb-2 group-hover:text-slate-700">{f.title}</h3>
                <p className="relative text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.grad} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                {hovered === i && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 animate-ping" />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 cta-bg" />
        <div className="absolute inset-0 hero-grid opacity-10" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-8">
            <Cloud className="w-3.5 h-3.5 text-white/80" />
            <span className="text-xs font-bold text-white/90 tracking-widest uppercase">Ready to Start?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Green your pipeline<br />in under 30 seconds.
          </h2>
          <p className="text-white/70 mb-10 text-lg max-w-xl mx-auto">Paste your YAML or upload a PDF and get instant carbon, cost, and risk analysis.</p>
          <button onClick={onGetStarted}
            className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-2xl shadow-black/20 hover:-translate-y-1 text-sm">
            Analyze a Pipeline
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 bg-slate-50 py-4 px-6">
        <div className="w-full flex items-center">
          <span className="font-bold text-slate-700 text-sm w-1/3">GreenOps AI</span>
          <span className="text-xs text-slate-400 w-1/3 text-center">© {new Date().getFullYear()} GreenOps AI. All rights reserved.</span>
          <div className="flex items-center justify-end gap-5 text-xs text-slate-400 w-1/3">
            {['Privacy Policy','Terms of Service','Contact'].map(l => (
              <span key={l} className="hover:text-slate-600 cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
