// lib/api/propertiesApi.ts
import { apiRequest } from "./api";

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

export const getAllProperties = async ({ brokerId }: { brokerId: string |null }) => {
  return apiRequest('/properties/getProperties', 'POST', { brokerId });
};
