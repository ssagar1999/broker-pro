// lib/api/usersApi.ts
import { apiRequest } from "./api";

export const registerUser = async (userData: { username: string; email: string; phoneNumber: string; password: string, confirmPassword: string }) => {
  return apiRequest('/users/register', 'POST', userData);
};


export const loginUser = async (credentials: { emailOrphone: string; password: string }) => {
  return apiRequest('/users/login', 'POST', credentials);
};

export const getUserData = async (userId: string) => {
  return apiRequest(`/users/${userId}`, 'GET');
};




