// src/services/equipmentService.js
import axiosInstance from "../api/axiosInstance";

const API = "/api/thiet_bi";

export const equipmentService = {
  getAll: async () => {
    const res = await axiosInstance.get(API);
    return res.data;
  },

  getById: async (maTB) => {
    const res = await axiosInstance.get(`${API}/${maTB}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosInstance.post(API, data);
    return res.data;
  },

  update: async (maTB, data) => {
    const res = await axiosInstance.put(`${API}/${maTB}`, data);
    return res.data;
  },

  delete: async (maTB) => {
    await axiosInstance.delete(`${API}/${maTB}`);
  },
};