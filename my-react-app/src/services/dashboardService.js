// src/services/dashboardService.js
import axiosInstance from "../api/axiosInstance";

const dashboardService = {
  getDashboardData: async () => {
    const res = await axiosInstance.get("/api/dashboard");
    return res.data;
  },
};

export default dashboardService;