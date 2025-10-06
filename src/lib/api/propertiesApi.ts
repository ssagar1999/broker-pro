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
    furnishing: string,
    pincode: string,
    price: number,
    status: "active" | "pending" | "closed",
    notes: string
}) => {
    return apiRequest('/properties/add', 'POST', propertyData);
};

export const getAllProperties = async () => {
    return apiRequest('/properties', 'GET');
};
