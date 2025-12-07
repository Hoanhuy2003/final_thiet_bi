// src/services/roomService.js
import axiosInstance from "../api/axiosInstance";

const API = "/api/phong";

const roomService = {
  getAll: async () => {
    const res = await axiosInstance.get(API);
    return res.data;
  },
};

export default roomService;