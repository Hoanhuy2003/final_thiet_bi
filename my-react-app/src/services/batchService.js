import axiosInstance from "../api/axiosInstance";

const API_URL = "/api/lo_thiet_bi";

export const batchService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      // Backend có thể trả về res.data hoặc res.data.result
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};