import { useState } from 'react'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import DashboardPage from './pages/DashboardPage'
import LoginPage, { User } from './pages/LoginPage'
import Navbar from './components/Navbar'
import { AnalysisResult } from './types'

export type Page = 'home' | 'analyze' | 'dashboard' | 'login'

export default function App() {
  const [user, setUser]       = useState<User | null>(null)
  const [page, setPage]       = useState<Page>('home')
  const [result, setResult]   = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    setPage('analyze')
  }

  const handleLogout = () => {
    setUser(null)
    setPage('home')
    setResult(null)
  }

  // Guard: if unauthenticated user tries to navigate to analyze/dashboard, send to login
  const handleNavigate = (p: Page) => {
    if (!user && (p === 'analyze' || p === 'dashboard')) {
      setPage('login')
    } else {
      setPage(p)
    }
  }

  const handleAnalyze = async (config: string, type: string, region: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipeline_config: config, pipeline_type: type, region })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
        setError(err.detail ?? 'Analysis failed')
        return
      }
      const data = await res.json()
      setResult(data)
      setPage('dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Make sure the backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = () => {
    if (!result) return
    const { carbon_analysis: c, cost_analysis: co, risk_analysis: r,
            downtime_analysis: d, policy_decision: p, pipeline_analysis: pa } = result
    const decisionColor = p.can_proceed ? '#10b981' : '#ef4444'
    const downtimeProb  = d?.downtime_probability ?? 0
    const downtimeScore = d?.downtime_risk_score   ?? 0
    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>GreenOps AI Report</title>
<style>
  body{font-family:Inter,system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 24px;color:#1e293b}
  h1{color:#10b981;font-size:28px;margin-bottom:4px}
  .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-weight:700;font-size:14px;color:#fff;background:${decisionColor}}
  .section{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:16px 0}
  .section h2{font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin:0 0 14px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .stat{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px}
  .stat-label{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em}
  .stat-value{font-size:22px;font-weight:800;color:#1e293b;margin-top:4px}
  ul{margin:8px 0;padding-left:20px} li{margin:5px 0;font-size:14px;color:#475569}
  .footer{text-align:center;color:#94a3b8;font-size:12px;margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0}
  .bar-wrap{background:#e2e8f0;border-radius:99px;height:6px;margin-top:8px}
  .bar{height:6px;border-radius:99px;background:#10b981}
</style></head><body>
<h1>🌱 GreenOps AI — Pipeline Report</h1>
<p style="color:#64748b;margin-bottom:10px">Jobs: ${pa.jobs_count} &nbsp;|&nbsp; Steps: ${pa.steps_count} &nbsp;|&nbsp; Est. duration: ${pa.estimated_duration_minutes} min</p>
<span class="badge">${p.decision}</span>
<div class="section"><h2>Carbon Impact</h2><div class="grid">
  <div class="stat"><div class="stat-label">CO₂ per deployment</div><div class="stat-value">${c.co2_kg.toFixed(4)} kg</div></div>
  <div class="stat"><div class="stat-label">Rating</div><div class="stat-value">${c.rating}</div></div>
  <div class="stat"><div class="stat-label">Power usage</div><div class="stat-value">${c.power_consumption_kwh.toFixed(4)} kWh</div></div>
  <div class="stat"><div class="stat-label">Trees / year</div><div class="stat-value">${c.trees_equivalent_per_year.toFixed(4)}</div></div>
</div></div>
<div class="section"><h2>Cost Estimate</h2><div class="grid">
  <div class="stat"><div class="stat-label">Total cost</div><div class="stat-value">${co.total_cost_usd.toFixed(4)}</div></div>
  <div class="stat"><div class="stat-label">Monthly projection</div><div class="stat-value">${co.monthly_projection_usd.toFixed(2)}</div></div>
  <div class="stat"><div class="stat-label">Compute</div><div class="stat-value">${co.compute_cost_usd.toFixed(4)}</div></div>
  <div class="stat"><div class="stat-label">Rating</div><div class="stat-value">${co.cost_rating}</div></div>
</div></div>
<div class="section"><h2>Risk Assessment</h2><div class="grid">
  <div class="stat"><div class="stat-label">Risk score</div><div class="stat-value">${r.risk_score} / 100</div>
    <div class="bar-wrap"><div class="bar" style="width:${r.risk_score}%;background:#f59e0b"></div></div>
  </div>
  <div class="stat"><div class="stat-label">Risk level</div><div class="stat-value">${r.risk_level}</div></div>
</div>
${r.risk_factors.length ? `<ul>${r.risk_factors.map(f => `<li><b>${f.factor}</b> — ${f.severity} (impact: ${f.impact})</li>`).join('')}</ul>` : ''}
</div>
${d ? `<div class="section"><h2>Downtime Analysis</h2><div class="grid">
  <div class="stat"><div class="stat-label">Probability</div><div class="stat-value">${downtimeProb}%</div>
    <div class="bar-wrap"><div class="bar" style="width:${downtimeProb}%;background:#ef4444"></div></div>
  </div>
  <div class="stat"><div class="stat-label">Risk score</div><div class="stat-value">${downtimeScore} / 100</div></div>
</div>
${d.preventative_measures?.length ? `<ul>${d.preventative_measures.map(m => `<li>✅ ${m}</li>`).join('')}</ul>` : ''}
</div>` : ''}
<div class="section"><h2>Policy Decision</h2>
${p.passed?.length ? `<ul>${p.passed.map(x => `<li>✅ ${x}</li>`).join('')}</ul>` : ''}
${p.warnings?.length ? `<ul>${p.warnings.map(x => `<li>⚠️ ${typeof x === 'object' ? JSON.stringify(x) : x}</li>`).join('')}</ul>` : ''}
${p.violations?.length ? `<ul>${p.violations.map(x => `<li>❌ ${typeof x === 'object' ? JSON.stringify(x) : x}</li>`).join('')}</ul>` : ''}
</div>
${r.recommendations?.length ? `<div class="section"><h2>Recommendations</h2><ul>${r.recommendations.map(x => `<li>${x}</li>`).join('')}</ul></div>` : ''}
<div class="footer">Generated by GreenOps AI &nbsp;·&nbsp; ${new Date().toLocaleString()}</div>
</body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'greenops-report.html'; a.click()
    URL.revokeObjectURL(url)
  }

  if (page === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={() => setPage('home')} />
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar page={page} onNavigate={handleNavigate} hasResult={!!result} user={user} onLogout={handleLogout} />

      {page === 'home' && <HomePage onGetStarted={() => handleNavigate('analyze')} />}

      {page === 'analyze' && (
        <AnalyzePage onAnalyze={handleAnalyze} loading={loading} error={error} onClearError={() => setError(null)} />
      )}

      {page === 'dashboard' && result && (
        <DashboardPage result={result} onNewAnalysis={() => setPage('analyze')} onDownloadReport={handleDownloadReport} />
      )}

      {page === 'dashboard' && !result && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-slate-400 text-lg mb-4">No analysis yet.</p>
          <button onClick={() => setPage('analyze')} className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">Run Analysis</button>
        </div>
      )}
    </div>
  )
}
