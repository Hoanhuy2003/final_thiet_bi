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

  // --- SỬA LẠI HÀM NÀY ---
  // Phải nhận tham số đầu vào để truyền xuống Backend
  getAll: async (page = 0, size = 10, search = null, trangThai = null, nguoiTao = null) => {
    try {
      const params = {
        page,
        size,
        search: search || null,
        trangThai: trangThai || null,
        
        // QUAN TRỌNG: Tham số này giúp lọc ra bài của user hiện tại
        nguoiTao: nguoiTao || null, 
        
        sortBy: 'ngayTao',
        sortDirection: 'DESC'
      };
      
      // Gọi vào root API (API_URL) chứ không phải /list
      const response = await axiosInstance.get(API_URL, { params });
      return response.data; 
    } catch (error) {
      throw error;
    }
  },

  // Hàm này giữ nguyên cũng được (Dành cho trang Admin nếu họ truyền object params)
  getAllPage: async (params) => {
    try {
      const response = await axiosInstance.get(API_URL, { params });
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
  
  reject: async (maDeXuat, maNguoiDuyet, lyDo) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/${maDeXuat}/tu_choi`, 
        null, 
        { 
            params: { 
                maNguoiDuyet: maNguoiDuyet,
                lyDo: lyDo // Gửi qua URL
            } 
        } 
      );
      return response.data;
    } catch (error) {
      throw error;
    }
},
exportExcel: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/export`);
      // Trả về data (chứa field .result là chuỗi Base64)
      return response.data ? response.data : response;
    } catch (error) {
      throw error;
    }
  },
  getAllForStats: async () => {
    try {
      // Backend đã tạo endpoint GET /api/de_xuat_mua/all để trả về List<T> không phân trang
      const response = await axiosInstance.get(`${API_URL}/list`);
      return response.data; 
    } catch (error) {
      throw error;
    }
  },
};