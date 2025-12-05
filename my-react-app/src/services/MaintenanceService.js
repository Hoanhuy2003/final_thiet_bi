// src/services/baoTriService.js
import axios from '../api/axiosInstance';

const BAO_TRI_API = '/api/bao_tri';

export const getAllBaoTri = async () => {
  const response = await axios.get(BAO_TRI_API);
  return response.data; // List<BaoTriResponse>
};

export const getBaoTriById = async (maBT) => {
  const response = await axios.get(`${BAO_TRI_API}/${maBT}`);
  return response.data;
};