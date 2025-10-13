
import { useMemo } from "react"

import { PieChart, Pie, Tooltip, LabelList } from "recharts"
import { Property } from "@/lib/api/types"  // Make sure the Property type is correct

interface PropertyStatusChartProps {
  properties: Property[]
}

export const PropertyStatusChart: React.FC<PropertyStatusChartProps> = ({ properties }) => {
  // Calculate the count of properties by status (Available, Booked, Unavailable)
  const statusCounts = useMemo(() => {
    const counts = {
      available: 0,
      booked: 0,
      unavailable: 0,
    }

    properties.forEach((property) => {
      if (property.status === 'available') counts.available++
      if (property.status === 'booked') counts.booked++
      if (property.status === 'unavailable') counts.unavailable++
    })

    return [
      { name: "Available", value: counts.available, fill: "#4CAF50" },   // Green for available
      { name: "Booked", value: counts.booked, fill: "#FF9800" },         // Orange for booked
      { name: "Unavailable", value: counts.unavailable, fill: "#F44336" }, // Red for unavailable
    ]
  }, [properties])

  return (
    <div className="mb-6">
      <h2 className="text-xl mb-2">Property Status Distribution</h2>
      <PieChart width={300} height={300}>
        <Pie
          data={statusCounts}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          fill="#8884d8"
        >
          <LabelList dataKey="name" position="outside" />
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  )
}


