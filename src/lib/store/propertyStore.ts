"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Property } from "@/lib/api/types"
import { getAllProperties, getPropertyById, deletePropertyById } from "@/lib/api/propertiesApi"
import useUserStore from "./userStore"

// ===== TYPE DEFINITIONS =====
// These define what data structure we're working with

type SortBy = "recent" | "oldest" | "price-low" | "price-high"

// Filter options that user can select
interface Filters {
  searchQuery: string        // Text user types in search box
  statuses: string[]         // Array of selected statuses like ['available', 'booked']
  propertyTypes: string[]    // Array of selected property types like ['apartment', 'house']
  minPrice?: number | null   // Minimum price filter
  maxPrice?: number | null   // Maximum price filter
  sortBy: SortBy            // How to sort the results
}

// Information about pagination (which page we're on, how many total pages, etc.)
interface PaginationInfo {
  currentPage: number    // Current page number (1, 2, 3, etc.)
  totalPages: number     // Total number of pages available
  totalCount: number     // Total number of properties
  limit: number         // How many properties per page
  hasNextPage: boolean  // Can we go to next page?
  hasPrevPage: boolean  // Can we go to previous page?
}

// Main state interface - this is like a blueprint of our data store
interface PropertiesState {
  // ===== DATA =====
  properties: Property[]           // Array of all properties currently loaded
  loading: boolean                // Are we currently loading data?
  error: string | null            // Any error message
  favorites: Set<string>          // Set of property IDs that user has favorited
  filters: Filters               // Current filter settings
  pagination: PaginationInfo | null  // Pagination information
  currentPage: number            // Which page we're currently on
  
  // Individual property details
  detailsById: Record<string, Property>  // Cache of individual property details by ID
  isLoadingDetail: boolean       // Loading state for individual property
  
  // ===== ACTIONS (FUNCTIONS) =====
  // These are functions that can change the state
  fetchProperties: (brokerId: string | null, page?: number) => Promise<void>
  fetchPropertyById: (propertyId: string, force:boolean) => Promise<void>
  fetchPropertiesWithSmartPagination: (brokerId: string | null) => Promise<void>
  setSearchQuery: (q: string) => void
  toggleStatus: (status: string) => void
  togglePropertyType: (type: string) => void
  setPriceRange: (min: number | null, max: number | null) => void
  clearFilters: () => void
  setSortBy: (sort: SortBy) => void
  toggleFavorite: (id: string) => void
  removeProperty: (propertyId: string, brokerId:string) => void
  setCurrentPage: (page: number, brokerId?: string | null) => void
}

// ===== CREATING THE STORE =====
// This creates our global state store that can be used anywhere in the app

