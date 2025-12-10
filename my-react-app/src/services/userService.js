import axiosInstance from '../api/axiosInstance';


export const getMyInfo = async () => {
  const res = await axiosInstance.get('/api/nguoi_dung/myInfo');
  return res.data.result;
};


export const getAllUsers = async (page = 0, size = 10, search = '', filters = {}) => {
  
  const params = { 
    page, 
    size,
    search: search || undefined, 
    ...filters
  };

  const response = await axiosInstance.get('/api/nguoi_dung', { params });
  const result = response.data.result;

  return {
    data: result.content || [],
    totalPages: result.totalPages || 1,
    totalElements: result.totalElements || 0,
    currentPage: result.number || 0,
  };
};


export const getAllList = async () => {
  try {
    
    const res = await axiosInstance.get('/api/nguoi_dung/list'); 
  
    const data = res.data?.result || res.data;
    
    // Nếu trả về dạng Page (có content), lấy content. Nếu là Array, lấy luôn.
    if (data && Array.isArray(data.content)) {
        return data.content;
    } else if (Array.isArray(data)) {
        return data;
    }
    return [];
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng cho select:", error);
    return [];
  }
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
    ten_nd: currentUser.hoTen, 
    email: currentUser.email,
    so_dien_thoai: currentUser.soDienThoai || "",
    ten_dang_nhap: currentUser.tenDangNhap || currentUser.username,
    ma_don_vi: currentUser.donVi?.maDonVi || null,
    ma_vai_tro: currentUser.maVaiTro?.maVaiTro || null,
    trang_thai: newStatus 
  };

  return axiosInstance.put(`/api/nguoi_dung/${currentUser.maNguoiDung}`, payload);
};

const userService = {
  getMyInfo,
  getAllUsers,
  getAllList, 
  deleteUser,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus 
};

export default userService;