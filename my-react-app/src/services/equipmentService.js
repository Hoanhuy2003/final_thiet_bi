import axiosInstance from "../api/axiosInstance";

const API = "/api/thiet_bi";

export const equipmentService = {
  getAll: async (params) => {
    const res = await axiosInstance.get(API, { params: params });
    return res.data;
  },
  getAllAsList: async () => {
    const res = await axiosInstance.get(`${API}/list`);
    return res.data;
  },
  getById: async (maTB) => {
    const res = await axiosInstance.get(`${API}/${maTB}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosInstance.post(API, data);
    return res.data;
  },

  update: async (maTB, data) => {
    const res = await axiosInstance.put(`${API}/${maTB}`, data);
    return res.data;
  },

  delete: async (maTB) => {
    await axiosInstance.delete(`${API}/${maTB}`);
  },

exportExcel: async () => { 
    try {
      // Đổi API_URL thành API cho khớp với khai báo ở trên
      const response = await axiosInstance.get(`${API}/export`, { 
        responseType: 'blob' 
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};