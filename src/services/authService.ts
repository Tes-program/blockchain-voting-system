/* eslint-disable @typescript-eslint/no-explicit-any */
// Updated src/services/authService.ts
import api from './api';

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/user');
    return response.data;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const verifyWeb3Auth = async (walletAddress: string) => {
  try {
    const response = await api.post('/auth/verify', { walletAddress });
    return response.data;
  } catch (error) {
    console.error('Web3 verification failed:', error);
    throw error;
  }
};