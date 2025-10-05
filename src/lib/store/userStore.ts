// lib/store/useStore.ts

import { create } from 'zustand';

interface User {
  username: string;
  email: string;
  phoneNumber: string;
}

interface Property {
  id: string;
  clientName: string;
  location: string;
  price: number;
}

interface AppState {
  user: User | null;
  properties: Property[];
  locations: string[];
  marketData: any;

  setUser: (userData: User) => void;
  setProperties: (properties: Property[]) => void;

}

const useStore = create<AppState>((set) => ({
  user: null,
  properties: [],
  locations: [],
  marketData: null,

  setUser: (userData) => set(() => ({ user: userData })),
  setProperties: (properties) => set(() => ({ properties })),
  setLocations: (locations) => set(() => ({ locations })),
  setMarketData: (data) => set(() => ({ marketData: data })),
}));

export default useStore;
