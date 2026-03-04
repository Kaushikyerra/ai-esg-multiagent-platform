import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface Props {
  data: {
    decision: string
    violations: any[]
    warnings: any[]
    passed: string[]
    can_proceed: boolean
  }
}

export default function PolicyCard({ data }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Policy Enforcement</h3>
      </div>

      <div className="space-y-4">
        {data.passed.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Passed Checks</span>
            </div>
            <div className="space-y-1">
              {data.passed.map((check, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 pl-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {check}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.warnings.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">Warnings</span>
            </div>
            <div className="space-y-1">
              {data.warnings.map((warning, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 pl-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  {warning}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.violations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Violations</span>
            </div>
            <div className="space-y-1">
              {data.violations.map((violation, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 pl-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {violation}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.passed.length === 0 && data.warnings.length === 0 && data.violations.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No policy checks configured
          </div>
        )}
      </div>
    </div>
  )
}
