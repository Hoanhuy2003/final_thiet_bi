// src/services/lichSuService.js
import axios from '../api/axiosInstance';

const LICH_SU_API = '/api/lich_su';

export const getAllLichSu = async () => {
  const response = await axios.get(LICH_SU_API);
  return response.data; // List<LichSuTBResponse>
};

export const createLichSu = async (data) => {
  const response = await axios.post(LICH_SU_API, data);
  return response.data;
};