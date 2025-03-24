/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/electionService.js
import api from "./api";

export const getAllElections = async (params = {}) => {
  const response = await api.get("/elections", { params });
  return response.data;
};

export const getElectionById = async (id: string) => {
  const response = await api.get(`/elections/${id}`);
  return response.data;
};

export const createElection = async (electionData: any) => {
  const response = await api.post("/elections", electionData);
  return response.data;
};

export const updateElection = async (id: string, updateData: any) => {
  const response = await api.put(`/elections/${id}`, updateData);
  return response.data;
};

export const deleteElection = async (id: string) => {
  const response = await api.delete(`/elections/${id}`);
  return response.data;
};
