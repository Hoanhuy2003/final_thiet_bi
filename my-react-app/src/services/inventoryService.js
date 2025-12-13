// src/services/inventoryService.js
import axiosInstance from "../api/axiosInstance";

export const inventoryService = {
    
   getAllSessions: async (page = 0, size = 10, keyword = '', maPhong = '', trangThai = '') => {
        const params = {
            page,
            size,
            keyword: keyword || null,
            maPhong: maPhong || null,
            trangThai: trangThai || null
        };
        // Gọi vào root /api/kiem-ke (khớp với @GetMapping getAllKiemKeSessions)
        const response = await axiosInstance.get('/api/kiem-ke', { params }); 
        return response.data; 
    },
    
    // 2. CREATE (SỬA LẠI CHO KHỚP CONTROLLER CỦA BẠN)
    createSession: async (dto) => {
        // Controller của bạn là: @RequestMapping("/api/kiem-ke") + @PostMapping("/session")
        // => URL đầy đủ là: /api/kiem-ke/session
        const response = await axiosInstance.post("/api/kiem-ke/session", dto);
        return response.data; 
    },
    
    // 3. SUBMIT CHECKLIST
    submitChecklist: async (dto) => {
        const response = await axiosInstance.post("/api/kiem-ke/submit", dto);
        return response.data; 
    },
    
    // 4. GET REPORT DETAIL
    getReportDetail: async (maKiemKe) => {
        const response = await axiosInstance.get(`/api/kiem-ke/${maKiemKe}`);
        return response.data;
    },

    // 5. GET DEVICES BY ROOM
    getDevicesByRoom: async (maPhong) => {
        try {
            const response = await axiosInstance.get(`/api/thiet_bi`, {
                params: { 
                    phong: maPhong,  
                    page: 0, 
                    size: 1000 
                }
            });
            
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
    exportExcel: async () => {
    try {    
      const response = await axiosInstance.get(`/api/kiem-ke/export`);
      return response.data ? response.data : response;
    } catch (error) {
      throw error;
    }
  },
  exportReportExcel: async (maKiemKe) => {
    try {
      // API: GET /api/kiem_ke/{ma}/export-bien-ban
      const response = await axiosInstance.get(`/api/kiem-ke/${maKiemKe}/export-bien-ban`);
      
      return response.data ? response.data : response;
    } catch (error) {
      throw error;
    }
  }
};