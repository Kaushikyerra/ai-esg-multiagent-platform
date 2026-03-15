import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, ReferenceLine,
} from 'recharts'
import { AnalysisResult } from '../types'
import { Download, TrendingDown, Zap, Leaf, DollarSign } from 'lucide-react'

interface Props { result: AnalysisResult }

const C = {
  emerald: '#10b981', blue: '#3b82f6', orange: '#f97316',
  red: '#ef4444', amber: '#f59e0b', purple: '#8b5cf6',
  teal: '#14b8a6', rose: '#f43f5e', slate: '#94a3b8',
}

const TT = {
  contentStyle: {
    background: '#fff', border: '1px solid #e2e8f0',
    borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  labelStyle: { color: '#475569', fontWeight: 600 },
}

const ratingScore = (r: string) => ({ A: 95, B: 75, C: 55, D: 35, F: 15 }[r] ?? 50)
const riskScore   = (r: string) => ({ LOW: 90, MEDIUM: 60, HIGH: 35, CRITICAL: 10 }[r] ?? 50)

// ── Gauge component ──────────────────────────────────────────────────────────
function ScoreGauge({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 54, circ = 2 * Math.PI * r
  const pct = Math.min(score, 100) / 100
  const dash = circ * pct
  return (
    <div className="flex flex-col items-center">
      <svg width="130" height="80" viewBox="0 0 130 80">
        <path d="M 15 75 A 50 50 0 0 1 115 75" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 15 75 A 50 50 0 0 1 115 75"
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${(dash / circ) * 157} ${157}`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="65" y="68" textAnchor="middle" fontSize="20" fontWeight="800" fill={color}>{score}</text>
      </svg>
      <span className="text-xs text-slate-500 -mt-1">{label}</span>
    </div>
  )
}

// ── Export helper ────────────────────────────────────────────────────────────
function exportJSON(result: AnalysisResult) {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
  a.download = `greenops-report-${Date.now()}.json`; a.click()
}

function exportCSV(result: AnalysisResult) {
  const rows = [
    ['Metric', 'Value'],
    ['Decision', result.summary.decision],
    ['Carbon Rating', result.summary.carbon_rating],
    ['Cost Rating', result.summary.cost_rating],
    ['Risk Level', result.summary.risk_level],
    ['CO2 (kg)', result.carbon_analysis.co2_kg],
    ['Power (kWh)', result.carbon_analysis.power_consumption_kwh],
    ['Total Cost ($)', result.cost_analysis.total_cost_usd],
    ['Monthly Projection ($)', result.cost_analysis.monthly_projection_usd],
    ['Risk Score', result.risk_analysis.risk_score],
    ['Jobs', result.pipeline_analysis.jobs_count],
    ['Steps', result.pipeline_analysis.steps_count],
    ['Duration (min)', result.pipeline_analysis.estimated_duration_minutes],
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
  a.download = `greenops-report-${Date.now()}.csv`; a.click()
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ChartsSection({ result }: Props) {
  const [tab, setTab] = useState<'overview' | 'carbon' | 'cost' | 'risk'>('overview')
  const [pdfLoading, setPdfLoading] = useState(false)
  const chartsRef = useRef<HTMLDivElement>(null)
  const { carbon_analysis: ca, cost_analysis: co, risk_analysis: ra, pipeline_analysis: pa } = result

  const exportPDF = async () => {
    if (!chartsRef.current) return
    setPdfLoading(true)
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = 210, pageH = 297, margin = 10

      // Header
      pdf.setFillColor(16, 185, 129)
      pdf.rect(0, 0, pageW, 18, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('GreenOps AI — Pipeline Analysis Report', margin, 12)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text(new Date().toLocaleString(), pageW - margin, 12, { align: 'right' })

      // Summary row
      pdf.setTextColor(30, 41, 59)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      let y = 26
      const summary = [
        { label: 'Decision', value: result.summary.decision },
        { label: 'Carbon', value: result.summary.carbon_rating },
        { label: 'Cost', value: result.summary.cost_rating },
        { label: 'Risk', value: result.summary.risk_level },
        { label: 'CO₂', value: `${ca.co2_kg.toFixed(3)} kg` },
        { label: 'Total Cost', value: `$${co.total_cost_usd.toFixed(4)}` },
      ]
      const colW = (pageW - margin * 2) / summary.length
      summary.forEach((s, i) => {
        const x = margin + i * colW
        pdf.setFillColor(248, 250, 252)
        pdf.roundedRect(x, y, colW - 2, 14, 2, 2, 'F')
        pdf.setFontSize(7)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(100, 116, 139)
        pdf.text(s.label, x + (colW - 2) / 2, y + 5, { align: 'center' })
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(15, 23, 42)
        pdf.text(String(s.value), x + (colW - 2) / 2, y + 11, { align: 'center' })
      })
      y += 20

      // Capture all 4 tabs
      const tabs: Array<'overview' | 'carbon' | 'cost' | 'risk'> = ['overview', 'carbon', 'cost', 'risk']
      const tabLabels = ['Overview', 'Carbon Analysis', 'Cost Analysis', 'Risk Analysis']

      for (let t = 0; t < tabs.length; t++) {
        // Switch tab
        const tabBtn = chartsRef.current.querySelector(`[data-tab="${tabs[t]}"]`) as HTMLElement
        if (tabBtn) tabBtn.click()
        await new Promise(r => setTimeout(r, 600))

        const canvas = await html2canvas(chartsRef.current, {
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
        } as Parameters<typeof html2canvas>[1])

        const imgData = canvas.toDataURL('image/png')
        const imgW = pageW - margin * 2
        const imgH = (canvas.height * imgW) / canvas.width

        // Add new page if needed
        if (t > 0) { pdf.addPage(); y = margin }

        // Tab label
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(16, 185, 129)
        pdf.text(tabLabels[t], margin, y + 6)
        y += 10

        // Fit image on page
        const maxH = pageH - y - margin
        const finalH = Math.min(imgH, maxH)
        const finalW = (finalH / imgH) * imgW
        pdf.addImage(imgData, 'PNG', margin, y, finalW, finalH)
        y = margin
      }

      pdf.save(`greenops-report-${Date.now()}.pdf`)
    } finally {
      setPdfLoading(false)
    }
  }

  // Cost breakdown pie
  const costPie = [
    { name: 'Compute', value: +co.compute_cost_usd.toFixed(4) },
    { name: 'Storage', value: +co.storage_cost_usd.toFixed(4) },
    { name: 'Network', value: +co.network_cost_usd.toFixed(4) },
  ]
  const PIE_COLORS = [C.blue, C.emerald, C.purple]

  // Monthly projection
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const base = co.monthly_projection_usd
  const projection = months.map((m, i) => ({
    month: m,
    current:   +(base * (1 + i * 0.03 + Math.sin(i) * 0.05)).toFixed(2),
    optimized: +(base * 0.72 * (1 + i * 0.02)).toFixed(2),
  }))

  // Carbon vs limits
  const carbonBar = [
    { name: 'This Deploy', co2: +ca.co2_grams.toFixed(1), fill: C.emerald },
    { name: 'Warn Limit',  co2: 500,  fill: C.amber },
    { name: 'Block Limit', co2: 1000, fill: C.red },
  ]

  // Risk factors radial
  const riskRadial = ra.risk_factors.length > 0
    ? ra.risk_factors.map((f, i) => ({
        name: f.factor.length > 20 ? f.factor.slice(0, 20) + '…' : f.factor,
        value: f.impact,
        fill: [C.orange, C.red, C.amber, C.purple, C.blue][i % 5],
      }))
    : [{ name: 'No factors', value: 5, fill: C.emerald }]

  // Radar health
  const radar = [
    { metric: 'Carbon',   score: ratingScore(ca.rating) },
    { metric: 'Cost',     score: ratingScore(co.cost_rating) },
    { metric: 'Risk',     score: riskScore(ra.risk_level) },
    { metric: 'Policy',   score: result.policy_decision.violations.length === 0 ? 90 : 20 },
    { metric: 'Coverage', score: pa.test_coverage_detected ? 85 : 30 },
    { metric: 'Deploy',   score: pa.deployment_detected ? 75 : 50 },
  ]

  // Carbon intensity line (simulated hourly)
  const intensityLine = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}:00`,
    intensity: +(ca.carbon_intensity * (0.85 + Math.sin(h / 3) * 0.2)).toFixed(0),
    yours: h === 12 ? ca.carbon_intensity : null,
  }))

  // Cost per step bar
  const stepsBar = Array.from({ length: pa.steps_count }, (_, i) => ({
    step: `S${i + 1}`,
    cost: +(co.total_cost_usd / pa.steps_count * (0.7 + Math.random() * 0.6)).toFixed(4),
  }))

  // Savings potential
  const savings = co.optimization_potential.length * 0.12 * co.total_cost_usd
  const savingsPct = Math.min(Math.round((savings / co.total_cost_usd) * 100), 45)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'carbon',   label: '🌱 Carbon' },
    { id: 'cost',     label: '💰 Cost' },
    { id: 'risk',     label: '⚠️ Risk' },
  ] as const

  return (
    <div className="space-y-5" ref={chartsRef}>

      {/* Section header + export + tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-800">Analytics & Visualizations</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => exportCSV(result)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={() => exportJSON(result)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="w-3.5 h-3.5" /> JSON
          </button>
          <button onClick={exportPDF} disabled={pdfLoading}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-emerald-300 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {pdfLoading
              ? <><div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /> Generating...</>
              : <><Download className="w-3.5 h-3.5" /> PDF</>
            }
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.id} data-tab={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all
              ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'overview' && (
        <div className="space-y-4">

          {/* Score gauges */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-5">Health Scores</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <ScoreGauge score={ratingScore(ca.rating)}       label="Carbon"   color={C.emerald} />
              <ScoreGauge score={ratingScore(co.cost_rating)}  label="Cost"     color={C.blue} />
              <ScoreGauge score={riskScore(ra.risk_level)}     label="Risk"     color={C.orange} />
              <ScoreGauge score={result.policy_decision.violations.length === 0 ? 90 : 20} label="Policy" color={C.purple} />
              <ScoreGauge score={pa.test_coverage_detected ? 85 : 30} label="Coverage" color={C.teal} />
              <ScoreGauge score={Math.round(100 - (pa.estimated_duration_minutes / 120) * 100)} label="Speed" color={C.rose} />
            </div>
          </div>

          {/* Radar + Cost Pie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Pipeline Health Radar</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radar}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Radar name="Score" dataKey="score" stroke={C.emerald} fill={C.emerald} fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip {...TT} formatter={(v: number) => [`${v}/100`, 'Score']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Cost Breakdown</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={costPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {costPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip {...TT} formatter={(v: number) => [`$${v}`, 'Cost']} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Leaf,          color: 'text-emerald-600 bg-emerald-50', label: 'CO₂ Saved (opt.)',   value: `${(ca.co2_grams * 0.28).toFixed(1)}g` },
              { icon: DollarSign,    color: 'text-blue-600 bg-blue-50',       label: 'Potential Savings',  value: `$${savings.toFixed(3)}` },
              { icon: TrendingDown,  color: 'text-purple-600 bg-purple-50',   label: 'Cost Reduction',     value: `${savingsPct}%` },
              { icon: Zap,           color: 'text-amber-600 bg-amber-50',     label: 'Efficiency Score',   value: `${Math.round((ratingScore(ca.rating) + ratingScore(co.cost_rating)) / 2)}/100` },
            ].map(k => (
              <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${k.color} flex items-center justify-center flex-shrink-0`}>
                  <k.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-900 font-bold text-sm">{k.value}</div>
                  <div className="text-slate-400 text-xs">{k.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CARBON TAB ── */}
      {tab === 'carbon' && (
        <div className="space-y-4">
          {/* Carbon vs limits */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">CO₂ vs Policy Limits</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={carbonBar} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}g`} />
                <Tooltip {...TT} formatter={(v: number) => [`${v}g`, 'CO₂']} />
                <Bar dataKey="co2" radius={[6, 6, 0, 0]}>
                  {carbonBar.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Carbon intensity over 24h */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Grid Carbon Intensity — 24h (gCO₂/kWh)</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={intensityLine}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip {...TT} formatter={(v: number) => [`${v} gCO₂/kWh`, '']} />
                <ReferenceLine y={ca.carbon_intensity} stroke={C.orange} strokeDasharray="4 4" label={{ value: 'Your region', fontSize: 10, fill: C.orange }} />
                <Line type="monotone" dataKey="intensity" stroke={C.emerald} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Carbon stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'CO₂ Emitted',      value: `${ca.co2_grams.toFixed(1)}g`,                  color: 'text-emerald-700' },
              { label: 'Power Used',        value: `${ca.power_consumption_kwh.toFixed(4)} kWh`,   color: 'text-blue-700' },
              { label: 'Carbon Intensity',  value: `${ca.carbon_intensity} gCO₂/kWh`,              color: 'text-orange-700' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COST TAB ── */}
      {tab === 'cost' && (
        <div className="space-y-4">
          {/* Monthly projection area */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">12-Month Cost Projection</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Current</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Optimized</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={projection}>
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.blue}    stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.blue}    stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="og" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.emerald} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.emerald} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip {...TT} formatter={(v: number) => [`$${v}`, '']} />
                <Area type="monotone" dataKey="current"   stroke={C.blue}    strokeWidth={2} fill="url(#cg)" name="Current" />
                <Area type="monotone" dataKey="optimized" stroke={C.emerald} strokeWidth={2} fill="url(#og)" name="Optimized" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cost per step */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Estimated Cost per Step</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stepsBar} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="step" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip {...TT} formatter={(v: number) => [`$${v}`, 'Cost']} />
                <Bar dataKey="cost" fill={C.blue} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Per Deployment',   value: `$${co.total_cost_usd.toFixed(3)}`,          color: 'text-blue-700' },
              { label: 'Monthly',          value: `$${co.monthly_projection_usd.toFixed(2)}`,  color: 'text-purple-700' },
              { label: 'Compute',          value: `$${co.compute_cost_usd.toFixed(3)}`,         color: 'text-slate-700' },
              { label: 'Potential Saving', value: `${savingsPct}%`,                             color: 'text-emerald-700' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RISK TAB ── */}
      {tab === 'risk' && (
        <div className="space-y-4">
          {/* Risk radial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Risk Factor Impact</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={90}
                  data={riskRadial} startAngle={180} endAngle={-180}>
                  <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#f8fafc' }} />
                  <Tooltip {...TT} formatter={(v: number) => [`${v} pts`, 'Impact']} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Risk Breakdown by Severity</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={[
                    { sev: 'Critical', count: ra.risk_factors.filter(f => f.severity === 'critical').length },
                    { sev: 'High',     count: ra.risk_factors.filter(f => f.severity === 'high').length },
                    { sev: 'Medium',   count: ra.risk_factors.filter(f => f.severity === 'medium').length },
                    { sev: 'Low',      count: ra.risk_factors.filter(f => f.severity === 'low').length },
                  ]}
                  barSize={36}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="sev" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...TT} formatter={(v: number) => [`${v}`, 'Factors']} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {[C.red, C.orange, C.amber, C.emerald].map((fill, i) => <Cell key={i} fill={fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk factor table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Risk Factor Details</p>
            {ra.risk_factors.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No risk factors detected — pipeline looks clean.</p>
            ) : (
              <div className="space-y-2">
                {ra.risk_factors.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 font-medium">{f.factor}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{ width: `${Math.min(f.impact, 100)}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 w-8 text-right">{f.impact}pt</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                        ${{ critical: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700',
                             medium: 'bg-amber-100 text-amber-700', low: 'bg-emerald-100 text-emerald-700' }[f.severity] ?? 'bg-slate-100 text-slate-600'}`}>
                        {f.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risk KPIs */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Risk Score',    value: `${ra.risk_score}/100`,              color: 'text-orange-700' },
              { label: 'Risk Level',    value: ra.risk_level,                        color: 'text-slate-700' },
              { label: 'Total Factors', value: `${ra.risk_factors.length}`,          color: 'text-red-700' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
