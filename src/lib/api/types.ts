// lib/api/types.ts

export interface BrokerData {
  _id: string;
  clientName: string;
  propertyType: string;
  location: {
    address: string; district: string; locality: string; landmark: string
  };
  price: number;
  isActive: 'active' | 'pending' | 'closed';
  owner:{ name: string; contact: string};
  rooms: string;
  area: number;
  floors: number;
  furnishing: string;
  images: string[];
  pincode: string;
  notes?: string;
  createdAt: string;
}
