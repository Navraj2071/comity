"use client"

interface PieChartData {
  name: string
  value: number
  color: string
}

interface PieChartProps {
  data: PieChartData[]
}

export function PieChart({ data }: PieChartProps) {
  // Filter out zero values for the chart
  const filteredData = data.filter((item) => item.value > 0)
  const total = filteredData.reduce((sum, item) => sum + item.value, 0)

  // If no data, show empty state
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-center">
          <div className="text-gray-500 text-sm">No data available</div>
          <div className="text-gray-600 text-xs mt-1">Add checkpoints to see statistics</div>
        </div>
      </div>
    )
  }

  let cumulativePercentage = 0

  const createPath = (percentage: number, startPercentage: number) => {
    const startAngle = startPercentage * 3.6 - 90
    const endAngle = (startPercentage + percentage) * 3.6 - 90

    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const largeArcFlag = percentage > 50 ? 1 : 0

    // Reduce the radius slightly for a more modern look
    const x1 = 50 + 38 * Math.cos(startAngleRad)
    const y1 = 50 + 38 * Math.sin(startAngleRad)
    const x2 = 50 + 38 * Math.cos(endAngleRad)
    const y2 = 50 + 38 * Math.sin(endAngleRad)

    return `M 50 50 L ${x1} ${y1} A 38 38 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
  }

  return (
    <div className="flex items-center justify-center space-x-6">
      <div className="relative">
        <svg width="180" height="180" viewBox="0 0 100 100" className="transform -rotate-90">
          {filteredData.map((item, index) => {
            const percentage = (item.value / total) * 100
            const path = createPath(percentage, cumulativePercentage)
            const currentCumulative = cumulativePercentage
            cumulativePercentage += percentage

            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                className="transition-all duration-300 hover:opacity-80"
                style={{
                  filter: "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))",
                }}
              />
            )
          })}
          {/* Add inner circle for a more modern donut chart look */}
          <circle cx="50" cy="50" r="25" fill="#1f2937" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: item.color }} />
            <div>
              <div className="text-xs font-medium text-white">{item.name}</div>
              <div className="text-xs text-gray-400">
                {item.value} ({item.value > 0 ? Math.round((item.value / total) * 100) : 0}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
