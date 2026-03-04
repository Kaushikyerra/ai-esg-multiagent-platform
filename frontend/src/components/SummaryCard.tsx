import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface Props {
  summary: {
    can_proceed: boolean
    decision: string
    carbon_rating: string
    cost_rating: string
    risk_level: string
  }
}

export default function SummaryCard({ summary }: Props) {
  const getDecisionStyle = () => {
    switch (summary.decision) {
      case 'APPROVED':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle className="w-8 h-8 text-green-600" />
        }
      case 'APPROVED_WITH_WARNINGS':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: <AlertTriangle className="w-8 h-8 text-yellow-600" />
        }
      case 'BLOCKED':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <XCircle className="w-8 h-8 text-red-600" />
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: <AlertTriangle className="w-8 h-8 text-gray-600" />
        }
    }
  }

  const style = getDecisionStyle()

  return (
    <div className={`${style.bg} ${style.border} border-2 rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {style.icon}
          <div>
            <h2 className={`text-2xl font-bold ${style.text}`}>
              {summary.decision.replace(/_/g, ' ')}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {summary.can_proceed ? 'Pipeline can proceed' : 'Pipeline blocked'}
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{summary.carbon_rating}</div>
            <div className="text-xs text-gray-600 mt-1">Carbon</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{summary.cost_rating}</div>
            <div className="text-xs text-gray-600 mt-1">Cost</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              summary.risk_level === 'LOW' ? 'text-green-600' :
              summary.risk_level === 'MEDIUM' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {summary.risk_level}
            </div>
            <div className="text-xs text-gray-600 mt-1">Risk</div>
          </div>
        </div>
      </div>
    </div>
  )
}
