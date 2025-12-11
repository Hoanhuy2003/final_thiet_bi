// src/services/inventoryService.js
import axiosInstance from "../api/axiosInstance";

export const inventoryService = {
    
    // 1. GET ALL SESSIONS (Tải danh sách, xử lý phân trang từ Backend)
    getAllSessions: async (page = 0, size = 20) => {
        // Gọi API Backend: GET /api/kiem-ke?page=X&size=Y
        const response = await axiosInstance.get(`/api/kiem-ke?page=${page}&size=${size}`); 
        
        // Backend trả về Paged Object, ta trích xuất mảng content
        return response.data?.content || []; 
    },
    
    // 2. CREATE NEW SESSION (Tạo phiếu kiểm kê mới)
    // Input: DTO { maPhong, maNguoiKiemKe, ghiChu }
    createSession: async (dto) => {
        // Gọi API Backend: POST /api/kiem-ke/session
        const response = await axiosInstance.post("/api/kiem-ke/session", dto);
        
        // Trả về Entity KiemKe đã tạo (để Frontend lấy maKiemKe)
        return response.data; 
    },
    
    // 3. SUBMIT CHECKLIST (Hoàn thành kiểm kê và cập nhật tài sản)
    // Input: DTO { maKiemKe, maNguoiKiemKe, chiTiet: [...] }
    submitChecklist: async (dto) => {
        // Gọi API Backend: POST /api/kiem-ke/submit
        // Backend trả về message String hoặc 200 OK
        const response = await axiosInstance.post("/api/kiem-ke/submit", dto);
        return response.data; 
    },
    
    // 4. GET REPORT DETAIL (Xem báo cáo chi tiết của 1 phiếu)
    // Backend trả về DTO KiemKeResponse có thống kê đầy đủ
    getReportDetail: async (maKiemKe) => {
        // Gọi API Backend: GET /api/kiem-ke/{maKiemKe}
        const response = await axiosInstance.get(`/api/kiem-ke/${maKiemKe}`);
        return response.data;
    },

    getDevicesByRoom: async (maPhong) => {
        try {
            console.log("1. Gọi API lấy thiết bị cho phòng:", maPhong);
            
            const response = await axiosInstance.get(`/api/thiet_bi`, {
                params: { 
                    // --- SỬA Ở ĐÂY ---
                    // Backend nhận biến 'phong', nên Frontend phải gửi key là 'phong'
                    phong: maPhong,  
                    // ----------------
                    page: 0, 
                    size: 1000 
                }
            });
            
            console.log("2. Response API trả về:", response);

        
            if (response.data && Array.isArray(response.data.result?.content)) {
                return response.data.result.content;
            }
            if (response.data && Array.isArray(response.data.content)) {
                return response.data.content;
            } 
        
            
            return [];

        } catch (error) {
            console.error("Lỗi API getDevicesByRoom:", error);
            throw error; 
        }
    },

    
};