import { useState } from 'react'
import PipelineInput from './components/PipelineInput'
import Dashboard from './components/Dashboard'
import { AnalysisResult } from './types'

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastRequest, setLastRequest] = useState<{ config: string; type: string; region: string } | null>(null)

  const handleAnalyze = async (config: string, type: string, region: string) => {
    setLoading(true)
    setLastRequest({ config, type, region })
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipeline_config: config, pipeline_type: type, region })
      })
      if (!response.ok) throw new Error('Analysis failed')
      setResult(await response.json())
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze pipeline. Make sure the backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!lastRequest) return
    const response = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pipeline_config: lastRequest.config,
        pipeline_type: lastRequest.type,
        region: lastRequest.region
      })
    })
    const html = await response.text()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'greenops-report.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🌱</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GreenOps AI</h1>
                <p className="text-sm text-gray-500">Multi-Agent DevOps Intelligence · AI Dev Days 2026</p>
              </div>
            </div>
            {result && (
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                📄 Download Report
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <PipelineInput onAnalyze={handleAnalyze} loading={loading} />
        {result && <Dashboard result={result} />}
      </main>

      <footer className="mt-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Built for AI Dev Days Hackathon 2026 · Microsoft Agent Framework · Azure OpenAI
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
