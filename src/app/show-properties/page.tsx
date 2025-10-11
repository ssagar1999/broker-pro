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
import { Pagination } from "../../components/properties/pagination"
import { useDebounce } from "../../hooks/use-debounce"
import useUserStore from "@/lib/store/userStore"
import { usePropertiesStore } from "../../lib/store/propertyStore"
import type { Property } from "@/lib/api/types";
import { AppLayout } from "@/components/layout/app-layout";
import { toastUtils, toastMessages } from "../../lib/utils/toast";


export default function PropertiesPage() {
    const router = useRouter();
  // brokerId from auth store
  const userId = useUserStore((s) => s.userId)
  // properties state and actions from zustand
  const {
    properties,
    loading,
    error,
    favorites,
    filters,
    pagination,
    currentPage,
    fetchProperties,
    fetchPropertiesWithSmartPagination,
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

  // fetch on mount and when broker changes
  useEffect(() => {
    if (userId) {
      fetchProperties(userId)
    }
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

  // debounce search to reduce API calls
  const debouncedSearch = useDebounce(filters.searchQuery, 500)

  // property types list - we'll get this from the current properties
  const uniquePropertyTypes = useMemo(
    () => Array.from(new Set((properties || []).map((p) => p.propertyType))).filter(Boolean) as string[],
    [properties],
  )

  // Update search query when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== filters.searchQuery) {
      setSearchQuery(debouncedSearch)
      // Trigger smart pagination when search changes
      if (userId) {
        fetchPropertiesWithSmartPagination(userId)
      }
    }
  }, [debouncedSearch, filters.searchQuery, setSearchQuery, fetchPropertiesWithSmartPagination, userId])

  // Refetch when filters change (except search which is handled by debounce)
  useEffect(() => {
    if (userId) {
      fetchPropertiesWithSmartPagination(userId)
    }
  }, [filters.statuses, filters.propertyTypes, filters.minPrice, filters.maxPrice, filters.sortBy, fetchPropertiesWithSmartPagination, userId])

  const activeFilterCount =
    filters.statuses.length +
    filters.propertyTypes.length +
    (filters.minPrice != null || filters.maxPrice != null ? 1 : 0)

  const clearPriceRange = useCallback(() => setPriceRangeStrings({ min: "", max: "" }), [])

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
        try {
          // Optimistic removal in store
          removeProperty(id)
          toastUtils.success(toastMessages.propertyDeleted)
        } catch (error) {
          console.error("Delete error:", error)
          toastUtils.error("Failed to delete property. Please try again.")
        }
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
              {pagination ? (
                <>Showing {properties.length} of {pagination.totalCount} properties
                {pagination.currentPage > 1 && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Page {pagination.currentPage}
                  </span>
                )}
                </>
              ) : (
                <>Loading properties...</>
              )}
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
          {!userId ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">Please log in to view your properties.</p>
                <Button onClick={() => router.push("/register")}>Go to Login</Button>
              </CardContent>
            </Card>
          ) : loading ? (
            <PropertySkeletonGrid />
          ) : error ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">Failed to load properties.</p>
                <p className="text-sm text-muted-foreground mt-2">{error}</p>
              </CardContent>
            </Card>
          ) : (properties || []).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="mb-4 text-muted-foreground">
                  {pagination?.totalCount === 0 ? "No properties yet" : "No properties match your current filters"}
                </p>
                {pagination?.totalCount === 0 ? (
                  <Button onClick={() => router.push("/add-property")}>Add Your First Property</Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground text-center">
                      Try adjusting your filters or search terms to find more properties.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        clearFilters()
                        setPriceRangeStrings({ min: "", max: "" })
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <PropertiesGrid
                items={properties}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onDelete={handleDelete}
              />
              {pagination && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setCurrentPage(page, userId)}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>


      </AppLayout>
  )
}
