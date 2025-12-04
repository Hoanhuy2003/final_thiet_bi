// src/services/thanhLyService.js
import axios from '../api/axiosInstance';

const THANH_LY_API = '/api/thanh_ly';

export const getAllThanhLy = async () => {
  const response = await axios.get(THANH_LY_API);
  return response.data;
};

export const getThanhLyById = async (maTL) => {
  const response = await axios.get(`${THANH_LY_API}/${maTL}`);
  return response.data;
};