import { useState } from 'react'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import DashboardPage from './pages/DashboardPage'
import Navbar from './components/Navbar'
import { AnalysisResult } from './types'

export type Page = 'home' | 'analyze' | 'dashboard'

export default function App() {
  const [page, setPage]       = useState<Page>('home')
  const [result, setResult]   = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [lastRequest, setLastRequest] = useState<{ config: string; type: string; region: string } | null>(null)

  const handleAnalyze = async (config: string, type: string, region: string) => {
    setLoading(true)
    setError(null)
    setLastRequest({ config, type, region })
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipeline_config: config, pipeline_type: type, region })
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setResult(data)
      setPage('dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Make sure the backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!lastRequest) return
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipeline_config: lastRequest.config,
          pipeline_type: lastRequest.type,
          region: lastRequest.region
        })
      })
      const html = await res.text()
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'greenops-report.html'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to generate report.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar page={page} onNavigate={setPage} hasResult={result !== null} />

      {page === 'home' && (
        <HomePage onGetStarted={() => setPage('analyze')} />
      )}

      {page === 'analyze' && (
        <AnalyzePage
          onAnalyze={handleAnalyze}
          loading={loading}
          error={error}
          onClearError={() => setError(null)}
        />
      )}

      {page === 'dashboard' && result && (
        <DashboardPage
          result={result}
          onNewAnalysis={() => setPage('analyze')}
          onDownloadReport={handleDownloadReport}
        />
      )}
    </div>
  )
}
