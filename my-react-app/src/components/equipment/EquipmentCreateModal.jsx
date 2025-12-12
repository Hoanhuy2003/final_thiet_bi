import { useState, useEffect } from "react";
import { equipmentService } from "../../services/equipmentService";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function EquipmentCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dsPhong, setDsPhong] = useState([]);
  const [dsLoai, setDsLoai] = useState([]);

  // THÊM: DANH SÁCH NHÀ CUNG CẤP TỪ API
  const [dsNhaCungCap, setDsNhaCungCap] = useState([]);

  const [form, setForm] = useState({
    ten_tb: "",
    ma_loai: "",
    ma_lo: null,
    ma_phong: "",
    ma_nha_cung_cap: "", // <-- THÊM FIELD NHÀ CUNG CẤP
    gia_tri_ban_dau: "",
    tinh_trang: "Đang sử dụng",
    ngay_su_dung: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resLoai, resPhong, resNhaCungCap] = await Promise.all([ // THÊM API NHÀ CUNG CẤP
          axiosInstance.get("/api/loai_thiet_bi"),
          axiosInstance.get("/api/phong"),
          axiosInstance.get("/api/nha_cung_cap"), // <-- GỌI API NHÀ CUNG CẤP
        ]);
        setDsLoai(resLoai.data.result || resLoai.data || []);
        setDsPhong(resPhong.data.result || resPhong.data || []);
        setDsNhaCungCap(resNhaCungCap.data.result || resNhaCungCap.data || []); // <-- SET DANH SÁCH NCC
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openCreateEquipmentModal", handler);
    return () => window.removeEventListener("openCreateEquipmentModal", handler);
  }, []);

  const handleSubmit = async () => {
    if (!form.ten_tb.trim()) return toast.error("Vui lòng nhập tên thiết bị");

    setLoading(true);
    try {
      await equipmentService.create(form);
      toast.success("Thêm thiết bị thành công!");
      setIsOpen(false);
      // THÊM: DISPATCH EVENT ĐỂ BẢNG RELOAD
      window.dispatchEvent(new Event("reloadEquipmentTable"));
    } catch (err) {
      toast.error("Thêm thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Thêm thiết bị mới</h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              {/* Tên TB */}
              <div className="col-md-8">
                <label className="form-label fw-bold">Tên thiết bị</label>
                <input className="form-control" value={form.ten_tb} onChange={e => setForm({...form, ten_tb: e.target.value})} />
              </div>

              {/* Loại TB */}
              <div className="col-md-4">
                <label className="form-label fw-bold">Loại thiết bị</label>
                <select className="form-select" value={form.ma_loai} onChange={e => setForm({...form, ma_loai: e.target.value})}>
                  <option value="">-- Chọn loại --</option>
                  {dsLoai.map(item => (
                    <option key={item.maLoai} value={item.maLoai}>{item.tenLoai}</option>
                  ))}
                </select>
              </div>

              {/* THÊM: NHÀ CUNG CẤP */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Nhà cung cấp</label>
                <select className="form-select" value={form.ma_nha_cung_cap} onChange={e => setForm({...form, ma_nha_cung_cap: e.target.value})}>
                  <option value="">-- Chọn nhà cung cấp --</option>
                  {dsNhaCungCap.map(ncc => (
                    <option key={ncc.maNhaCungCap} value={ncc.maNhaCungCap}>{ncc.ten}</option>
                  ))}
                </select>
              </div>

              {/* Phòng */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Phòng / Vị trí</label>
                <select className="form-select" value={form.ma_phong} onChange={e => setForm({...form, ma_phong: e.target.value})}>
                  <option value="">-- Chọn phòng --</option>
                  {dsPhong.map(item => (
                    <option key={item.maPhong} value={item.maPhong}>{item.tenPhong}</option>
                  ))}
                </select>
              </div>

              {/* Trạng thái */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Trạng thái</label>
                <select className="form-select" value={form.tinh_trang} onChange={e => setForm({...form, tinh_trang: e.target.value})}>
                  <option value="Đang sử dụng">Đang sử dụng</option>
                  <option value="Bảo trì">Bảo trì</option>
                  <option value="Hỏng hóc">Hỏng hóc</option>
                  <option value="Chờ thanh lý">Chờ thanh lý</option>
                </select>
              </div>

              {/* Ngày sử dụng */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Ngày sử dụng</label>
                <input type="date" className="form-control" value={form.ngay_su_dung} onChange={e => setForm({...form, ngay_su_dung: e.target.value})} />
              </div>

              {/* Nguyên giá */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Nguyên giá (VNĐ)</label>
                <input type="number" className="form-control" value={form.gia_tri_ban_dau} onChange={e => setForm({...form, gia_tri_ban_dau: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)} disabled={loading}>
              Hủy
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang xử lý..." : "Thêm thiết bị"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}