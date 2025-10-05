// lib/api/propertiesApi.ts
import { apiRequest } from "./api";

export const addProperty = async (propertyData: { clientName: string; propertyType: string; location: string; price: number }) => {
  return apiRequest('/properties/add', 'POST', propertyData);
};

export const getAllProperties = async () => {
  return apiRequest('/properties', 'GET');
};
