import axiosInstance from "../api/axiosInstance";

const API_URL = "/api/de_xuat_mua";

export const deXuatMuaService = {
  
  // 1. Tạo đề xuất mới
  // POST /api/de_xuat_mua
  create: async (payload) => {
    try {
      const response = await axiosInstance.post(API_URL, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 2. Lấy danh sách tất cả đề xuất
  // GET /api/de_xuat_mua
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data; 
    } catch (error) {
      throw error;
    }
  },

  // 3. Lấy chi tiết đề xuất theo mã
  // GET /api/de_xuat_mua/{ma}
  getById: async (ma) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${ma}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 4. Duyệt đề xuất
  // PATCH /api/de_xuat_mua/{ma}/duyet?maNguoiDuyet=...
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
  
  // 5. TỪ CHỐI ĐỀ XUẤT (BỔ SUNG)
  // PATCH /api/de_xuat_mua/{ma}/tu-choi?maNguoiDuyet=...
  reject: async (maDeXuat, maNguoiDuyet) => {
    try {
      // Body là null vì đây là hành động State Transition
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