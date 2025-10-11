// lib/api/propertiesApi.ts
import { apiRequest } from "./api";
import { Property } from "@/lib/api/types";

export const addProperty = async (propertyData: {
    brokerId: string;
    propertyType: string;
    address: string;
    ownerName: string;
    ownerContact: string;
    rooms: string;
    district: string;
    locality: string,
    landmark: string,
    area: number,
    floors: number,
    images: string[],
    furnishing: string,
    pincode: string,
    price: number,
    status: "available" | "booked" | "unavailable",
    notes: string
}) => {
    return apiRequest('/properties/add', 'POST', propertyData);
};


export const getAllProperties = async (
  brokerId: string | null,
  options: {
    page?: number;
    limit?: number;
    searchQuery?: string;
    statuses?: string[];
    propertyTypes?: string[];
    minPrice?: number | null;
    maxPrice?: number | null;
    sortBy?: string;
  } = {}
) => {
  return apiRequest('/properties/getProperties', 'POST', { 
    brokerId,
    ...options
  });
};

export const getPropertyById = async (brokerId: string | null, propertyId: string) => {
  return apiRequest('/properties/getPropertyById', 'POST', { brokerId, propertyId });
};

export const updatePropertyById = async (brokerId: string , propertyId: string, propertyData:{
    brokerId: string;
    propertyType: string;
    address: string;
    ownerName: string;
    ownerContact: string;
    rooms: string;
    district: string;
    locality: string,
    landmark: string,
    area: number,
    floors: number,
    images: string[],
    furnishing: string,
    pincode: string,
    price: number,
    status: "available" | "booked" | "unavailable",
    notes: string
} ) => {
  return apiRequest('/properties/updatePropertyById', 'POST', { brokerId, propertyId, propertyData });
};


