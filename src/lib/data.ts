// lib/data.ts
import type { BrokerData } from "@/lib/api/types";

// Mock data
const demoData: BrokerData[] = [
  {
    id: "1",
    clientName: "Alice",
    propertyType: "Residential",
    location: "New York",
    price: 500000,
    status: "active",
    notes: "Near park",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    clientName: "Bob",
    propertyType: "Commercial",
    location: "San Francisco",
    price: 1200000,
    status: "pending",
    notes: "City center",
    createdAt: new Date().toISOString(),
  },
];

export const getUserData = (userId: string): BrokerData[] => {
  // In future, fetch from API using userId
  return demoData;
};

export const deleteData = (id: string) => {
  const index = demoData.findIndex((item) => item.id === id);
  if (index !== -1) demoData.splice(index, 1);
};


export type { BrokerData };
