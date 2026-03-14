import { useState } from 'react'
import PipelineInput from './components/PipelineInput'
import Dashboard from './components/Dashboard'
import { AnalysisResult } from './types'

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async (config: string, type: string, region: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipeline_config: config,
          pipeline_type: type,
          region: region
        })
      })
      
      if (!response.ok) {
        throw new Error('Analysis failed')
      }
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze pipeline. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">🌱</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GreenOps AI</h1>
              <p className="text-sm text-gray-500">DevOps Intelligence System</p>
            </div>
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
            Built for AI Dev Days Hackathon - Microsoft AI Platform
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
