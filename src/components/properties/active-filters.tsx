"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

type Props = {
  selectedStatuses: string[]
  selectedPropertyTypes: string[]
  priceRange: { min: string; max: string }
  onRemoveStatus: (s: string) => void
  onRemoveType: (t: string) => void
  onClearPrice: () => void
  onClearAll: () => void
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
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active filters:</span>

      {selectedStatuses.map((status) => (
        <Badge key={status} variant="secondary" className="gap-1">
          <span className="capitalize">{status}</span>
          <button
            onClick={() => onRemoveStatus(status)}
            className="ml-1 hover:text-foreground"
            aria-label={`Remove ${status}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {selectedPropertyTypes.map((type) => (
        <Badge key={type} variant="secondary" className="gap-1">
          {type}
          <button
            onClick={() => onRemoveType(type)}
            className="ml-1 hover:text-foreground"
            aria-label={`Remove ${type}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {(priceRange.min || priceRange.max) && (
        <Badge variant="secondary" className="gap-1">
          {priceRange.min && `$${priceRange.min}`}
          {priceRange.min && priceRange.max && " - "}
          {priceRange.max && `$${priceRange.max}`}
          <button onClick={onClearPrice} className="ml-1 hover:text-foreground" aria-label="Clear price range">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      <Button variant="ghost" size="sm" onClick={onClearAll} className="h-7 text-xs">
        Clear all
      </Button>
    </div>
  )
}
