import { DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: {
    compute_cost_usd: number
    storage_cost_usd: number
    network_cost_usd: number
    total_cost_usd: number
    monthly_projection_usd: number
    cost_rating: string
  }
}

export default function CostCard({ data }: Props) {
  const getRatingColor = (rating: string) => {
    const colors: Record<string, string> = {
      'A': 'text-green-600',
      'B': 'text-green-500',
      'C': 'text-yellow-500',
      'D': 'text-orange-500',
      'F': 'text-red-600'
    }
    return colors[rating] || 'text-gray-600'
  }

  const chartData = [
    { name: 'Compute', value: data.compute_cost_usd },
    { name: 'Storage', value: data.storage_cost_usd },
    { name: 'Network', value: data.network_cost_usd }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Cost Analysis</h3>
        </div>
        <div className={`text-3xl font-bold ${getRatingColor(data.cost_rating)}`}>
          {data.cost_rating}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-3xl font-bold text-gray-900">
            ${data.total_cost_usd.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">Per deployment</div>
        </div>

        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-gray-500">Monthly Projection</div>
          <div className="text-2xl font-bold text-blue-600">
            ${data.monthly_projection_usd.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}
