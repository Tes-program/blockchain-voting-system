/* eslint-disable @typescript-eslint/no-explicit-any */
// Updated src/services/voteService.ts
import api from './api';

export const castVote = async (voteData: any) => {
  try {
    const response = await api.post('/votes', voteData);
    return response.data;
  } catch (error) {
    console.error('Failed to cast vote:', error);
    throw error;
  }
};

export const getVoteReceipt = async (receiptId: string) => {
  try {
    const response = await api.get(`/votes/${receiptId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get vote receipt with ID ${receiptId}:`, error);
    throw error;
  }
};

export const verifyVote = async (receiptId: string) => {
  try {
    const response = await api.get(`/votes/verify/${receiptId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to verify vote with receipt ID ${receiptId}:`, error);
    throw error;
  }
};