import { useState, useEffect } from "react";
import { Edit, Building2 } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import roomService from "../../services/roomService"; // LẤY PHÒNG TỪ BACKEND
import toast from "react-hot-toast";

export default function EquipmentEditModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhong, setLoadingPhong] = useState(true);
  const [danhSachPhong, setDanhSachPhong] = useState([]);

  const [form, setForm] = useState({
    tenTB: "",
    maLoai: "",
    maLo: null,
    maPhong: "",
    tinhTrang: "Đang sử dụng",
    giaTriBanDau: "",
    giaTriHienTai: "",
  });

  // === HARDCODE LOẠI THIẾT BỊ (giữ nguyên) ===
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

  // LẤY DANH SÁCH PHÒNG TỪ BACKEND
  useEffect(() => {
    const loadPhong = async () => {
      try {
        setLoadingPhong(true);
        const data = await roomService.getAll();
        setDanhSachPhong(data);
      } catch (err) {
        console.error("Lỗi tải danh sách phòng:", err);
        toast.error("Không tải được danh sách phòng");
      } finally {
        setLoadingPhong(false);
      }
    };
    loadPhong();
  }, []);

  // MỞ MODAL + ĐỔ DỮ LIỆU
  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("selectedEquipment");
      if (data) {
        const eq = JSON.parse(data);
        setEquipment(eq);

        setForm({
          tenTB: eq.tenTB || "",
          maLoai: eq.loai?.match(/L\d+/)?.[0] || "",
          maLo: null,
          maPhong: eq.phong || "", // Dùng tên phòng để so sánh với API
          tinhTrang: eq.tinhTrang || "Đang sử dụng",
          giaTriBanDau: eq.giaTriBanDau || "",
          giaTriHienTai: eq.giaTriHienTai || "",
        });

        setIsOpen(true);
      }
    };

    window.addEventListener("openEditEquipmentModal", handler);
    return () => window.removeEventListener("openEditEquipmentModal", handler);
  }, []);

  const handleSubmit = async () => {
    if (!form.tenTB.trim()) return toast.error("Vui lòng nhập tên thiết bị");
    if (!form.maLoai) return toast.error("Vui lòng chọn loại thiết bị");

    const payload = {
      ten_tb: form.tenTB.trim(),
      ma_loai: form.maLoai || null,
      ma_lo: form.maLo || null,
      ma_phong: form.maPhong || null,
      tinh_trang: form.tinhTrang,
      gia_tri_ban_dau: form.giaTriBanDau ? Number(form.giaTriBanDau) : null,
      gia_tri_hien_tai: form.giaTriHienTai ? Number(form.giaTriHienTai) : null,
    };

    setLoading(true);
    try {
      await equipmentService.update(equipment.maTB, payload);
      toast.success("Cập nhật thiết bị thành công!");
      setIsOpen(false);
      window.dispatchEvent(new Event("equipmentFilterChange"));
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      toast.error("Cập nhật thất bại: " + (err.response?.data?.message || "Lỗi server"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !equipment) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <Edit size={20} />
              Chỉnh sửa thiết bị: {equipment.maTB} - {equipment.tenTB}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            />
          </div>

          <div className="modal-body">
            <div className="row g-3">
              {/* Tên thiết bị */}
              <div className="col-12 col-md-8">
                <label className="form-label fw-semibold">Tên thiết bị</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.tenTB}
                  onChange={(e) => setForm({ ...form, tenTB: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* Loại thiết bị */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Loại thiết bị</label>
                <select
                  className="form-select"
                  value={form.maLoai}
                  onChange={(e) => setForm({ ...form, maLoai: e.target.value })}
                  disabled={loading}
                >
                  {loaiOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={!opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phòng – LẤY TỪ API */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold d-flex align-items-center gap-2">
                  <Building2 size={16} /> Phòng
                </label>
                <select
                  className="form-select"
                  value={form.maPhong}
                  onChange={(e) => setForm({ ...form, maPhong: e.target.value })}
                  disabled={loading || loadingPhong}
                >
                  <option value="">
                    {loadingPhong ? "Đang tải phòng..." : "Chọn phòng"}
                  </option>
                  {danhSachPhong.map((phong) => (
                    <option key={phong.maPhong} value={phong.tenPhong}>
                      {phong.tenPhong} ({phong.maPhong})
                    </option>
                  ))}
                </select>
              </div>

              {/* Trạng thái */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Trạng thái</label>
                <select
                  className="form-select"
                  value={form.tinhTrang}
                  onChange={(e) => setForm({ ...form, tinhTrang: e.target.value })}
                  disabled={loading}
                >
                  <option value="Đang sử dụng">Đang sử dụng</option>
                  <option value="Bảo trì">Bảo trì</option>
                  <option value="Hỏng hóc">Hỏng hóc</option>
                  <option value="Chờ thanh lý">Chờ thanh lý</option>
                  <option value="Đã thanh lý">Đã thanh lý</option>
                </select>
              </div>

              {/* Nguyên giá */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Nguyên giá (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.giaTriBanDau}
                  onChange={(e) => setForm({ ...form, giaTriBanDau: e.target.value })}
                  min="0"
                  disabled={loading}
                />
              </div>

              {/* Giá trị hiện tại */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Giá trị hiện tại (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.giaTriHienTai}
                  onChange={(e) => setForm({ ...form, giaTriHienTai: e.target.value })}
                  min="0"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer border-top pt-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}