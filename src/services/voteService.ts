/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/voteService.js
import api from './api';

export const castVote = async (voteData: any) => {
    const response = await api.post('/votes', voteData);
    return response.data;
};

export const getVoteReceipt = async (receiptId: string) => {
    const response = await api.get(`/votes/${receiptId}`);
    return response.data;
};