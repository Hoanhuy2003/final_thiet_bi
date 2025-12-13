import axiosInstance from "../api/axiosInstance";

const API = "/api/thanh_ly";

const disposalService = {
  // 1. Lấy danh sách tất cả
  getAll: async () => {
    const response = await axiosInstance.get(API); 
    return response.data;
  },

  // 2. Lấy chi tiết
  getByMa: async (ma) => {
    const response = await axiosInstance.get(`${API}/${ma}`);
    return response.data;
  },

  // 3. Tạo mới
  create: async (data) => {
    const response = await axiosInstance.post(API, data);
    return response.data;
  },

  // 4. Cập nhật
  update: async (ma, data) => {
    const response = await axiosInstance.put(`${API}/${ma}`, data);
    return response.data;
  },

  // 5. DUYỆT (Dùng @RequestParam) -> URL sẽ là: .../duyet?maNguoiDuyet=...
  duyetPhieu: async (maPhieu, maNguoiDuyet) => {
    const response = await axiosInstance.patch(
      `${API}/${maPhieu}/duyet`, 
      null, // Body để null
      { 
        params: { maNguoiDuyet: maNguoiDuyet } // Config chứa params
      }
    );
    return response.data;
  },

  // 6. TỪ CHỐI (Dùng @RequestParam)
  tuChoiPhieu: async (maPhieu, maNguoiDuyet, lyDoTuChoi) => {
    const response = await axiosInstance.patch(
      `${API}/${maPhieu}/tuchoi`, 
      null, // Body để null
      {
        // QUAN TRỌNG: Phải dùng params để khớp với @RequestParam backend
        params: { 
            maNguoiDuyet: maNguoiDuyet,
            lyDoTuChoi: lyDoTuChoi 
        }
      }
    );
    return response.data;
  },

  // 7. Xóa
  delete: async (ma) => {
    await axiosInstance.delete(`${API}/${ma}`);
  },

  // 8. Xuất Excel Danh sách
  exportExcel: async () => {
    try {
      const response = await axiosInstance.get(`${API}/export`, {
        responseType: 'blob' 
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 9. Xuất Biên bản chi tiết
  exportBienBan: async (maPhieu) => {
    try {
      const response = await axiosInstance.get(`${API}/${maPhieu}/export-bien-ban`, {
        responseType: 'blob' 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default disposalService;