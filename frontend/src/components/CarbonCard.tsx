import { Leaf } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface Props {
  data: {
    co2_grams: number
    co2_kg: number
    power_consumption_kwh: number
    trees_equivalent_per_year: number
    rating: string
    region: string
  }
}

export default function CarbonCard({ data }: Props) {
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
    { name: 'CO₂ Emissions', value: data.co2_grams, color: '#10B981' },
    { name: 'Remaining Budget', value: Math.max(0, 500 - data.co2_grams), color: '#E5E7EB' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Carbon Impact</h3>
        </div>
        <div className={`text-3xl font-bold ${getRatingColor(data.rating)}`}>
          {data.rating}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-3xl font-bold text-gray-900">{data.co2_kg.toFixed(3)} kg</div>
          <div className="text-sm text-gray-500">CO₂ per deployment</div>
        </div>

        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-sm text-gray-500">Power Usage</div>
            <div className="text-lg font-semibold text-gray-900">
              {data.power_consumption_kwh.toFixed(4)} kWh
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Trees/Year</div>
            <div className="text-lg font-semibold text-gray-900">
              {data.trees_equivalent_per_year.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
