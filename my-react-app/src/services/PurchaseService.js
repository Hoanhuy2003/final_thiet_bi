// src/services/purchaseService.js
import axios from '../api/axiosInstance';

const PURCHASE_API = '/api/mua_moi';

export const getAllPurchases = async () => {
  const response = await axios.get(PURCHASE_API);
  return response.data;
};

export const getPurchaseById = async (maMua) => {
  const response = await axios.get(`${PURCHASE_API}/${maMua}`);
  return response.data;
};