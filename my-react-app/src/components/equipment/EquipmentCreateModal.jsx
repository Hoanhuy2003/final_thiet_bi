import { useState, useEffect } from "react";
import { equipmentService } from "../../services/equipmentService";
import toast from "react-hot-toast";

export default function EquipmentCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // SỬA 1: Dùng đúng tên field backend yêu cầu
  const [form, setForm] = useState({
    ten_tb: "",
    ma_loai: "",
    ma_lo: null,
    ma_phong: "",        // ← SỬA TỪ maDonVi → maPhong
    gia_tri_ban_dau: "",
    tinh_trang: "Đang sử dụng",
    ngay_su_dung: new Date().toISOString().split("T")[0],
  });

  // Danh sách đơn vị & phòng (sẽ lấy từ API sau, tạm hardcode đẹp)
  const donViOptions = [
    { value: "", label: "Chọn đơn vị" },
    { value: "DV001", label: "Khoa CNTT & Truyền thông" },
    { value: "DV002", label: "Khoa Điện - Điện tử" },
    { value: "DV003", label: "Khoa Cơ khí" },
    { value: "DV004", label: "Khoa Kinh tế" },
    { value: "DV005", label: "Phòng Hành chính - Quản trị" },
    { value: "DV006", label: "Phòng Tài chính - Kế toán" },
    { value: "DV007", label: "Phòng Đào tạo" },
    { value: "DV008", label: "Thư viện trường" },
    { value: "DV009", label: "Trung tâm Thực hành - Thí nghiệm" },
    { value: "DV010", label: "Ban Quản lý ký túc xá" },

  ];

  const phongOptions = [
    { value: "", label: "Chọn phòng" },
    { value: "HCQT01", label: "Văn phòng HCQT" },
    { value: "KTX01", label: "Phòng quản lý KTX" },
    { value: "LIB01", label: "Thư viện tầng 1" },
    { value: "P201", label: "Phòng thực hành Điện tử" },
    { value: "P301", label: "Xưởng Cơ khí CNC" },
    { value: "P001", label: "Phòng học 101" },
    { value: "P002", label: "Lab Lập trình Java" },
    { value: "P401", label: "Phòng học Kinh tế vĩ mô" },
    { value: "TC01", label: "Phòng Kế toán" },
    { value: "TH01", label: "Phòng thí nghiệm Vật lý" },
  ];

  // SỬA 2: Dùng maLoai thay vì loai
  const loaiOptions = [
    { value: "", label: "Chọn loại thiết bị" },
    { value: "L001", label: "Máy tính để bàn" },
    { value: "L002", label: "Laptop" },
    { value: "L003", label: "Máy chiếu Projector" },
    { value: "L004", label: "Máy lạnh" },
    { value: "L005", label: "Bàn ghế học viên" },
    { value: "L006", label: "Tủ hồ sơ sắt" },
    { value: "L007", label: "Máy in Laser" },
    { value: "L008", label: "Máy photocopy" },
    { value: "L009", label: "Camera an ninh" },
    { value: "L010", label: "Tivi LCD 55 inch" },
  ];

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openCreateEquipmentModal", handler);
    return () => window.removeEventListener("openCreateEquipmentModal", handler);
  }, []);

  const handleSubmit = async () => {
    // SỬA 3: Validate đúng field
    const missingFields = [];
    if (!form.ten_tb.trim()) missingFields.push("Tên thiết bị");
    if (!form.ma_loai) missingFields.push("Loại thiết bị"); // ← ĐÚNG
    if (!form.ma_phong) missingFields.push("Phòng");
    if (!form.gia_tri_ban_dau || Number(form.gia_tri_ban_dau) <= 0) missingFields.push("Nguyên giá");

    if (missingFields.length > 0) {
      console.warn("Các trường bắt buộc bị thiếu:", missingFields);
      toast.error(`Vui lòng nhập đầy đủ: ${missingFields.join(", ")}`);
      return;
    }

    const payload = {
      ten_tb: form.ten_tb.trim(),
      ma_loai: form.ma_loai,
      ma_lo: form.ma_lo || null,
      ma_phong: form.ma_phong,  // ← GỬI maPhong, KHÔNG GỬI maDonVi
      tinh_trang: form.tinh_trang,
      gia_tri_ban_dau: Number(form.gia_tri_ban_dau),
      gia_tri_hien_tai: Number(form.gia_tri_ban_dau),
      ngay_su_dung: form.ngay_su_dung,
    };

    console.log("Dữ liệu gửi đi:", payload);

    setLoading(true);
    try {
      const response = await equipmentService.create(payload);
      console.log("Thành công! Response:", response);
      toast.success("Thêm thiết bị thành công!");
      setIsOpen(false);
      setForm({
        ten_tb: "", ma_loai: "", ma_phong: "", gia_tri_ban_dau: "", tinh_trang: "Đang sử dụng"
      });
      window.dispatchEvent(new Event("equipmentFilterChange"));
    } catch (err) {
      console.error("Lỗi:", err.response?.data || err.message);
      toast.error("Lỗi: " + (err.response?.data || err.message));
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
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <span className="text-danger">*</span> Tên thiết bị
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: PC Dell Optiplex i7-12700"
                  value={form.ten_tb}
                  onChange={(e) => setForm({ ...form, ten_tb: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* SỬA: Dùng maLoai */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <span className="text-danger">*</span> Loại thiết bị
                </label>
                <select
                  className="form-select"
                  value={form.ma_loai}
                  onChange={(e) => setForm({ ...form, ma_loai: e.target.value })}
                  disabled={loading}
                >
                  {loaiOptions.map((item) => (
                    <option key={item.value} value={item.value} disabled={!item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Đơn vị & Phòng giữ nguyên */}

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <span className="text-danger">*</span> Phòng
                </label>
                <select
                  className="form-select"
                  value={form.ma_phong}
                  onChange={(e) => setForm({ ...form, ma_phong: e.target.value })}
                  disabled={loading}
                >
                  {phongOptions.map((p) => (
                    <option key={p.value} value={p.value} disabled={!p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <span className="text-danger">*</span> Nguyên giá (VNĐ)
                </label>
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