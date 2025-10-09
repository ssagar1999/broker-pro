// lib/store/userStore.ts
import { create } from 'zustand';

import type { BrokerData } from '@/lib/api/types';


interface Store {
    userId: string | null;
    userToken: string;
    isAuthenticated: boolean;

    properties: BrokerData[];
    filteredProperties: BrokerData[];
    favorites: Set<string>;
    searchQuery: string;
    sortBy: string;
    isLoading: boolean;

    // Actions

    setUserId: (userId: string) => void;
    setUserToken: (userToken: string) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setProperties: (data: BrokerData[]) => void;
    setFilteredProperties: (data: BrokerData[]) => void;
    toggleFavorite: (id: string) => void;
    setSearchQuery: (query: string) => void;
    setSortBy: (sort: string) => void;
    removeProperty: (id: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    
}

const useUserStore = create<Store>((set, get) => ({

    properties: [],
    filteredProperties: [],
    favorites: new Set(),
    searchQuery: '',
    sortBy: 'recent',
    isLoading: false,

    // Action to set the userId
  userId: typeof window !== 'undefined' ? localStorage.getItem('userId'): '',  // Initial userId value
  userToken: '',  // Initial userToken value
  isAuthenticated: typeof window !== 'undefined' ? localStorage.getItem('isAuthenticated') === 'true' : false,  // Initial auth status from localStorage    

  // Setters
   setUserId: (userId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', userId);  // Store in localStorage
    }
    set({ userId });
  },
  setUserToken: (userToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userToken', userToken);  // Store in localStorage
    }
    set({ userToken });
  },
  setIsAuthenticated: (isAuthenticated: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', String(isAuthenticated));  // Store in localStorage
    }
    set({ isAuthenticated });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userId');
      localStorage.removeItem('userToken');
      localStorage.removeItem('isAuthenticated');
    }
    set({ userId: '', userToken: '', isAuthenticated: false });
  },

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
    setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useUserStore;
