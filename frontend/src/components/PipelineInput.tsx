import { useState } from 'react'
import { FileCode, Play } from 'lucide-react'

interface Props {
  onAnalyze: (config: string, type: string, region: string) => void
  loading: boolean
}

const SAMPLE_PIPELINE = `name: Sample Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: npm run build
  
  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Run tests
        run: npm test
  
  deploy:
    runs-on: ubuntu-latest
    needs: [build, test]
    steps:
      - name: Deploy
        run: echo 'Deploying...'`

export default function PipelineInput({ onAnalyze, loading }: Props) {
  const [config, setConfig] = useState(SAMPLE_PIPELINE)
  const [type, setType] = useState('github_actions')
  const [region, setRegion] = useState('azure_eastus')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAnalyze(config, type, region)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <FileCode className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Pipeline Configuration</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pipeline Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="github_actions">GitHub Actions</option>
              <option value="azure_devops">Azure DevOps</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="azure_eastus">Azure East US</option>
              <option value="azure_westeurope">Azure West Europe</option>
              <option value="aws_us_east_1">AWS US East 1</option>
              <option value="gcp_us_central1">GCP US Central 1</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pipeline YAML
          </label>
          <textarea
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Paste your pipeline configuration here..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-md font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Analyze Pipeline
            </>
          )}
        </button>
      </form>
    </div>
  )
}
