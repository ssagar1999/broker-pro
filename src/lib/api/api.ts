// lib/api/api.ts
import axios from 'axios';

const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL +'api' || 'http://localhost:8000/api',
//   baseURL: 'http://localhost:8000/api',
     baseURL: 'http://51.20.80.203:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export const apiRequest = async (endpoint: string, method: string = 'GET', data: object) => {
    console.log(endpoint)
  try {
    const response = await apiClient({
      url: endpoint,
      method,
      data,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Something went wrong!');
    }
    throw new Error('Something went wrong!');
  }
};
