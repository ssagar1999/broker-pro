"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "../../components/ui/card";
import { PropertiesGrid } from "../../components/properties/properties-grid"
import { Toolbar } from "../../components/properties/toolbar"
import { FiltersSheet } from "../../components/properties/filters-sheet"
import { ActiveFiltersBar } from "../../components/properties/active-filters"
import { PropertySkeletonGrid } from "../../components/properties/property-skeletogrid"
import { useDebounce } from "../../hooks/use-debounce"
import useUserStore from "@/lib/store/userStore"
import { usePropertiesStore } from "../../lib/store/propertyStore"
import type { Property } from "@/lib/api/types";
import { AppLayout } from "@/components/layout/app-layout";


export default function PropertiesPage() {
    const router = useRouter();
  // brokerId from auth store
  const userId = useUserStore((s) => s.userId)
console.log(userId)
  // properties state and actions from zustand
  const {
    properties,
    loading,
    error,
    favorites,
    filters,
    fetchProperties,
    setSearchQuery,
    setSortBy,
    toggleStatus,
    togglePropertyType,
    setPriceRange,
    clearFilters,
    toggleFavorite,
    removeProperty,
  } = usePropertiesStore()

  // fetch on mount and when broker changes
  useEffect(() => {
    fetchProperties(userId ?? null)
  }, [fetchProperties, userId])

  // local UI state for sheet open + strings for price inputs
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [priceRangeStrings, setPriceRangeStrings] = useState<{ min: string; max: string }>({
    min: filters.minPrice?.toString() ?? "",
    max: filters.maxPrice?.toString() ?? "",
  })

  // keep field state synced back into store as numbers
  useEffect(() => {
    const min = priceRangeStrings.min ? Number(priceRangeStrings.min) : null
    const max = priceRangeStrings.max ? Number(priceRangeStrings.max) : null
    setPriceRange(min, max)
  }, [priceRangeStrings, setPriceRange])

  // debounce search to reduce recompute churn
  const debouncedSearch = useDebounce(filters.searchQuery, 200)

  // property types list
  const uniquePropertyTypes = useMemo(
    () => Array.from(new Set(properties.map((p) => p.propertyType))).filter(Boolean) as string[],
    [properties],
  )

  // derived filtered + sorted list (computed on client)
  const filteredData = useMemo<Property[]>(() => {
    let result = properties.slice()

    // search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (p) =>
          p.owner?.name?.toLowerCase().includes(q) ||
          p.location?.address?.toLowerCase().includes(q) ||
          p.propertyType?.toLowerCase().includes(q),
      )
    }

    // status filter
    if (filters.statuses.length > 0) {
      result = result.filter((p) => filters.statuses.includes(p.status))
    }

    // property type filter
    if (filters.propertyTypes.length > 0) {
      result = result.filter((p) => filters.propertyTypes.includes(p.propertyType))
    }

    // price range
    if (filters.minPrice != null) {
      result = result.filter((p) => p.price >= filters.minPrice!)
    }
    if (filters.maxPrice != null) {
      result = result.filter((p) => p.price <= filters.maxPrice!)
    }

    // sorting
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "recent":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return result
  }, [properties, debouncedSearch, filters])

  const activeFilterCount =
    filters.statuses.length +
    filters.propertyTypes.length +
    (filters.minPrice != null || filters.maxPrice != null ? 1 : 0)

  const clearPriceRange = useCallback(() => setPriceRangeStrings({ min: "", max: "" }), [])

  const handleDelete = useCallback(
    (id: string) => {
      // TODO: integrate delete API; for now optimistic removal in store
      if (confirm("Are you sure you want to delete this entry?")) {
        removeProperty(id)
      }
    },
    [removeProperty],
  )

  return (
    <AppLayout>
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-balance text-3xl font-bold">Properties</h1>
            <p className="text-muted-foreground">
              Showing {filteredData.length} of {properties.length} properties
            </p>
          </div>
          <Button onClick={() => router.push("/add-property" )}>Add New Property</Button>
        </div>

        <Toolbar
          searchQuery={filters.searchQuery}
          onSearchQueryChange={setSearchQuery}
          sortBy={filters.sortBy}
          onSortByChange={(v) => setSortBy(v)}
          activeFilterCount={activeFilterCount}
          onOpenFilters={() => setFilterSheetOpen(true)}
        />

        {activeFilterCount > 0 && (
          <ActiveFiltersBar
            selectedStatuses={filters.statuses}
            selectedPropertyTypes={filters.propertyTypes}
            priceRange={priceRangeStrings}
            onRemoveStatus={(s) => toggleStatus(s)}
            onRemoveType={(t) => togglePropertyType(t)}
            onClearPrice={clearPriceRange}
            onClearAll={() => {
              clearFilters()
              setPriceRangeStrings({ min: "", max: "" })
            }}
          />
        )}

        <FiltersSheet
          open={filterSheetOpen}
          onOpenChange={setFilterSheetOpen}
          selectedStatuses={filters.statuses}
          onToggleStatus={(s) => toggleStatus(s)}
          selectedPropertyTypes={filters.propertyTypes}
          uniquePropertyTypes={uniquePropertyTypes}
          onTogglePropertyType={(t) => togglePropertyType(t)}
          priceRange={priceRangeStrings}
          onPriceRangeChange={setPriceRangeStrings}
          onClearAll={() => {
            clearFilters()
            setPriceRangeStrings({ min: "", max: "" })
          }}
        />

        <div className="mt-6">
          {loading ? (
            <PropertySkeletonGrid />
          ) : error ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">Failed to load properties.</p>
              </CardContent>
            </Card>
          ) : filteredData.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="mb-4 text-muted-foreground">
                  {properties.length === 0 ? "No properties yet" : "No properties match your filters"}
                </p>
                {properties.length === 0 ? (
                  <Button onClick={() => alert("Navigate to your Add Property page")}>Add Your First Property</Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      clearFilters()
                      setPriceRangeStrings({ min: "", max: "" })
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <PropertiesGrid
              items={filteredData}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>


      </AppLayout>
  )
}
