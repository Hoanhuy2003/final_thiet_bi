// src/services/phongService.js
import axios from '../api/axiosInstance';

const PHONG_API = '/api/phong';

export const getAllPhong = async () => {
  const response = await axios.get(PHONG_API);
  return response.data; // List<PhongHocResponse>
};

export const getPhongById = async (maPhong) => {
  const response = await axios.get(`${PHONG_API}/${maPhong}`);
  return response.data;
};

export const deletePhong = async (maPhong) => {
  await axios.delete(`${PHONG_API}/${maPhong}`);
};