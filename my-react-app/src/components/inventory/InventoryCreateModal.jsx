// src/components/inventory/InventoryCreateModal.jsx

import React, { useState, useEffect } from "react";
import { Plus, Building2, Users, Calendar, ClipboardCheck } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { inventoryService } from "../../services/inventoryService";
import userService from "../../services/userService"; 
import toast from "react-hot-toast";

const initialFormState = {
  maPhong: null,
  maDonVi: null,
  maNguoiKiemKe: null, 
  ngayKiemKe: new Date().toISOString().split('T')[0],
  ghiChu: "",
};

export default function InventoryCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [currentUserDisplayName, setCurrentUserDisplayName] = useState('Đang tải...'); 
    
  const [masterData, setMasterData] = useState({
    donVi: [],
    phong: [],
  });
  const [filteredRooms, setFilteredRooms] = useState([]);

  // --- 1. LOAD MASTER DATA (Logic lấy ID & Tên tối ưu) ---
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resDonVi, resPhong, userInfo] = await Promise.all([
          axiosInstance.get("/api/donVi"), 
          axiosInstance.get("/api/phong"),
          userService.getMyInfo(), 
        ]);

        setMasterData({
          donVi: resDonVi.data.result || resDonVi.data || [],
          phong: resPhong.data.result || resPhong.data || [],
        });
        
        // Xử lý thông tin user
        const user = userInfo?.maNguoiDung ? userInfo : (userInfo?.data?.result || userInfo?.data);

        if (user && user.maNguoiDung) {
            setForm(prev => ({ 
                ...prev, 
                maNguoiKiemKe: user.maNguoiDung 
            }));
            setCurrentUserDisplayName(user.hoTen || user.tenND || user.username);
        } else {
            console.error("Không lấy được thông tin user:", userInfo);
            setCurrentUserDisplayName('Lỗi: Không tìm thấy thông tin');
            setForm(prev => ({ ...prev, maNguoiKiemKe: null }));
        }
        
      } catch (err) {
        console.error("Lỗi tải dữ liệu ban đầu:", err);
        toast.error("Không tải được dữ liệu cần thiết.");
        setCurrentUserDisplayName('Lỗi kết nối');
      }
    };
    
    if (isOpen) {
        fetchMasterData();
    }
    
  }, [isOpen]); 

  // --- 2. XỬ LÝ LỌC PHÒNG THEO ĐƠN VỊ ---
  useEffect(() => {
    if (form.maDonVi) {
      const filtered = masterData.phong.filter(p => 
        p.maDonVi === form.maDonVi
      );
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms([]);
    }
  }, [form.maDonVi, masterData.phong]);


  // --- 3. EVENT LISTENER ---
  useEffect(() => {
    const handler = () => {
      setForm(initialFormState); 
      setIsOpen(true);
    };
    window.addEventListener("openCreateInventoryModal", handler);
    return () => window.removeEventListener("openCreateInventoryModal", handler);
  }, []);

  // --- 4. SUBMIT (FIX: Tự động mở Checklist sau khi tạo) ---
  const handleSubmit = async () => {
    if (!form.maPhong || !form.maNguoiKiemKe) { 
      return toast.error("Vui lòng chọn Phòng và kiểm tra thông tin người dùng.");
    }
    
    setLoading(true);
    
    const payload = {
      maPhong: form.maPhong,
      maNguoiKiemKe: form.maNguoiKiemKe,
      ngayKiemKe: form.ngayKiemKe, 
      ghiChu: form.ghiChu,
    };

    try {
      // 1. Gọi API tạo phiên
      const newSession = await inventoryService.createSession(payload);
      
      toast.success(`Tạo phiên ${newSession.maKiemKe} thành công! Đang chuyển sang kiểm kê...`);
      
      // 2. Đóng modal tạo hiện tại
      setIsOpen(false);
      
      // 3. Reload bảng danh sách (để hiện dòng mới "Đang kiểm kê")
      window.dispatchEvent(new Event("reloadInventoryTable")); 

      // 4. QUAN TRỌNG: Mở ngay Modal Checklist với session vừa tạo
      // Lưu session vào localStorage để ChecklistModal đọc được dữ liệu (maKiemKe, phong...)
      localStorage.setItem("selectedInventorySession", JSON.stringify(newSession));
      
      // Phát sự kiện mở Checklist (delay nhẹ 300ms để UI modal cũ đóng hẳn cho mượt)
      setTimeout(() => {
          window.dispatchEvent(new Event("openChecklistModal"));
      }, 300);
      
    } catch (error) {
      console.error("Lỗi tạo phiên:", error.response || error);
      toast.error("Lỗi tạo phiên. Vui lòng thử lại.");
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
            <div>
              <h5 className="modal-title">Tạo phiên kiểm kê mới</h5>
              <p className="text-muted mb-0 text-sm">
                Nhập thông tin để bắt đầu một phiên kiểm kê thiết bị
              </p>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)} disabled={loading}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              
              {/* Đơn vị */}
              <div className="col-6">
                <label className="form-label d-flex align-items-center gap-1"><Building2 size={16} /> Đơn vị *</label>
                <select 
                    className="form-select"
                    value={form.maDonVi || ''}
                    onChange={e => setForm({...form, maDonVi: e.target.value, maPhong: null})}
                    disabled={loading}
                >
                  <option value="">-- Chọn đơn vị --</option> 
                    {masterData.donVi.map(dv => (
                        <option key={dv.maDonVi} value={dv.maDonVi}>{dv.tenDonVi}</option>
                    ))}
                </select>
              </div>
              
              {/* Phòng */}
              <div className="col-6">
                <label className="form-label d-flex align-items-center gap-1"><Building2 size={16} /> Phòng *</label>
                <select 
                    className="form-select"
                    value={form.maPhong || ''}
                    onChange={e => setForm({...form, maPhong: e.target.value})}
                    disabled={loading || !form.maDonVi || filteredRooms.length === 0}
                >
                  <option value="">
                        {form.maDonVi ? (filteredRooms.length === 0 ? "Không có phòng" : "-- Chọn phòng --") : "-- Chọn đơn vị trước --"}
                    </option>
                    {filteredRooms.map(p => (
                        <option key={p.maPhong} value={p.maPhong}>{p.tenPhong}</option>
                    ))}
                </select>
              </div>
              
              {/* Ngày kiểm kê */}
              <div className="col-6">
                <label className="form-label d-flex align-items-center gap-1"><Calendar size={16} /> Ngày kiểm kê *</label>
                <input 
                    type="date" 
                    className="form-control" 
                    value={form.ngayKiemKe}
                    onChange={e => setForm({...form, ngayKiemKe: e.target.value})}
                    disabled={loading}
                />
              </div>
              
              {/* Người kiểm kê (Read-only) */}
              <div className="col-6">
                <label className="form-label d-flex align-items-center gap-1"><Users size={16} /> Người kiểm kê *</label>
                <div className="input-group">
                    <input 
                        type="text" 
                        className={`form-control ${!form.maNguoiKiemKe ? 'is-invalid' : ''}`}
                        value={currentUserDisplayName} 
                        disabled 
                    />
                </div>
                {(!form.maNguoiKiemKe && !loading) && 
                    <small className="text-danger mt-1 d-block">
                        Không lấy được ID người dùng. Vui lòng F5 hoặc đăng nhập lại.
                    </small>
                }
              </div>
              
              {/* Ghi chú */}
              <div className="col-12">
                <label className="form-label">Ghi chú</label>
                <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Nhập ghi chú..."
                    value={form.ghiChu}
                    onChange={e => setForm({...form, ghiChu: e.target.value})}
                    disabled={loading}
                ></textarea>
              </div>
            </div>
            <div className="border rounded p-3 bg-light mt-3">
              <p className="text-sm mb-0 d-flex align-items-center gap-1">
                <ClipboardCheck size={16} className="text-primary"/>
                <strong>Lưu ý:</strong> Sau khi tạo, hệ thống sẽ tự động chuyển sang màn hình danh sách thiết bị để bạn thực hiện kiểm kê ngay.
              </p>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)} disabled={loading}>Hủy</button>
            <button 
                className="btn btn-primary" 
                onClick={handleSubmit} 
                disabled={loading || !form.maPhong || !form.maNguoiKiemKe}
            >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang tạo...
                    </>
                ) : (
                    <>
                        <Plus size={16} className="me-2" />
                        Tạo phiên kiểm kê
                    </>
                )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}