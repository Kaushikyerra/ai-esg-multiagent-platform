import { AlertTriangle } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend } from 'recharts'

interface Props {
  data: {
    risk_score: number
    risk_level: string
    risk_factors: Array<{
      factor: string
      severity: string
      impact: number
    }>
  }
}

export default function RiskCard({ data }: Props) {
  const getRiskColor = () => {
    if (data.risk_score < 20) return '#10B981'
    if (data.risk_score < 50) return '#F59E0B'
    if (data.risk_score < 75) return '#F97316'
    return '#EF4444'
  }

  const chartData = [
    {
      name: 'Risk Score',
      value: data.risk_score,
      fill: getRiskColor()
    }
  ]

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    }
    return colors[severity] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
        </div>
        <div className={`text-3xl font-bold`} style={{ color: getRiskColor() }}>
          {data.risk_level}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-3xl font-bold text-gray-900">{data.risk_score}</div>
          <div className="text-sm text-gray-500">Risk score (0-100)</div>
        </div>

        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              data={chartData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {data.risk_factors.length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-gray-700 mb-2">Risk Factors</div>
            <div className="space-y-2">
              {data.risk_factors.slice(0, 3).map((factor, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex-1">{factor.factor}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(factor.severity)}`}>
                    {factor.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
