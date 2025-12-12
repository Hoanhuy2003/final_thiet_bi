// src/components/inventory/InventoryCreateModal.jsx

import React, { useState, useEffect } from "react";
import { Plus, Building2, Users, Calendar, ClipboardCheck } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import userService from "../../services/userService"; 
import { inventoryService } from "../../services/inventoryService"; // Import Service
import toast from "react-hot-toast";

const initialFormState = {
  maPhong: null,
  maDonVi: null,
  maNguoiKiemKe: "", 
  ngayKiemKe: new Date().toISOString().split('T')[0],
  ghiChu: "",
};

export default function InventoryCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
    
  const [masterData, setMasterData] = useState({
    donVi: [],
    phong: [],
    users: [] 
  });
  const [filteredRooms, setFilteredRooms] = useState([]);

  // --- 1. LOAD DỮ LIỆU ---
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resDonVi, resPhong, allUsers] = await Promise.all([
          axiosInstance.get("/api/donVi"), 
          axiosInstance.get("/api/phong"),
          userService.getAllList() 
        ]);

        const allowedRoles = ["ADMIN", "NHANVIENKIEMKE", "VT001", "VT010"];
        const safeUserList = Array.isArray(allUsers) ? allUsers : [];

        const filteredUsers = safeUserList.filter(u => {
            const roleCode = u.maVaiTro?.maVaiTro || ""; 
            return allowedRoles.includes(roleCode);
        });

        setMasterData({
          donVi: resDonVi.data.result || resDonVi.data || [],
          phong: resPhong.data.result || resPhong.data || [],
          users: filteredUsers, 
        });
        
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      }
    };
    
    if (isOpen) {
        fetchMasterData();
    }
  }, [isOpen]); 

  // --- 2. LỌC PHÒNG ---
  useEffect(() => {
    if (form.maDonVi) {
      const filtered = masterData.phong.filter(p => p.maDonVi === form.maDonVi);
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms([]);
    }
  }, [form.maDonVi, masterData.phong]);

  // --- 3. RESET FORM ---
  useEffect(() => {
    const handler = () => {
      setForm(initialFormState); 
      setIsOpen(true);
    };
    window.addEventListener("openCreateInventoryModal", handler);
    return () => window.removeEventListener("openCreateInventoryModal", handler);
  }, []);

  // --- 4. SUBMIT FORM (DÙNG SERVICE) ---
  const handleSubmit = async () => {
    if (!form.maPhong) return toast.error("Vui lòng chọn Phòng.");
    if (!form.maNguoiKiemKe) return toast.error("Vui lòng chọn Người kiểm kê.");
    
    setLoading(true);
    
    const payload = {
  ma_phong: form.maPhong,
  ma_nguoi_kiem_ke: form.maNguoiKiemKe,
  ngay_kiem_ke: form.ngayKiemKe,
  ghi_chu: form.ghiChu,
  chi_tiet: []  
};

    console.log("🚀 PAYLOAD:", payload);

    try {
       
      await inventoryService.createSession(payload);
      // ------------------------------------------------------------------------

      toast.success(`Tạo phiên thành công!`);
      setIsOpen(false);
      
      // Chỉ reload bảng để hiện danh sách mới
      window.dispatchEvent(new Event("reloadInventoryTable")); 
      
      // Đã xóa đoạn tự động mở Checklist theo yêu cầu của bạn
      
    } catch (error) {
      console.error("❌ LỖI:", error);
      if (error.response && error.response.data) {
         const data = error.response.data;
         const msg = typeof data === 'string' ? data : (data.message || "Lỗi tạo phiên");
         toast.error("Lỗi: " + msg);
      } else {
         toast.error("Không kết nối được Server!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Tạo phiên kiểm kê mới</h5>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          
          <div className="modal-body">
            <div className="row g-3">
              
              {/* Đơn vị */}
              <div className="col-6">
                <label className="form-label fw-bold">Đơn vị *</label>
                <select 
                    className="form-select"
                    value={form.maDonVi || ''}
                    onChange={e => setForm({...form, maDonVi: e.target.value, maPhong: null})}
                >
                  <option value="">-- Chọn đơn vị --</option> 
                    {masterData.donVi.map(dv => (
                        <option key={dv.maDonVi} value={dv.maDonVi}>{dv.tenDonVi}</option>
                    ))}
                </select>
              </div>
              
              {/* Phòng */}
              <div className="col-6">
                <label className="form-label fw-bold">Phòng *</label>
                <select 
                    className="form-select"
                    value={form.maPhong || ''}
                    onChange={e => setForm({...form, maPhong: e.target.value})}
                    disabled={!form.maDonVi}
                >
                  <option value="">-- Chọn phòng --</option>
                    {filteredRooms.map(p => (
                        <option key={p.maPhong} value={p.maPhong}>{p.tenPhong}</option>
                    ))}
                </select>
              </div>
              
              {/* Ngày kiểm kê */}
              <div className="col-6">
                <label className="form-label fw-bold">Ngày kiểm kê *</label>
                <input 
                    type="date" 
                    className="form-control" 
                    value={form.ngayKiemKe}
                    onChange={e => setForm({...form, ngayKiemKe: e.target.value})}
                />
              </div>
              
              {/* Người kiểm kê */}
              <div className="col-6">
                <label className="form-label fw-bold"><Users size={16} /> Người kiểm kê *</label>
                <select 
                    className="form-select"
                    value={form.maNguoiKiemKe || ''}
                    onChange={e => setForm({...form, maNguoiKiemKe: e.target.value})}
                >
                    <option value="">-- Chọn nhân viên --</option>
                    {masterData.users.length > 0 ? (
                        masterData.users.map(u => {
                            const userId = u.maNguoiDung;
                            const userName = u.hoTen;
                            const roleName = u.maVaiTro?.tenVaiTro || "NV";

                            return (
                                <option key={userId} value={userId}>
                                    {userName} ({roleName})
                                </option>
                            );
                        })
                    ) : (
                        <option disabled>Không tìm thấy nhân viên phù hợp</option>
                    )}
                </select>
              </div>
              
              {/* Ghi chú */}
              <div className="col-12">
                <label className="form-label">Ghi chú</label>
                <textarea 
                    className="form-control" rows="3" 
                    value={form.ghiChu} onChange={e => setForm({...form, ghiChu: e.target.value})}
                ></textarea>
              </div>
            </div>
             <div className="alert alert-light border mt-3 mb-0 d-flex gap-2 align-items-center">
                <ClipboardCheck size={20} className="text-primary"/>
                <small>Sau khi tạo, dữ liệu sẽ hiển thị ngay trên bảng danh sách.</small>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !form.maPhong || !form.maNguoiKiemKe}>
                {loading ? "Đang xử lý..." : "Lưu phiếu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}