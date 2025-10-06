// lib/api/types.ts

export interface BrokerData {
  id: string;
  clientName: string;
  propertyType: string;
  location: string;
  price: number;
  status: 'active' | 'pending' | 'closed';
  notes?: string;
  createdAt: string;
}