export const usePropertiesStore = create<PropertiesState>()(
  persist(
    // ===== STORE CREATOR FUNCTION =====
    // This function receives two parameters:
    // - set: function to update the state
    // - get: function to read the current state
    (set, get) => ({
      
      // ===== INITIAL STATE (DEFAULT VALUES) =====
      // When the app first loads, these are the starting values
      properties: [],                    // No properties loaded yet
      loading: false,                   // Not loading anything initially
      error: null,                      // No errors initially
      favorites: new Set<string>(),     // Empty set of favorites
      pagination: null,                 // No pagination info yet
      currentPage: 1,                   // Start on page 1
      
      // Individual property details
      detailsById: {},                  // Empty cache of property details
      isLoadingDetail: false,           // Not loading individual property initially
      
      // Default filter settings
      filters: {
        searchQuery: "",               // No search text
        statuses: [],                  // No status filters selected
        propertyTypes: [],             // No property type filters selected
        minPrice: null,                // No minimum price
        maxPrice: null,                // No maximum price
        sortBy: "recent",              // Sort by most recent first
      },

      // ===== FETCH PROPERTIES FUNCTION =====
      // This function loads properties from the server
      fetchProperties: async (brokerId, page = 1) => {
        console.log("🔄 Starting to fetch properties...", { brokerId, page })
        
        // Step 1: Check if user is logged in
        if (!brokerId) {
          console.log("❌ No brokerId provided")
          set({ 
            loading: false, 
            error: "Please log in to view properties" 
          })
          return
        }
        
        // Step 2: Set loading state (show spinner)
        console.log("⏳ Setting loading to true")
        set({ loading: true, error: null })
        
        try {
          // Step 3: Get current filter settings
          const currentState = get() // get() reads the current state
          console.log("📋 Current filters:", currentState.filters)
          
          // Step 4: Call the API with current filters
          console.log("🌐 Calling API...")
          const response = await getAllProperties(brokerId, {
            page,                    // Which page to load
            limit: 12,              // 12 properties per page
            searchQuery: currentState.filters.searchQuery,
            statuses: currentState.filters.statuses,
            propertyTypes: currentState.filters.propertyTypes,
            minPrice: currentState.filters.minPrice,
            maxPrice: currentState.filters.maxPrice,
            sortBy: currentState.filters.sortBy,
          })
          
          console.log("✅ API response received:", response)
          
          // Step 5: Update the state with new data
          if (Array.isArray(response)) {
            // Old API format - just an array
            console.log("📦 Using old API format")
            set({ 
              properties: response,
              pagination: null,
              currentPage: page
            })
          } else {
            // New API format - has pagination info
            console.log("📦 Using new API format with pagination")
            set({ 
              properties: response.properties || [],
              pagination: response.pagination,
              currentPage: page
            })
          }
          
          console.log("✅ Properties loaded successfully!")
          
        } catch (error: any) {
          // Step 6: Handle errors
          console.log("❌ Error loading properties:", error)
          set({ error: error?.message || "Failed to load properties" })
        } finally {
          // Step 7: Always stop loading (hide spinner)
          console.log("🏁 Setting loading to false")
          set({ loading: false })
        }
      },

      // ===== FETCH INDIVIDUAL PROPERTY FUNCTION =====
      // This function loads a single property by ID
    

      // ===== FETCH PROPERTY BY ID FUNCTION =====
      // This function loads a single property by ID (simplified version for edit page)
      fetchPropertyById: async (propertyId, force = false) => {
        console.log("🔄 Starting to fetch property by ID...", { propertyId })
        
        // Check if property is already cached
        const currentState = get()
        if (!force && currentState.detailsById[propertyId]) {
          console.log("✅ Property already cached, skipping fetch")
          return
        }
        
        // Set loading state
        console.log("⏳ Setting detail loading to true")
        set({ isLoadingDetail: true, error: null })
        
        try {
          // Get brokerId from user store
          const brokerId = useUserStore.getState().userId
          
          if (!brokerId) {
            console.log("❌ No broker ID found")
            set({ 
              isLoadingDetail: false, 
              error: "Please log in to view property details" 
            })
            return
          }
          
          // Call the API to get property details
          console.log("🌐 Calling API for property details...")
          const property = await getPropertyById(brokerId, propertyId)
          
          console.log("✅ Property details received:", property)
          
          // Update the cache with the new property
          set((currentState) => ({
            detailsById: {
              ...currentState.detailsById,
              [propertyId]: property
            }
          }))
          
          console.log("✅ Property details cached successfully!")
          
        } catch (error: any) {
          // Handle errors
          console.log("❌ Error loading property details:", error)
          set({ error: error?.message || "Failed to load property details" })
        } finally {
          // Always stop loading
          console.log("🏁 Setting detail loading to false")
          set({ isLoadingDetail: false })
        }
      },

      // ===== SMART PAGINATION FUNCTION =====
      // This function finds the first page with results when filters are applied
      fetchPropertiesWithSmartPagination: async (brokerId) => {
        console.log("🧠 Starting smart pagination fetch...", { brokerId })
        
        if (!brokerId) {
          console.log("❌ No brokerId provided")
          set({ 
            loading: false, 
            error: "Please log in to view properties" 
          })
          return
        }
        
        set({ loading: true, error: null })
        
        try {
          const currentState = get()
          console.log("📋 Current filters:", currentState.filters)
          
          // First, try to get the total count to see if there are any results
          const response = await getAllProperties(brokerId, {
            page: 1,
            limit: 12,
            searchQuery: currentState.filters.searchQuery,
            statuses: currentState.filters.statuses,
            propertyTypes: currentState.filters.propertyTypes,
            minPrice: currentState.filters.minPrice,
            maxPrice: currentState.filters.maxPrice,
            sortBy: currentState.filters.sortBy,
          })
          
          console.log("✅ Smart pagination response received:", response)
          
          if (Array.isArray(response)) {
            // Old API format - just an array
            set({ 
              properties: response,
              pagination: null,
              currentPage: 1
            })
          } else {
            // New API format - has pagination info
            const { properties, pagination } = response
            
            if (properties && properties.length > 0) {
              // We have results on page 1, use it
              set({ 
                properties: properties,
                pagination: pagination,
                currentPage: 1
              })
            } else if (pagination && pagination.totalCount > 0) {
              // No results on page 1, but there are results somewhere
              // Use binary search to find the first page with results efficiently
              const totalPages = pagination.totalPages
              let left = 1
              let right = totalPages
              let foundPage = 1
              
              console.log(`🔍 Using binary search to find first page with results (total pages: ${totalPages})`)
              
              while (left <= right) {
                const mid = Math.floor((left + right) / 2)
                console.log(`🔍 Checking page ${mid} for results...`)
                
                const pageResponse = await getAllProperties(brokerId, {
                  page: mid,
                  limit: 12,
                  searchQuery: currentState.filters.searchQuery,
                  statuses: currentState.filters.statuses,
                  propertyTypes: currentState.filters.propertyTypes,
                  minPrice: currentState.filters.minPrice,
                  maxPrice: currentState.filters.maxPrice,
                  sortBy: currentState.filters.sortBy,
                })
                
                const hasResults = Array.isArray(pageResponse) 
                  ? pageResponse.length > 0 
                  : pageResponse.properties && pageResponse.properties.length > 0
                
                if (hasResults) {
                  foundPage = mid
                  right = mid - 1 // Search in the left half
                  
                  // Update the state with the found results
                  if (Array.isArray(pageResponse)) {
                    set({ 
                      properties: pageResponse,
                      pagination: { ...pagination, currentPage: mid },
                      currentPage: mid
                    })
                  } else {
                    set({ 
                      properties: pageResponse.properties,
                      pagination: { ...pageResponse.pagination, currentPage: mid },
                      currentPage: mid
                    })
                  }
                } else {
                  left = mid + 1 // Search in the right half
                }
              }
              
              console.log(`✅ Found first page with results: ${foundPage}`)
            } else {
              // No results at all
              set({ 
                properties: [],
                pagination: pagination,
                currentPage: 1
              })
            }
          }
          
          console.log("✅ Smart pagination completed successfully!")
          
        } catch (error: any) {
          console.log("❌ Error in smart pagination:", error)
          set({ error: error?.message || "Failed to load properties" })
        } finally {
          set({ loading: false })
        }
      },

      // ===== FILTER FUNCTIONS =====
      // These functions update the filter settings
      
      // Update search text
      setSearchQuery: (searchText) => {
        console.log("🔍 Setting search query:", searchText)
  
        set((currentState) => ({ 
          filters: { ...currentState.filters, searchQuery: searchText }
          // Don't reset page here - let smart pagination handle it
        }))
      },
      
      // Toggle status filter (add/remove from array)
      toggleStatus: (status) => {
        console.log("🏷️ Toggling status:", status)
        set((currentState) => {
          const currentStatuses = currentState.filters.statuses
          const isAlreadySelected = currentStatuses.includes(status)
          
          let newStatuses
          if (isAlreadySelected) {
            // Remove it from the array
            newStatuses = currentStatuses.filter((s) => s !== status)
            console.log("➖ Removed status:", status)
          } else {
            // Add it to the array
            newStatuses = [...currentStatuses, status]
            console.log("➕ Added status:", status)
          }
          
          return { 
            filters: { ...currentState.filters, statuses: newStatuses }
            // Don't reset page here - let smart pagination handle it
          }
        })
      },
      
      // Toggle property type filter (add/remove from array)
      togglePropertyType: (type) => {
        console.log("🏠 Toggling property type:", type)
        set((currentState) => {
          const currentTypes = currentState.filters.propertyTypes
          const isAlreadySelected = currentTypes.includes(type)
          
          let newTypes
          if (isAlreadySelected) {
            // Remove it from the array
            newTypes = currentTypes.filter((t) => t !== type)
            console.log("➖ Removed property type:", type)
          } else {
            // Add it to the array
            newTypes = [...currentTypes, type]
            console.log("➕ Added property type:", type)
          }
          
          return { 
            filters: { ...currentState.filters, propertyTypes: newTypes }
            // Don't reset page here - let smart pagination handle it
          }
        })
      },
      
      // Set price range filter
      setPriceRange: (minPrice, maxPrice) => {
        console.log("💰 Setting price range:", { minPrice, maxPrice })
        set((currentState) => ({ 
          filters: { 
            ...currentState.filters, 
            minPrice: minPrice, 
            maxPrice: maxPrice 
          }
          // Don't reset page here - let smart pagination handle it
        }))
      },
      
      // Clear all filters
      clearFilters: () => {
        console.log("🧹 Clearing all filters")
        set((currentState) => ({
          filters: { 
            ...currentState.filters, 
            searchQuery: "", 
            statuses: [], 
            propertyTypes: [], 
            minPrice: null, 
            maxPrice: null 
          }
          // Don't reset page here - let smart pagination handle it
        }))
      },

      
      // Set sorting option
      setSortBy: (sortOption) => {
        console.log("📊 Setting sort by:", sortOption)
        set((currentState) => ({ 
          filters: { ...currentState.filters, sortBy: sortOption }
          // Don't reset page here - let smart pagination handle it
        }))
      },
      // ===== PAGINATION FUNCTION =====
      setCurrentPage: (page, brokerId) => {
        console.log("📄 Setting current page to:", page)
        set({ currentPage: page })
        
        // Load data for the new page
        if (brokerId) {
          console.log("🔄 Fetching data for page:", page)
          get().fetchProperties(brokerId, page)
        }
      },
      
      // ===== FAVORITES FUNCTION =====
      toggleFavorite: (propertyId) => {
        console.log("❤️ Toggling favorite for property:", propertyId)
        set((currentState) => {
          const currentFavorites = currentState.favorites
          const newFavorites = new Set(currentFavorites) // Create a copy
          
          if (newFavorites.has(propertyId)) {
            // Remove from favorites
            newFavorites.delete(propertyId)
            console.log("➖ Removed from favorites")
          } else {
            // Add to favorites
            newFavorites.add(propertyId)
            console.log("➕ Added to favorites")
          }
          
          return { favorites: newFavorites }
        })
      },
      
      // ===== REMOVE PROPERTY FUNCTION =====
      removeProperty: async (propertyId, brokerId) => {
        console.log("🗑️ Removing property:", propertyId)
             
        await deletePropertyById(propertyId,brokerId)
        set((currentState) => ({
          properties: currentState.properties.filter((property) => property._id !== propertyId)
        }))
      },
    }),
    
    // ===== LOCAL STORAGE CONFIGURATION =====
    // This part saves some data to browser's localStorage so it persists when user refreshes
    {
      name: "properties-store", // Key name in localStorage
      
      // What data to save to localStorage
      partialize: (state) => ({
        favorites: Array.from(state.favorites), // Convert Set to Array for storage
        filters: state.filters,                 // Save filter settings
      }),
      
      // What happens when loading data from localStorage
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray((state as any).favorites)) {
          // Convert Array back to Set when loading from storage
          (state as any).favorites = new Set((state as any).favorites)
        }
      },
    },
  ),
)
