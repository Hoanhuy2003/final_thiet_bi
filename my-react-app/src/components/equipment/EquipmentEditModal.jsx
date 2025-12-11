import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import Select from "react-select";

export default function EquipmentEditModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [equipmentId, setEquipmentId] = useState(null);
  const [loading, setLoading] = useState(false);

  // State lưu danh sách Options cho React-Select
  const [loaiOptions, setLoaiOptions] = useState([]);
  const [phongOptions, setPhongOptions] = useState([]);

  // Options cứng cho trạng thái
  const trangThaiOptions = [
    { value: "Đang sử dụng", label: "Đang sử dụng" },
    { value: "Sẵn sàng", label: "Sẵn sàng" }, 
    { value: "Bảo trì", label: "Bảo trì" },
    { value: "Hỏng hóc", label: "Hỏng hóc" },
    { value: "Chờ thanh lý", label: "Chờ thanh lý" },
    { value: "Đã thanh lý", label: "Đã thanh lý" },
    { value: "Hết khấu hao", label: "Hết khấu hao" }
  ];

  const [form, setForm] = useState({
    tenTB: "",
    maLoai: null, 
    maLo: null,
    maPhong: null,
    tinhTrang: null,
    giaTriBanDau: "",
    giaTriHienTai: "",
    soSeri: "",             // <-- THÊM STATE: Số Seri
    thongSoKyThuat: "",     // <-- THÊM STATE: Thông số kỹ thuật
  });

  // ==================== 1. LOAD DANH MỤC & CONVERT OPTIONS ====================
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resLoai, resPhong] = await Promise.all([
          axiosInstance.get("/api/loai_thiet_bi"),
          axiosInstance.get("/api/phong"),
        ]);

        // Convert API Loai -> { value: ma, label: ten }
        const rawLoai = resLoai.data.result || resLoai.data || [];
        setLoaiOptions(rawLoai.map(l => ({ value: l.maLoai, label: l.tenLoai })));

        // Convert API Phong -> { value: ma, label: ten }
        const rawPhong = resPhong.data.result || resPhong.data || [];
        setPhongOptions(rawPhong.map(p => ({ value: p.maPhong, label: p.tenPhong })));

      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
        toast.error("Không tải được danh mục");
      }
    };
    fetchMasterData();
  }, []);

  // ==================== 2. MỞ MODAL & LẤY ID ====================
  useEffect(() => {
    const handler = () => {
      const dataStr = localStorage.getItem("selectedEquipment");
      if (dataStr) {
        const eq = JSON.parse(dataStr);
        setEquipmentId(eq.maTB);
        setIsOpen(true);
      }
    };
    window.addEventListener("openEditEquipmentModal", handler);
    return () => window.removeEventListener("openEditEquipmentModal", handler);
  }, []);

  // ==================== 3. FETCH DỮ LIỆU & FILL FORM ====================
  useEffect(() => {
    if (isOpen && equipmentId && loaiOptions.length > 0 && phongOptions.length > 0) {
      loadDetailAndFill();
    }
  }, [isOpen, equipmentId, loaiOptions, phongOptions]);

  const loadDetailAndFill = async () => {
    setLoading(true);
    try {
      const res = await equipmentService.getById(equipmentId);
      const eq = res.data?.result || res.data || res;

      // Logic tìm Mã nếu API chỉ trả về Tên (Fallback)
      let targetMaLoai = eq.maLoai;
      if (!targetMaLoai && eq.loai) {
        const found = loaiOptions.find(l => l.label === eq.loai); // Tìm theo Label (Tên)
        targetMaLoai = found?.value;
      }

      let targetMaPhong = eq.maPhong;
      if (!targetMaPhong && eq.phong) {
        const found = phongOptions.find(p => p.label === eq.phong);
        targetMaPhong = found?.value;
      }

      setForm({
        tenTB: eq.tenTB || "",
        maLoai: targetMaLoai || null,
        maLo: eq.maLo || null,
        maPhong: targetMaPhong || null,
        tinhTrang: eq.tinhTrang || "Đang sử dụng",
        giaTriBanDau: eq.giaTriBanDau || 0,
        giaTriHienTai: eq.giaTriHienTai || 0,
        soSeri: eq.soSeri || "",               // <-- LẤY DỮ LIỆU SERIAL
        thongSoKyThuat: eq.thongSoKyThuat || "", // <-- LẤY DỮ LIỆU THÔNG SỐ KT
      });
    } catch (err) {
      console.error("Lỗi fill form:", err);
      toast.error("Không tải được chi tiết thiết bị");
    } finally {
      setLoading(false);
    }
  };

  // ==================== 4. XỬ LÝ SUBMIT ====================
  const handleSubmit = async () => {
    if (!form.tenTB.trim()) return toast.error("Vui lòng nhập tên thiết bị");
    if (!form.maLoai) return toast.error("Vui lòng chọn loại thiết bị");
    if (!form.maPhong) return toast.error("Vui lòng chọn phòng");

    setLoading(true);
    const payload = {
      ten_tb: form.tenTB.trim(),
      ma_loai: form.maLoai, 
      ma_lo: form.maLo,
      ma_phong: form.maPhong, 
      tinh_trang: form.tinhTrang,
      gia_tri_ban_dau: Number(form.giaTriBanDau),
      gia_tri_hien_tai: Number(form.giaTriHienTai),
      so_seri: form.soSeri.trim(),                   // <-- GỬI SERIAL
      thong_so_ky_thuat: form.thongSoKyThuat.trim(), // <-- GỬI THÔNG SỐ KỸ THUẬT
    };

    try {
      await equipmentService.update(equipmentId, payload);
      toast.success("Cập nhật thành công!");
      setIsOpen(false);
      window.dispatchEvent(new Event("reloadEquipmentTable")); // <-- Đổi thành reloadEquipmentTable để đồng bộ
    } catch (err) {
      console.error("Lỗi update:", err);
      toast.error("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Helper tìm Object từ ID (Để hiển thị lên React-Select)
  const getValueObj = (options, value) => {
      return options.find(op => op.value === value) || null;
  };

  // Style giống Bootstrap
  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#dee2e6",
      borderRadius: "0.375rem",
      minHeight: "38px",
      boxShadow: "none",
      "&:hover": { borderColor: "#86b7fe" }
    }),
    menu: (base) => ({ ...base, zIndex: 1060 })
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Edit size={20} />
              Chỉnh sửa thiết bị: {equipmentId}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
          </div>

          <div className="modal-body">
            {loading && !form.tenTB ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-3">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <div className="row g-3">
                
                {/* Tên TB */}
                <div className="col-md-8">
                  <label className="form-label fw-bold">Tên thiết bị <span className="text-danger">*</span></label>
                  <input className="form-control" value={form.tenTB} onChange={e => setForm({...form, tenTB: e.target.value})} />
                </div>

                {/* Loại TB (React-Select) */}
                <div className="col-md-4">
                  <label className="form-label fw-bold">Loại thiết bị <span className="text-danger">*</span></label>
                  <Select 
                    options={loaiOptions}
                    value={getValueObj(loaiOptions, form.maLoai)}
                    onChange={(opt) => setForm({...form, maLoai: opt?.value})}
                    placeholder="-- Chọn loại --"
                    styles={customStyles}
                    isDisabled={loading}
                  />
                </div>

                {/* Số Seri (MỚI) */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Số Seri</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={form.soSeri} 
                        onChange={e => setForm({...form, soSeri: e.target.value})} 
                        placeholder="Mã duy nhất từ NSX (nếu có)"
                        disabled={loading}
                    />
                </div>

                {/* Phòng (React-Select) */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Phòng / Vị trí <span className="text-danger">*</span></label>
                  <Select 
                    options={phongOptions}
                    value={getValueObj(phongOptions, form.maPhong)}
                    onChange={(opt) => setForm({...form, maPhong: opt?.value})}
                    placeholder="-- Tìm phòng --"
                    styles={customStyles}
                    isDisabled={loading}
                  />
                </div>
                
                {/* Thông số kỹ thuật (MỚI) */}
                <div className="col-12">
                    <label className="form-label fw-bold">Thông số kỹ thuật/Mô tả</label>
                    <textarea 
                        className="form-control" 
                        rows="2" 
                        value={form.thongSoKyThuat} 
                        onChange={e => setForm({...form, thongSoKyThuat: e.target.value})} 
                        placeholder="VD: Core i7, RAM 16GB, Hãng Dell..."
                        disabled={loading}
                    />
                </div>


                {/* Trạng thái (React-Select) */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Trạng thái</label>
                  <Select 
                    options={trangThaiOptions}
                    value={getValueObj(trangThaiOptions, form.tinhTrang)}
                    onChange={(opt) => setForm({...form, tinhTrang: opt?.value})}
                    placeholder="-- Trạng thái --"
                    styles={customStyles}
                    isDisabled={loading}
                  />
                </div>

                {/* Giá trị */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nguyên giá (VNĐ)</label>
                  <input type="number" className="form-control" value={form.giaTriBanDau} onChange={e => setForm({...form, giaTriBanDau: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Giá trị hiện tại (VNĐ)</label>
                  <input type="number" className="form-control" value={form.giaTriHienTai} onChange={e => setForm({...form, giaTriHienTai: e.target.value})} />
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={loading}>Đóng</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}