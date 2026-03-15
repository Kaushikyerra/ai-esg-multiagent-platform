import { useState, useRef, useCallback } from 'react'
import { Play, RotateCcw, Upload, FileText, X, ChevronDown } from 'lucide-react'
import { extractTextFromPDF } from '../utils/pdfExtractor'

interface Props {
  onAnalyze: (config: string, type: string, region: string) => void
  loading: boolean
  error?: string | null
  onClearError?: () => void
}

const SAMPLE = `name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install & Build
        run: |
          npm install
          npm run build

  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Run Tests
        run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: [build, test]
    environment: production
    steps:
      - name: Deploy to Azure
        run: echo 'Deploying to production...'`

const PIPELINE_TYPES = [
  { value: 'github_actions', label: 'GitHub Actions' },
  { value: 'azure_devops',   label: 'Azure DevOps' },
]
const REGIONS = [
  { value: 'azure_eastus',     label: 'Azure — East US' },
  { value: 'azure_westeurope', label: 'Azure — West Europe' },
  { value: 'aws_us_east_1',    label: 'AWS — US East 1' },
  { value: 'gcp_us_central1',  label: 'GCP — US Central 1' },
]

export default function AnalyzePage({ onAnalyze, loading, error, onClearError }: Props) {
  const [config, setConfig]         = useState(SAMPLE)
  const [type, setType]             = useState('github_actions')
  const [region, setRegion]         = useState('azure_eastus')
  const [pdfFile, setPdfFile]       = useState<File | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [dragOver, setDragOver]     = useState(false)
  const [inputMode, setInputMode]   = useState<'yaml' | 'pdf'>('yaml')
  const [pdfWarning, setPdfWarning] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePDF = useCallback(async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file.')
      return
    }
    setPdfFile(file)
    setPdfLoading(true)
    try {
      const text = await extractTextFromPDF(file)
      setConfig(text)
      setInputMode('yaml')
      setPdfWarning(false)

      // Warn if content doesn't look like a pipeline
      const lower = text.toLowerCase()
      const looksLikePipeline = lower.includes('jobs') || lower.includes('steps') ||
        lower.includes('runs-on') || lower.includes('pipeline') || lower.includes('trigger') ||
        lower.includes('name:') || lower.includes('run:') || lower.includes('uses:') ||
        lower.includes('on:') || lower.includes('deploy') || lower.includes('build')
      if (!looksLikePipeline) {
        setPdfWarning(true)
      } else {
        setPdfWarning(false)
      }
    } catch {
      alert('Could not read PDF. Please paste the YAML manually.')
    } finally {
      setPdfLoading(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handlePDF(file)
  }, [handlePDF])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handlePDF(file)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Pipeline Analysis</h1>
        <p className="text-slate-500 text-sm mt-1">Paste your CI/CD YAML or upload a PDF containing your pipeline configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: input area */}
        <div className="lg:col-span-2 space-y-4">

          {/* Mode toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            {(['yaml', 'pdf'] as const).map(m => (
              <button
                key={m}
                onClick={() => setInputMode(m)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${inputMode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {m === 'yaml' ? '📝 YAML' : '📄 PDF Upload'}
              </button>
            ))}
          </div>

          {inputMode === 'yaml' ? (
            /* YAML editor */
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">pipeline.yaml</span>
                  {pdfFile && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Extracted from {pdfFile.name}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => { setConfig(SAMPLE); setPdfFile(null) }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
              {pdfWarning && (
                <div className="mx-4 mt-3 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <span className="text-amber-500 text-sm flex-shrink-0">⚠️</span>
                  <p className="text-xs text-amber-700">
                    This PDF doesn't appear to contain a CI/CD pipeline. The extracted text is shown below — please verify or paste valid YAML before running analysis.
                  </p>
                </div>
              )}
              <textarea
                value={config}
                onChange={e => setConfig(e.target.value)}
                rows={22}
                spellCheck={false}
                className="w-full px-4 py-4 font-mono text-sm text-slate-700 resize-none focus:outline-none leading-relaxed bg-white"
                placeholder="Paste your pipeline YAML here..."
              />
            </div>
          ) : (
            /* PDF drop zone */
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                ${dragOver ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50'}`}
            >
              <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={onFileChange} />

              {pdfLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-slate-500">Extracting text from PDF...</p>
                </div>
              ) : pdfFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{pdfFile.name}</p>
                    <p className="text-sm text-emerald-600 mt-1">✓ Text extracted successfully</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setPdfFile(null); setConfig(SAMPLE); setPdfWarning(false) }}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors mt-1"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Upload className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Drop your PDF here</p>
                    <p className="text-sm text-slate-400 mt-1">or click to browse</p>
                  </div>
                  <p className="text-xs text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                    Supports pipeline docs, runbooks, and CI/CD config PDFs
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: options */}
        <div className="flex flex-col gap-4">
          {/* Pipeline type */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Pipeline Type
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-emerald-400 transition-colors"
              >
                {PIPELINE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Region */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Cloud Region
            </label>
            <div className="relative">
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-emerald-400 transition-colors"
              >
                {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* What gets analyzed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Analyzes</p>
            <ul className="space-y-2.5">
              {[
                { dot: 'bg-emerald-500', label: 'Carbon footprint' },
                { dot: 'bg-blue-500',    label: 'Cost estimation' },
                { dot: 'bg-orange-500',  label: 'Risk scoring' },
                { dot: 'bg-purple-500',  label: 'Policy enforcement' },
              ].map(item => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${item.dot} flex-shrink-0`} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-red-500 text-sm flex-shrink-0 mt-0.5">⚠️</span>
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">Analysis failed</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
              <button onClick={onClearError} className="text-red-400 hover:text-red-600 text-xs ml-2">✕</button>
            </div>
          )}

          {/* Run button */}
          <button
            onClick={() => onAnalyze(config, type, region)}
            disabled={loading || !config.trim() || pdfLoading}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all
              bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed
              text-white shadow-lg shadow-emerald-200"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Analysis
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
