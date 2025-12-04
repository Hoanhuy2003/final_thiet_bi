import axiosInstance from '../api/axiosInstance';

export const getMyInfo = async () => {
  const res = await axiosInstance.get('/api/nguoi_dung/myInfo');
  return res.data.result;
};

export const getAllUsers = async (page = 0, size = 10, search = '') => {
  const params = { page, size };
  if (search?.trim()) params.search = search.trim();

  const response = await axiosInstance.get('/api/nguoi_dung', { params });
  const result = response.data.result;

  return {
    data: result.content || [],
    totalPages: result.totalPages || 1,
    totalElements: result.totalElements || 0,
    currentPage: result.number || 0,
  };
};

export const deleteUser = async (maNguoiDung) => {
  return axiosInstance.delete(`/api/nguoi_dung/${maNguoiDung}`);
};

export const getUserById = async (maNguoiDung) => {
  const res = await axiosInstance.get(`/api/nguoi_dung/${maNguoiDung}`);
  return res.data.result;
};

export const createUser = async (userData) => {
  return axiosInstance.post('/api/nguoi_dung', userData);
};

export const updateUser = async (maNguoiDung, userData) => {
  return axiosInstance.put(`/api/nguoi_dung/${maNguoiDung}`, userData);
};

// ---  XỬ LÝ ĐỔI TRẠNG THÁI ---
export const updateUserStatus = async (currentUser, newStatus) => {
  const payload = {
    // 1. Map dữ liệu cũ sang snake_case (để Backend không bị lỗi null)
    ten_nd: currentUser.hoTen, 
    email: currentUser.email,
    so_dien_thoai: currentUser.soDienThoai || "",
    ten_dang_nhap: currentUser.tenDangNhap || currentUser.username,
    
    // 2. Lấy ID từ object con (nếu có)
    ma_don_vi: currentUser.donVi?.maDonVi || null,
    ma_vai_tro: currentUser.maVaiTro?.maVaiTro || null,

    // 3. Đổi trạng thái
    trang_thai: newStatus 
  };

  return axiosInstance.put(`/api/nguoi_dung/${currentUser.maNguoiDung}`, payload);
};

const userService = {
  getMyInfo,
  getAllUsers,
  deleteUser,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus 
};

export default userService;