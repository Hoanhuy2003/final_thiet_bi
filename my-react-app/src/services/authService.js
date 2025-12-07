import axiosInstance from '../api/axiosInstance';
const TOKEN_KEY = 'token';

// ==================== 1. HELPERS & EVENT ====================
const dispatchAuthChange = () => {
    window.dispatchEvent(new Event('authChange'));
};

export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    dispatchAuthChange();
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    dispatchAuthChange();
};

// Hàm giải mã JWT an toàn (Dùng chung cho cả getUserId và getUserRole)
const decodeTokenPayload = (token) => {
    try {
        const payloadBase64 = token.split('.')[1];
        
        // Fix Base64URL: Chuyển đổi ký tự URL-safe sang Base64 chuẩn
        let base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        
        // Thêm padding (Nếu cần)
        while (base64.length % 4) {
            base64 += '=';
        }
        
        // Decode
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
        
    } catch (error) {
        console.error("Lỗi giải mã token:", error);
        return null;
    }
}

// ==================== 2. HÀM LẤY ID VÀ ROLE TỪ TOKEN ====================

// HÀM MỚI: Lấy mã người dùng (ID)
export const getUserId = () => {
    const token = getToken();
    if (!token) return null;
    
    const payload = decodeTokenPayload(token);
    return payload ? payload.maND : null; 
};


// HÀM CŨ: Lấy role
export const getUserRole = () => {
    const token = getToken();
    if (!token) return null;

    const payload = decodeTokenPayload(token);
    if (!payload) return null;
    
    const scope = payload.scope || "";
    // Cắt bỏ prefix ROLE_
    return scope.replace("ROLE_", "");
};

// ==================== 3. KIỂM TRA ĐĂNG NHẬP ====================
export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    const payload = decodeTokenPayload(token);

    if (payload) {
        const exp = payload.exp * 1000;
        if (Date.now() >= exp) {
            removeToken();
            return false;
        }
        return true;
    } else {
        // Token lỗi định dạng
        removeToken();
        return false;
    }
};

// ==================== 4. API (LOGIN / REGISTER / LOGOUT) ====================
// ... (Các hàm này giữ nguyên logic gọi API) ...
export const login = async (userName, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', { userName, password });
        const token = response.data.result?.token || response.data?.token;
        if (!token) throw new Error('Lỗi: Server không trả về token');

        saveToken(token);
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const register = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    } catch (err) {
        throw err.response?.data || err;
    }
};

export const logout = async () => {
    try {
        const token = getToken();
        if (token) {
            await axiosInstance.post('/auth/logout', { token });
        }
    } catch (err) {
        console.warn(err);
    } finally {
        removeToken();
        window.location.href = '/login';
    }
};