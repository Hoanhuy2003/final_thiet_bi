// src/services/kiemKeService.js
import axios from '../api/axiosInstance';

const KIEM_KE_API = '/api/kiem_ke';

export const getAllKiemKe = async () => {
  const response = await axios.get(KIEM_KE_API);
  return response.data; // List<KiemKeResponse>
};

export const getKiemKeById = async (maKK) => {
  const response = await axios.get(`${KIEM_KE_API}/${maKK}`);
  return response.data;
};