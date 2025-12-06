// src/services/thanhLyService.js
import axios from "../api/axiosInstance";

const API = "/api/thanh_ly";

const thanhLyService = {
  // Lấy danh sách tất cả phiếu thanh lý
  getAll: async () => {
    const response = await axios.get(API);
    return response.data;
  },

  // Lấy chi tiết 1 phiếu theo mã
  getByMa: async (ma) => {
    const response = await axios.get(`${API}/${ma}`);
    return response.data;
  },

  // Tạo phiếu thanh lý mới
  create: async (data) => {
    const response = await axios.post(API, data);
    return response.data;
  },

  // Cập nhật phiếu (chỉ khi chưa duyệt)
  update: async (ma, data) => {
    const response = await axios.put(`${API}/${ma}`, data);
    return response.data;
  },

  duyetPhieu: async (maPhieu, maNguoiDuyet) => {
    const response = await axios.patch(`${API}/${maPhieu}/duyet`, null, {
      params: { maNguoiDuyet }
    });
    return response.data;
  },

  tuChoiPhieu: async (maPhieu, maNguoiDuyet, lyDoTuChoi = "Không phù hợp chính sách") => {
    const response = await axios.patch(`${API}/${maPhieu}/tuchoi`, null, {
      params: { maNguoiDuyet, lyDoTuChoi }
    });
    return response.data;
  },

  // Xóa phiếu
  delete: async (ma) => {
    await axios.delete(`${API}/${ma}`);
  },
};

export default thanhLyService;