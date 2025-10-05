// lib/api/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiRequest = async (endpoint: string, method: string = 'GET', data: any = null) => {
  try {
    const response = await apiClient({
      url: endpoint,
      method,
      data,
    });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.message || 'Something went wrong!');
  }
};
