// lib/store/userStore.ts
import { create } from 'zustand';

import type { BrokerData } from '@/lib/api/types';
import { apiRequest } from '@/lib/api/api';

interface Store {
    userId: string;
    userToken: string;
    isAuthenticated: boolean;

    properties: BrokerData[];
    filteredProperties: BrokerData[];
    favorites: Set<string>;
    searchQuery: string;
    sortBy: string;

    // Actions


    setUserToken: (userToken: string) => void;
    setProperties: (data: BrokerData[]) => void;
    setFilteredProperties: (data: BrokerData[]) => void;
    toggleFavorite: (id: string) => void;
    setSearchQuery: (query: string) => void;
    setSortBy: (sort: string) => void;
    removeProperty: (id: string) => void;
      checkAuth: () => Promise<void>;
}

const useUserStore = create<Store>((set, get) => ({

    properties: [],
    filteredProperties: [],
    favorites: new Set(),
    searchQuery: '',
    sortBy: 'recent',

    // Action to set the userId
  userId: '',  // Initial userId value
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
   checkAuth: async () => {
    try {
      const data = await apiRequest('/auth/me', 'GET'); // backend route to verify JWT
      set({  userId: data.id, userToken: data.token, isAuthenticated: true });
    } catch {
      set({  isAuthenticated: false });
    }
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
        properties: get().properties.filter((item) => item.id !== id),
        filteredProperties: get().filteredProperties.filter((item) => item.id !== id),
    }),
}));

export default useUserStore;
