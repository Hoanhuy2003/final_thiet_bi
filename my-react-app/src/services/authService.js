
import axiosInstance from '../api/axiosInstance';
const TOKEN_KEY = 'token';

// ==================== Helper: Dispatch event khi auth thay đổi ====================
const dispatchAuthChange = () => {
  window.dispatchEvent(new Event('authChange'));
};

// ==================== Các hàm tập trung ====================
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  dispatchAuthChange();
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  dispatchAuthChange();
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

// ==================== Kiểm tra đăng nhập + kiểm tra hết hạn ====================
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;

    if (Date.now() >= exp) {
      console.warn('Token đã hết hạn → tự động logout');
      removeToken();
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Token lỗi định dạng → xóa luôn');
    removeToken();
    return false;
  }
};

// ==================== LOGIN ====================
export const login = async (userName, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { userName, password });
    const token = response.data.result?.token || response.data?.token;

    if (!token) throw new Error('Không nhận được token từ server');

    saveToken(token);
    return response.data;
  } catch (err) {
    console.error('Login failed:', err);
    throw err;
  }
};

// ==================== REGISTER (THÊM MỚI - SIÊU ĐẸP) ====================
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);

    // Một số backend trả token luôn khi đăng ký → lưu luôn
    const token = response.data.result?.token || response.data?.token;
    if (token) {
      saveToken(token);
    }

    return response.data;
  } catch (err) {
    console.error('Register failed:', err);
    // Ném lỗi ra để component bắt và hiển thị
    throw err.response?.data || err;
  }
};

// ==================== LOGOUT ====================
export const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (err) {
    console.warn('Gọi logout backend thất bại:', err);
  } finally {
    removeToken();
    window.location.href = '/login';
  }
};