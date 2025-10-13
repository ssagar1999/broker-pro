"use client"

import { useEffect, useMemo } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import useUserStore from "@/lib/store/userStore"
import { usePropertiesStore } from "@/lib/store/propertyStore"
import { toastUtils, toastMessages } from "../../lib/utils/toast"

import { PropertyStatusChart } from '../../components/charts/propertyStatusChart'
import Mychart from './my-chart'
import Mychart2 from './my-chart2'

export default function AnalyticsPage() {
  const userId = useUserStore((s) => s.userId)

  const {
    properties,
    fetchProperties,
    setSearchQuery,
    setSortBy,
    toggleStatus,
    togglePropertyType,
    setPriceRange,
    clearFilters,
    toggleFavorite,
    removeProperty,
    setCurrentPage,
  } = usePropertiesStore()

  // Fetch properties when the page loads
  useEffect(() => {
    if (userId) {
      fetchProperties(userId)
    }
  }, [fetchProperties, userId])

  // Analytics Calculations
  const totalProperties = properties.length

  const availableProperties = useMemo(() => {
    return properties.filter(property => property.status === 'available').length
  }, [properties])

  const totalPrice = useMemo(() => {
    return properties.reduce((sum, property) => sum + (property.price || 0), 0)
  }, [properties])

  const averagePrice = useMemo(() => {
    return totalPrice / totalProperties || 0
  }, [totalPrice, totalProperties])

   

  const top5Properties = useMemo(() => {
    return properties
      .sort((a, b) => b.meta.views - a.meta.views) // Sort by views (descending)
      .slice(0, 5) // Take top 5
  }, [properties])

  return (
    <AppLayout>
       <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Property Analytics</h1>

      {/* First Chart in a Card */}
      <div className="card shadow-lg rounded-md w-full md:w-1/2 p-4 mb-6">
        <Mychart />
      </div>

      <h1 className="text-xl mb-4">Second chart is below</h1>

      {/* Second Chart in a Card */}
      <div className="card shadow-lg rounded-md w-full md:w-1/2 p-4 mb-6">
        <Mychart2 />
      </div>
    </div>
    </AppLayout>
  )
}

