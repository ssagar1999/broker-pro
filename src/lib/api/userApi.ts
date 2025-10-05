// lib/api/usersApi.ts
import { apiRequest } from "./api";

export const registerUser = async (userData: { username: string; email: string; phoneNumber: string; password: string, confirmPassword: string }) => {
  return apiRequest('/users/register', 'POST', userData);
};

export const getUserData = async (userId: string) => {
  return apiRequest(`/users/${userId}`, 'GET');
};
