// lib/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BrokerData } from '@/lib/api/types';

interface AuthUser {
  id: string;
  token: string;
  role: 'broker' | 'admin' | 'user';
}

interface Store {
    userId: string | null;
    userToken: string;
    isAuthenticated: boolean;
    user: AuthUser | null;
    isLoading: boolean;

    properties: BrokerData[];
    filteredProperties: BrokerData[];
    favorites: Set<string>;
    searchQuery: string;
    sortBy: string;

    // Auth Actions
    login: (userData: AuthUser) => void;
    logout: () => void;
    checkAuth: () => boolean;
    setUserId: (userId: string) => void;
    setUserToken: (userToken: string) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    
    // Data Actions
    setProperties: (data: BrokerData[]) => void;
    setFilteredProperties: (data: BrokerData[]) => void;
    toggleFavorite: (id: string) => void;
    setSearchQuery: (query: string) => void;
    setSortBy: (sort: string) => void;
    removeProperty: (id: string) => void;
}

const useUserStore = create<Store>()(
  persist(
    (set, get) => ({
      // State
      userId: null,
      userToken: '',
      isAuthenticated: false,
      user: null,
      isLoading: false,
      properties: [],
      filteredProperties: [],
      favorites: new Set(),
      searchQuery: '',
      sortBy: 'recent',

      // Auth Actions
      login: (userData) => {
        set({ 
          user: userData,
          userId: userData.id,
          userToken: userData.token,
          isAuthenticated: true
        });
      },

      logout: () => {
        set({ 
          user: null,
          userId: null, 
          userToken: '', 
          isAuthenticated: false,
          properties: [],
          filteredProperties: []
        });
      },

      checkAuth: () => {
        const { isAuthenticated, userToken } = get();
        return isAuthenticated && !!userToken;
      },

      setUserId: (userId) => set({ userId }),
      setUserToken: (userToken) => set({ userToken }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setIsLoading: (isLoading) => set({ isLoading }),

      // Data Actions
      setProperties: (data) => set({ properties: data }),
      setFilteredProperties: (data) => set({ filteredProperties: data }),
      toggleFavorite: (id) => {
        const newFavorites = new Set(get().favorites);
        if (newFavorites.has(id)) newFavorites.delete(id);
        else newFavorites.add(id);
        set({ favorites: newFavorites });
      },
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sort) => set({ sortBy: sort }),
      removeProperty: (id) => set({
        properties: get().properties.filter((item) => item._id !== id),
        filteredProperties: get().filteredProperties.filter((item) => item._id !== id),
      }),
    }),
    {
      name: 'broker-app-storage',
      partialize: (state) => ({
        user: state.user,
        userId: state.userId,
        userToken: state.userToken,
        isAuthenticated: state.isAuthenticated,
        favorites: Array.from(state.favorites)
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert favorites array back to Set
          if (Array.isArray(state.favorites)) {
            state.favorites = new Set(state.favorites);
          }
        }
      }
    }
  )
);

export default useUserStore;
