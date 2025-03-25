/* eslint-disable @typescript-eslint/no-explicit-any */
// Updated src/services/electionService.ts
import api from "./api";

export const getAllElections = async (params = {}) => {
  try {
    const response = await api.get("/elections", { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch elections:', error);
    throw error;
  }
};

export const getElectionById = async (id: string) => {
  try {
    const response = await api.get(`/elections/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch election with ID ${id}:`, error);
    throw error;
  }
};

export const createElection = async (electionData: any) => {
  try {
    const response = await api.post("/elections", electionData);
    return response.data;
  } catch (error) {
    console.error('Failed to create election:', error);
    throw error;
  }
};

export const updateElection = async (id: string, updateData: any) => {
  try {
    const response = await api.put(`/elections/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update election with ID ${id}:`, error);
    throw error;
  }
};

export const deleteElection = async (id: string) => {
  try {
    const response = await api.delete(`/elections/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete election with ID ${id}:`, error);
    throw error;
  }
};

export const getElectionResults = async (id: string) => {
  try {
    const response = await api.get(`/results/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch results for election with ID ${id}:`, error);
    throw error;
  }
};