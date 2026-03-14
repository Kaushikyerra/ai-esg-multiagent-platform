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
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)

  const handleAnalyze = async (config: string, type: string, region: string) => {
    setLoading(true)
    setAnalyzeError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipeline_config: config, pipeline_type: type, region })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
        const detail = err.detail ?? 'Analysis failed'
        setAnalyzeError(detail)
        return
      }
      const data = await res.json()
      setResult(data)
      setPage('dashboard')
    } catch {
      setAnalyzeError('Could not connect to backend. Make sure it is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar page={page} onNavigate={setPage} hasResult={!!result} />

      {page === 'home'      && <HomePage onGetStarted={() => setPage('analyze')} />}
      {page === 'analyze'   && <AnalyzePage onAnalyze={handleAnalyze} loading={loading} error={analyzeError} onClearError={() => setAnalyzeError(null)} />}
      {page === 'dashboard' && result && <DashboardPage result={result} onNewAnalysis={() => setPage('analyze')} />}
      {page === 'dashboard' && !result && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-slate-400 text-lg mb-4">No analysis yet.</p>
          <button onClick={() => setPage('analyze')}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
            Run Analysis
          </button>
        </div>
      )}
    </div>
  )
}
