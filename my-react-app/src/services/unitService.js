// src/services/unitService.js
import axiosInstance from '../api/axiosInstance';

export const getAllUnits = async () => {
  const res = await axiosInstance.get('/api/don_vi');
  return res.data || [];
};

export const getUnitById = async (maDonVi) => {
  const res = await axiosInstance.get(`/api/don_vi/${maDonVi}`);
  return res.data;
};

export const createUnit = async (data) => {
  return axiosInstance.post('/api/don_vi', data);
};

export const updateUnit = async (maDonVi, data) => {
  return axiosInstance.put(`/api/don_vi/${maDonVi}`, data);
};

export const deleteUnit = async (maDonVi) => {
  return axiosInstance.delete(`/api/don_vi/${maDonVi}`);
};

const unitService = {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
};

export default unitService;
