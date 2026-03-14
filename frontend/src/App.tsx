import { useState } from 'react'
import Sidebar from './components/Sidebar'
import PipelineInput from './components/PipelineInput'
import Dashboard from './components/Dashboard'
import { AnalysisResult } from './types'

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'analyze' | 'dashboard'>('analyze')

  const handleAnalyze = async (config: string, type: string, region: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipeline_config: config, pipeline_type: type, region })
      })
      if (!response.ok) throw new Error('Analysis failed')
      const data = await response.json()
      setResult(data)
      setActiveTab('dashboard')
    } catch {
      alert('Failed to connect to backend. Make sure it is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} hasResult={!!result} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {activeTab === 'analyze' && (
            <PipelineInput onAnalyze={handleAnalyze} loading={loading} />
          )}
          {activeTab === 'dashboard' && result && (
            <Dashboard result={result} onReset={() => setActiveTab('analyze')} />
          )}
          {activeTab === 'dashboard' && !result && (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="text-5xl mb-4">📊</div>
              <p className="text-slate-400 text-lg">No analysis yet.</p>
              <button
                onClick={() => setActiveTab('analyze')}
                className="mt-4 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-colors"
              >
                Run Analysis
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
