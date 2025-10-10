"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void

  selectedStatuses: string[]
  onToggleStatus: (s: string) => void

  selectedPropertyTypes: string[]
  uniquePropertyTypes: string[]
  onTogglePropertyType: (t: string) => void

  priceRange: { min: string; max: string }
  onPriceRangeChange: (r: { min: string; max: string }) => void

  onClearAll: () => void
}

const ALL_STATUSES = ["available", "booked", "unavailable"]

export function FiltersSheet({
  open,
  onOpenChange,
  selectedStatuses,
  onToggleStatus,
  selectedPropertyTypes,
  uniquePropertyTypes,
  onTogglePropertyType,
  priceRange,
  onPriceRangeChange,
  onClearAll,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine your property search with filters below</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium">Status</h3>
            <div className="space-y-2">
              {ALL_STATUSES.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={() => onToggleStatus(status)}
                  />
                  <label
                    htmlFor={`status-${status}`}
                    className="text-sm capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {uniquePropertyTypes.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium">Property Type</h3>
              <div className="space-y-2">
                {uniquePropertyTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedPropertyTypes.includes(type)}
                      onCheckedChange={() => onTogglePropertyType(type)}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-sm font-medium">Price Range</h3>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Min price"
                value={priceRange.min}
                onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Max price"
                value={priceRange.max}
                onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
              />
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={onClearAll}>
            Clear All Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
