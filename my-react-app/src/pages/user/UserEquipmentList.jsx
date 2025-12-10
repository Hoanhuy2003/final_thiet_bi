import React, { useState, useEffect } from 'react';
import { Eye, Search, Filter, X, RefreshCcw, Layers } from 'lucide-react';
import { equipmentService } from '../../services/equipmentService';
import userService from '../../services/userService';
import axiosInstance from '../../api/axiosInstance'; 
import toast from "react-hot-toast";

const statusColors = {
  "Đang sử dụng": "bg-success text-white",
  "Sẵn sàng": "bg-primary text-white",
  "Bảo trì": "bg-warning text-dark",
  "Hỏng hóc": "bg-danger text-white",
  "Chờ thanh lý": "bg-secondary text-white",
  "Đã thanh lý": "bg-dark text-white",
};

const statusOptions = [
    { value: "Đang sử dụng", label: "Đang sử dụng" },
    { value: "Sẵn sàng", label: "Sẵn sàng" },
    { value: "Hỏng hóc", label: "Hỏng hóc" },
    { value: "Bảo trì", label: "Bảo trì" },
];

const UserEquipmentList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myUnitInfo, setMyUnitInfo] = useState({ id: null, name: "" });
  const [totalElements, setTotalElements] = useState(0);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [filters, setFilters] = useState({
      search: "",
      tinhTrang: "",
      maLoai: "" 
  });

  // 1. LẤY INFO & DANH MỤC
  useEffect(() => {
    const initData = async () => {
      try {
        const userInfo = await userService.getMyInfo();
        const donViObj = userInfo.donVi || userInfo.don_vi;
        if (donViObj) {
            setMyUnitInfo({
                id: donViObj.maDonVi || donViObj.ma_don_vi,
                name: donViObj.tenDonVi || donViObj.ten_don_vi
            });
        }

        const resLoai = await axiosInstance.get("/api/loai_thiet_bi");
        const listLoai = resLoai.data?.result || resLoai.data || [];
        setCategoryOptions(Array.isArray(listLoai) ? listLoai : []);

      } catch (error) {
        console.error("Lỗi khởi tạo:", error);
      }
    };
    initData();
  }, []);

  // 2. LẤY DANH SÁCH THIẾT BỊ
  useEffect(() => {
    const fetchEquipment = async () => {
        if (!myUnitInfo.id) return;

        setLoading(true);
        try {
            const params = {
                page: 0,
                size: 100,
                donVi: myUnitInfo.id,     
                search: filters.search,   
                tinhTrang: filters.tinhTrang || null, 
                loai: filters.maLoai || null  
            };

            const res = await equipmentService.getAll(params);
            
            const responseData = res.result || res.data || res;
            let dataArray = [];

            if (responseData && Array.isArray(responseData.content)) {
                dataArray = responseData.content;
                setTotalElements(responseData.totalElements);
            } else if (Array.isArray(responseData)) {
                dataArray = responseData;
                setTotalElements(responseData.length);
            }
            
            // Log kiểm tra dữ liệu nhận được để debug
            console.log("📦 Dữ liệu thiết bị nhận được:", dataArray);
            
            setList(dataArray);

        } catch (err) {
            console.error("Lỗi tải thiết bị:", err);
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    const timeoutId = setTimeout(() => {
        fetchEquipment();
    }, 300);

    return () => clearTimeout(timeoutId);

  }, [myUnitInfo.id, filters]);


  const handleFilterChange = (field, value) => {
      setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
      setFilters({ search: "", tinhTrang: "", maLoai: "" });
  };

  const openDetail = (item) => {
    localStorage.setItem("selectedEquipment", JSON.stringify(item));
    window.dispatchEvent(new Event("openDetailEquipmentModal"));
  };

  const formatDate = (d) => {
      if(!d) return "-";
      if(Array.isArray(d)) return `${d[2]}/${d[1]}/${d[0]}`;
      return new Date(d).toLocaleDateString('vi-VN');
  }

  return (
    <div className="card shadow-sm border-0">
      
      {/* HEADER + BỘ LỌC (Giữ nguyên như cũ) */}
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 text-primary fw-bold">
                Thiết bị tại: <span className="text-dark">{myUnitInfo.name || "..."}</span>
            </h5>
            <span className="badge bg-light text-dark border">Tổng: {totalElements}</span>
        </div>

        <div className="row g-2">
            <div className="col-md-4">
                <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light border-end-0"><Search size={16} className="text-muted"/></span>
                    <input 
                        type="text" className="form-control border-start-0 ps-0" placeholder="Tên, Mã, Serial..." 
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                </div>
            </div>
            <div className="col-md-3">
                <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light"><Layers size={16} className="text-muted"/></span>
                    <select className="form-select" value={filters.maLoai} onChange={(e) => handleFilterChange("maLoai", e.target.value)}>
                        <option value="">-- Tất cả loại --</option>
                        {categoryOptions.map(cat => (
                            <option key={cat.maLoai || cat.ma_loai} value={cat.maLoai || cat.ma_loai}>{cat.tenLoai || cat.ten_loai}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="col-md-3">
                <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light"><Filter size={16} className="text-muted"/></span>
                    <select className="form-select" value={filters.tinhTrang} onChange={(e) => handleFilterChange("tinhTrang", e.target.value)}>
                        <option value="">-- Tất cả trạng thái --</option>
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="col-md-2">
                {(filters.search || filters.tinhTrang || filters.maLoai) && (
                    <button className="btn btn-sm btn-outline-secondary w-100" onClick={handleReset}>
                        <X size={16} /> Xóa lọc
                    </button>
                )}
            </div>
        </div>
      </div>
      
      {/* BẢNG DỮ LIỆU */}
      <div className="card-body p-0">
        {loading ? (
            <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary"></div></div>
        ) : (
            <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                <thead className="bg-light text-secondary small text-uppercase">
                    <tr>
                    <th className="ps-4">Mã TB</th>
                    <th>Tên thiết bị</th>
                    <th>Loại</th> 
                    <th>Ngày SD</th> 
                    <th>Trạng thái</th>
                    <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(list) && list.length > 0 ? (
                        list.map((item) => (
                        <tr key={item.ma_tb || item.maTB}> 
                            
                            {/* 👇👇👇 SỬA ĐOẠN NÀY ĐỂ HIỂN THỊ AN TOÀN (FALLBACK) 👇👇👇 */}
                            
                            <td className="ps-4 fw-bold text-primary small">
                                {item.ma_tb || item.maTB}
                            </td>
                            
                            <td>
                                <div className="fw-medium">{item.ten_tb || item.tenTB}</div>
                                {(item.so_seri || item.soSeri) && <small className="text-muted">SN: {item.so_seri || item.soSeri}</small>}
                                <div className="text-truncate small text-muted" style={{maxWidth: "200px"}} title={item.thong_so_ky_thuat || item.thongSoKyThuat}>
                                    {item.thong_so_ky_thuat || item.thongSoKyThuat}
                                </div>
                            </td>

                            <td>
                                <span className="badge bg-light text-dark border fw-normal">
                                    {item.ten_loai || item.tenLoai || item.loai?.tenLoai || "-"}
                                </span>
                            </td>

                            <td className="small text-muted">
                                {formatDate(item.ngay_su_dung || item.ngaySuDung)}
                            </td>

                            <td>
                                <span className={`badge ${statusColors[item.tinh_trang || item.tinhTrang] || "bg-secondary"}`}>
                                    {item.tinh_trang || item.tinhTrang}
                                </span>
                            </td>

                            <td className="text-center">
                                <button className="btn btn-light btn-sm text-primary border" onClick={() => openDetail(item)} title="Xem chi tiết">
                                    <Eye size={18} />
                                </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-5 text-muted">
                                <RefreshCcw size={32} className="mb-2 text-secondary opacity-50" />
                                <br/>Không tìm thấy thiết bị nào.
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default UserEquipmentList;