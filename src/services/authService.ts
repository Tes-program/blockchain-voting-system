/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/authService.js
import api from './api';

export const getCurrentUser = async () => {
  const response = await api.get('/auth/user');
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const verifyWeb3Auth = async (walletAddress: any) => {
  const response = await api.post('/auth/verify', { walletAddress });
  return response.data;
};