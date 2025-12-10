import axiosInstance from "../api/axiosInstance";

const API_URL = "/api/de_xuat_mua";

export const deXuatMuaService = {
  
  create: async (payload) => {
    try {
      const response = await axiosInstance.post(API_URL, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
  getAll: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/list`);
      return response.data; 
    } catch (error) {
      throw error;
    }
  },

  getAllPage: async (params) => {
    try {
      const response = await axiosInstance.get(API_URL, { params }); // <-- GỬI THAM SỐ
      return response.data; 
    } catch (error) {
      throw error;
    }
  },

  getById: async (ma) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${ma}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  approve: async (ma, maNguoiDuyet) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/${ma}/duyet`, 
        null, 
        { params: { maNguoiDuyet } } 
      );
      
      return response.data;
      
    } catch (error) {
      throw error;
    }
  },
  
  reject: async (maDeXuat, maNguoiDuyet) => {
    try {

      const response = await axiosInstance.patch(
        `${API_URL}/${maDeXuat}/tu_choi`, 
        null, 
        { params: { maNguoiDuyet } } 
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};