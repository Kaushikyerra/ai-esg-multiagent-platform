import { useState } from 'react'
import { Play, RotateCcw, ChevronDown } from 'lucide-react'

interface Props {
  onAnalyze: (config: string, type: string, region: string) => void
  loading: boolean
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
  { value: 'azure_eastus',      label: 'Azure — East US' },
  { value: 'azure_westeurope',  label: 'Azure — West Europe' },
  { value: 'aws_us_east_1',     label: 'AWS — US East 1' },
  { value: 'gcp_us_central1',   label: 'GCP — US Central 1' },
]

export default function PipelineInput({ onAnalyze, loading }: Props) {
  const [config, setConfig] = useState(SAMPLE)
  const [type, setType]     = useState('github_actions')
  const [region, setRegion] = useState('azure_eastus')

  return (
    <div className="animate-fade-in-up">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Pipeline Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">
          Paste your CI/CD configuration to get carbon, cost, and risk insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: YAML editor */}
        <div className="lg:col-span-2 bg-[#13151f] border border-white/5 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pipeline YAML</span>
            <button
              onClick={() => setConfig(SAMPLE)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset sample
            </button>
          </div>
          <textarea
            value={config}
            onChange={e => setConfig(e.target.value)}
            rows={22}
            spellCheck={false}
            className="w-full bg-transparent px-4 py-4 font-mono text-sm text-slate-300 resize-none focus:outline-none leading-relaxed"
            placeholder="Paste your pipeline YAML here..."
          />
        </div>

        {/* Right: Options + Run */}
        <div className="flex flex-col gap-4">
          {/* Pipeline type */}
          <div className="bg-[#13151f] border border-white/5 rounded-xl p-4">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
              Pipeline Type
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full appearance-none bg-[#0f1117] border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:border-emerald-500/50 transition-colors"
              >
                {PIPELINE_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Region */}
          <div className="bg-[#13151f] border border-white/5 rounded-xl p-4">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
              Cloud Region
            </label>
            <div className="relative">
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full appearance-none bg-[#0f1117] border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:border-emerald-500/50 transition-colors"
              >
                {REGIONS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* What gets analyzed */}
          <div className="bg-[#13151f] border border-white/5 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Analyzes</p>
            <ul className="space-y-2">
              {[
                { dot: 'bg-emerald-500', label: 'Carbon footprint' },
                { dot: 'bg-blue-500',    label: 'Cost estimation' },
                { dot: 'bg-orange-500',  label: 'Risk scoring' },
                { dot: 'bg-purple-500',  label: 'Policy enforcement' },
              ].map(item => (
                <li key={item.label} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Run button */}
          <button
            onClick={() => onAnalyze(config, type, region)}
            disabled={loading || !config.trim()}
            className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm transition-all
              bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500
              disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-emerald-900/30"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing pipeline...
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
