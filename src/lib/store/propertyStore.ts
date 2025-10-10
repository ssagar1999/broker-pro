"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Property } from "@/lib/api/types"
import { getAllProperties, getPropertyById } from "@/lib/api/propertiesApi"

type SortBy = "recent" | "oldest" | "price-low" | "price-high"

interface Filters {
  searchQuery: string
  statuses: string[] // using item.status: 'available' | 'booked' | 'unavailable'
  propertyTypes: string[]
  minPrice?: number | null
  maxPrice?: number | null
  sortBy: SortBy
}

interface PropertiesState {
  properties: Property[]
  loading: boolean
  error: string | null
  favorites: Set<string>
  filters: Filters
  detailsById?: Record<string, Property>
  isLoadingDetail?: boolean

  // Actions
  fetchProperties: (brokerId: string | null) => Promise<void>
  setSearchQuery: (q: string) => void
  toggleStatus: (status: string) => void
  togglePropertyType: (type: string) => void
  setPriceRange: (min: number | null, max: number | null) => void
  clearFilters: () => void
  setSortBy: (sort: SortBy) => void
  toggleFavorite: (id: string) => void
  removeProperty: (id: string) => void
  fetchPropertyById?: (id: string) => Promise<void>
}

export const usePropertiesStore = create<PropertiesState>()(
  persist(
    (set, get) => ({
      properties: [],
      loading: false,
      error: null,
      favorites: new Set<string>(),
      filters: {
        searchQuery: "",
        statuses: [],
        propertyTypes: [],
        minPrice: null,
        maxPrice: null,
        sortBy: "recent",
      },
      detailsById: {},
      isLoadingDetail: false,

      fetchProperties: async (brokerId) => {
        set({ loading: true, error: null })
        try {
          const data = await getAllProperties(brokerId )
          set({ properties: data })
        } catch (e: any) {
          set({ error: e?.message || "Failed to load properties" })
        } finally {
          set({ loading: false })
        }
      },

      setSearchQuery: (q) => set((s) => ({ filters: { ...s.filters, searchQuery: q } })),
      toggleStatus: (status) =>
        set((s) => {
          const exists = s.filters.statuses.includes(status)
          const statuses = exists ? s.filters.statuses.filter((t) => t !== status) : [...s.filters.statuses, status]
          return { filters: { ...s.filters, statuses } }
        }),
      togglePropertyType: (type) =>
        set((s) => {
          const exists = s.filters.propertyTypes.includes(type)
          const propertyTypes = exists
            ? s.filters.propertyTypes.filter((t) => t !== type)
            : [...s.filters.propertyTypes, type]
          return { filters: { ...s.filters, propertyTypes } }
        }),
      setPriceRange: (min, max) => set((s) => ({ filters: { ...s.filters, minPrice: min, maxPrice: max } })),
      clearFilters: () =>
        set((s) => ({
          filters: { ...s.filters, searchQuery: "", statuses: [], propertyTypes: [], minPrice: null, maxPrice: null },
        })),
      setSortBy: (sort) => set((s) => ({ filters: { ...s.filters, sortBy: sort } })),
      toggleFavorite: (id) =>
        set((s) => {
          const next = new Set(s.favorites)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return { favorites: next }
        }),
      removeProperty: (id) =>
        set((s) => ({
          properties: s.properties.filter((p) => p._id !== id),
        })),
      fetchPropertyById: async (id: string) => {
        if (!id) return
        if (get().detailsById?.[id]) return
        try {
          set({ isLoadingDetail: true })
          const brokerId = get().properties.find((p) => p._id === id)?.brokerId ?? null
          const detail = await getPropertyById(brokerId, id)
          if (detail) {
            set((s) => ({ detailsById: { ...(s.detailsById || {}), [id]: detail } }))
          }
        } catch (e: any) {
          set({ error: e?.message || "Failed to load property details" })
        } finally {
          set({ isLoadingDetail: false })
        }
      },
    }),
    {
      name: "properties-store",
      partialize: (state) => ({
        favorites: Array.from(state.favorites),
        filters: state.filters,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray((state as any).favorites)) {
          ;(state as any).favorites = new Set((state as any).favorites)
        }
      },
    },
  ),
)
