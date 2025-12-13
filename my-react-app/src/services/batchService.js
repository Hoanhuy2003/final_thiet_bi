import axiosInstance from "../api/axiosInstance";

const API_URL = "/api/lo_thiet_bi";

export const loThietBiService = {
  // Lấy tất cả lô thiết bị
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      // Giả sử backend trả về: { code: 1000, result: [...] }
      return response.data; 
    } catch (error) {
      throw error;
    }
  },
  create: async (data) => {
    try {
      // Gọi API POST để tạo lô mới
      const response = await axiosInstance.post(API_URL, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết theo ID
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getStats: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/stats`);
      return response.data; 
    } catch (error) {
      throw error;
    }
  },
  exportExcel: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/export`);
      return response.data; 
    } catch (error) {
      throw error;
    }
  }
  
};
