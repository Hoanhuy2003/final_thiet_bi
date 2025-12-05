import axiosInstance from '../api/axiosInstance';

export const getFaculties = () => axiosInstance.get('/api/donVi');