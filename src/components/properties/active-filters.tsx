"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Filter, CheckCircle, Clock, Ban, Home, Building, MapPin, DollarSign } from "lucide-react"

type Props = {
  selectedStatuses: string[]
  selectedPropertyTypes: string[]
  priceRange: { min: string; max: string }
  onRemoveStatus: (s: string) => void
  onRemoveType: (t: string) => void
  onClearPrice: () => void
  onClearAll: () => void
}

// Helper function to get status icon and color
const getStatusInfo = (status: string) => {
  switch (status) {
    case 'available':
      return { icon: CheckCircle, color: 'text-green-600', label: 'Available' }
    case 'booked':
      return { icon: Clock, color: 'text-yellow-600', label: 'Booked' }
    case 'unavailable':
      return { icon: Ban, color: 'text-red-600', label: 'Unavailable' }
    default:
      return { icon: CheckCircle, color: 'text-gray-600', label: status }
  }
}

// Helper function to get property type icon
const getPropertyTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'house': return Home
    case 'apartment': return Building
    case 'office': return Building
    case 'shop': return Building
    case 'land': return MapPin
    case 'warehouse': return Building
    case 'pg': return Home
    case 'hostel': return Home
    case 'farmhouse': return Home
    case 'villa': return Home
    case 'duplex': return Home
    case 'studio': return Home
    case 'penthouse': return Building
    case 'residential plot': return MapPin
    case 'commercial plot': return MapPin
    default: return Home
  }
}

// Helper function to format property type label
const formatPropertyTypeLabel = (type: string) => {
  return type
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function ActiveFiltersBar({
  selectedStatuses,
  selectedPropertyTypes,
  priceRange,
  onRemoveStatus,
  onRemoveType,
  onClearPrice,
  onClearAll,
}: Props) {
  const totalFilters = selectedStatuses.length + selectedPropertyTypes.length + 
    (priceRange.min || priceRange.max ? 1 : 0)

  if (totalFilters === 0) {
    return null
  }

  return (
    <div className="bg-muted/30 rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Active Filters
          </span>
          <Badge variant="secondary" className="ml-1">
            {totalFilters}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearAll} 
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filters */}
        {selectedStatuses.map((status) => {
          const { icon: Icon, color, label } = getStatusInfo(status)
          return (
            <Badge 
              key={status} 
              variant="secondary" 
              className="gap-1.5 px-3 py-1.5 bg-background border hover:bg-muted/50 transition-colors"
            >
              <Icon className={`h-3 w-3 ${color}`} />
              <span className="text-xs font-medium">{label}</span>
              <button
                onClick={() => onRemoveStatus(status)}
                className="ml-1 hover:text-foreground transition-colors"
                aria-label={`Remove ${label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )
        })}

        {/* Property Type Filters */}
        {selectedPropertyTypes.map((type) => {
          const Icon = getPropertyTypeIcon(type)
          return (
            <Badge 
              key={type} 
              variant="secondary" 
              className="gap-1.5 px-3 py-1.5 bg-background border hover:bg-muted/50 transition-colors"
            >
              <Icon className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">{formatPropertyTypeLabel(type)}</span>
              <button
                onClick={() => onRemoveType(type)}
                className="ml-1 hover:text-foreground transition-colors"
                aria-label={`Remove ${type} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )
        })}

        {/* Price Range Filter */}
        {(priceRange.min || priceRange.max) && (
          <Badge 
            variant="secondary" 
            className="gap-1.5 px-3 py-1.5 bg-background border hover:bg-muted/50 transition-colors"
          >
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium">
              {priceRange.min && `₹${priceRange.min}`}
              {priceRange.min && priceRange.max && " - "}
              {priceRange.max && `₹${priceRange.max}`}
            </span>
            <button 
              onClick={onClearPrice} 
              className="ml-1 hover:text-foreground transition-colors" 
              aria-label="Clear price range filter"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  )
}
