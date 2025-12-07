import { useState, useEffect } from "react";
import { equipmentService } from "../../services/equipmentService";
import axiosInstance from "../../api/axiosInstance"; 
import toast from "react-hot-toast";

export default function EquipmentCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // State chứa danh sách từ API
  const [dsPhong, setDsPhong] = useState([]);
  const [dsLoai, setDsLoai] = useState([]);

  const [form, setForm] = useState({
    ten_tb: "",
    ma_loai: "",
    ma_lo: null,
    ma_phong: "",        
    gia_tri_ban_dau: "",
    tinh_trang: "Đang sử dụng",
    ngay_su_dung: new Date().toISOString().split("T")[0],
  });

  // GỌI API KHI MỞ MODAL
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openCreateEquipmentModal", handler);
    
    fetchMasterData(); 

    return () => window.removeEventListener("openCreateEquipmentModal", handler);
  }, []);

  const fetchMasterData = async () => {
    try {
      // Chỉ cần gọi API Phòng và Loại thiết bị
      const [resPhong, resLoai] = await Promise.all([
        axiosInstance.get("/api/phong"),
        axiosInstance.get("/api/loai_thiet_bi")
      ]);

      setDsPhong(resPhong.data || []);
      setDsLoai(resLoai.data || []);

    } catch (error) {
      console.error("Lỗi tải dữ liệu danh mục:", error);
      toast.error("Không thể tải danh sách danh mục");
    }
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!form.ten_tb.trim()) missingFields.push("Tên thiết bị");
    if (!form.ma_loai) missingFields.push("Loại thiết bị");
    if (!form.ma_phong) missingFields.push("Phòng");
    if (!form.gia_tri_ban_dau || Number(form.gia_tri_ban_dau) <= 0) missingFields.push("Nguyên giá");

    if (missingFields.length > 0) {
      toast.error(`Vui lòng nhập đầy đủ: ${missingFields.join(", ")}`);
      return;
    }

    const payload = {
      ten_tb: form.ten_tb.trim(),
      ma_loai: form.ma_loai,
      ma_lo: form.ma_lo || null,
      ma_phong: form.ma_phong, 
      tinh_trang: form.tinh_trang,
      gia_tri_ban_dau: Number(form.gia_tri_ban_dau),
      gia_tri_hien_tai: Number(form.gia_tri_ban_dau),
      ngay_su_dung: form.ngay_su_dung,
    };
      
    setLoading(true);
    try {
      await equipmentService.create(payload);
      toast.success("Thêm thiết bị thành công!");
      setIsOpen(false);
      
      // Reset form
      setForm({
        ten_tb: "", ma_loai: "", ma_phong: "", 
        gia_tri_ban_dau: "", tinh_trang: "Đang sử dụng", 
        ngay_su_dung: new Date().toISOString().split("T")[0]
      });
      
      window.dispatchEvent(new Event("equipmentFilterChange"));
    } catch (err) {
      console.error(err);
      toast.error("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Thêm thiết bị mới</h5>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)} disabled={loading}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              
              {/* Tên thiết bị */}
              <div className="col-12">
                <label className="form-label fw-semibold"><span className="text-danger">*</span> Tên thiết bị</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: PC Dell Optiplex i7"
                  value={form.ten_tb}
                  onChange={(e) => setForm({ ...form, ten_tb: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* Loại thiết bị (Hiển thị Tên, Value là Mã) */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold"><span className="text-danger">*</span> Loại thiết bị</label>
                <select
                  className="form-select"
                  value={form.ma_loai}
                  onChange={(e) => setForm({ ...form, ma_loai: e.target.value })}
                  disabled={loading}
                >
                  <option value="">-- Chọn loại thiết bị --</option>
                  {dsLoai.map((item) => (
                    <option key={item.maLoai} value={item.maLoai}>
                      {item.tenLoai} {/* Hiển thị tên loại */}
                    </option>
                  ))}
                </select>
                {dsLoai.length === 0 && <small className="text-muted">Đang tải danh sách loại...</small>}
              </div>

              {/* Phòng đặt thiết bị (Hiển thị Tên, Value là Mã) */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold"><span className="text-danger">*</span> Phòng đặt</label>
                <select
                  className="form-select"
                  value={form.ma_phong}
                  onChange={(e) => setForm({ ...form, ma_phong: e.target.value })}
                  disabled={loading}
                >
                  <option value="">-- Chọn phòng --</option>
                  {dsPhong.map((p) => (
                    <option key={p.maPhong} value={p.maPhong}>
                      {p.tenPhong} {/* Hiển thị tên phòng */}
                    </option>
                  ))}
                </select>
                {dsPhong.length === 0 && <small className="text-muted">Đang tải danh sách phòng...</small>}
              </div>

              {/* Nguyên giá */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold"><span className="text-danger">*</span> Nguyên giá (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="VD: 18500000"
                  value={form.gia_tri_ban_dau}
                  onChange={(e) => setForm({ ...form, gia_tri_ban_dau: e.target.value })}
                  min="0"
                  disabled={loading}
                />
              </div>

              {/* Trạng thái */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Trạng thái ban đầu</label>
                <select
                  className="form-select"
                  value={form.tinh_trang}
                  onChange={(e) => setForm({ ...form, tinh_trang: e.target.value })}
                  disabled={loading}
                >
                  <option value="Đang sử dụng">Đang sử dụng</option>
                  <option value="Bảo trì">Bảo trì</option>
                  <option value="Hỏng hóc">Hỏng hóc</option>
                  <option value="Chờ thanh lý">Chờ thanh lý</option>
                </select>
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