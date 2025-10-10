// lib/api/types.ts

export interface Property {
  _id: string;
  brokerId: string;

  title: string;
  description: string;
  propertyType:
    | 'house'
    | 'apartment'
    | 'office'
    | 'shop'
    | 'land'
    | 'warehouse'
    | 'other'
    | 'pg'
    | 'hostel'
    | 'farmhouse'
    | 'villa'
    | 'duplex'
    | 'studio'
    | 'penthouse'
    | 'residential plot'
    | 'commercial plot';

  rooms: '1RK' | '2RK' | '3RK' | '1BHK' | '2BHK' | '4BHK' | '3BHK';
  category: 'rent' | 'sale' | 'lease';
  status: 'available' | 'booked' | 'unavailable';

  location: {
    city: string;
    address: string;
    district: string;
    locality?: string;
    landmark?: string;
    coordinates?: [number, number]; // [longitude, latitude]
  };

  area: number;
  floors: number;
  furnishing: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

  owner: {
    name: string;
    phoneNumber?: string;
    email?: string;
  };

  price: number;
  images: string[];

  meta: {
    views: number;
    favorites: number;
    verified: boolean;
    tags: string[];
    createdBy: string;
    notes?: string;
  };

  extra?: Record<string, any>;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
