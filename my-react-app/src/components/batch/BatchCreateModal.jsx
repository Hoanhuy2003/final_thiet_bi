import { useState, useEffect } from "react";
import { Plus, Zap, Save, MapPin } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { loThietBiService } from "../../services/batchService";
import Select from "react-select";
import toast from "react-hot-toast";

export default function BatchCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);

  // Data cho Select
  const [loaiOptions, setLoaiOptions] = useState([]);
  const [nccOptions, setNccOptions] = useState([]);
  const [phongOptions, setPhongOptions] = useState([]); // <-- THÊM STATE PHÒNG

  const [form, setForm] = useState({
    ten_lo: "",
    ma_loai: null,      
    ma_ncc: null,       
    ma_phong: null, // <-- THÊM MÃ PHÒNG VÀO STATE
    so_luong: "",
    don_gia: "",
    so_hoa_don: "",
    ngay_hoa_don: new Date().toISOString().split("T")[0],
    ghi_chu: "",
  });

  // 1. Mở Modal & Load API
  useEffect(() => {
    const handler = () => {
        setIsOpen(true);
        fetchMasterData();
    };
    window.addEventListener("openCreateBatchModal", handler);
    return () => window.removeEventListener("openCreateBatchModal", handler);
  }, []);

  const fetchMasterData = async () => {
    try {
      const [resLoai, resNCC, resPhong] = await Promise.all([ // <-- LOAD THÊM PHÒNG
        axiosInstance.get("/api/loai_thiet_bi"),
        axiosInstance.get("/api/nha_cung_cap"),
        axiosInstance.get("/api/phong") 
      ]);

      setLoaiOptions((resLoai.data.result || resLoai.data || []).map(l => ({ value: l.maLoai, label: l.tenLoai })));
      setNccOptions((resNCC.data.result || resNCC.data || []).map(n => ({ value: n.maNhaCungCap, label: n.ten })));
     
      setPhongOptions((resPhong.data.result || resPhong.data || []).map(p => ({ value: p.maPhong, label: p.tenPhong })));

    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải danh mục");
    }
  };

  // 2. Submit
  const handleSubmit = async () => {
    // Validate cơ bản
    if (!form.ten_lo || !form.ma_loai || !form.so_luong || !form.don_gia) {
        return toast.error("Vui lòng nhập các trường bắt buộc (*)");
    }

    const payload = {
        ma_ctdx: null, 
        ten_lo: form.ten_lo,
        ma_loai: form.ma_loai,
        ma_ncc: form.ma_ncc,
        ma_phong: form.ma_phong, 
        so_luong: Number(form.so_luong),
        don_gia: Number(form.don_gia),
        so_hoa_don: form.so_hoa_don,
        ngay_hoa_don: form.ngay_hoa_don,
        ghi_chu: form.ghi_chu
    };
    console.log("Payload gửi đi:", payload);
    setLoading(true);
    try {
        await loThietBiService.create(payload);
        toast.success("Tạo lô & nhập kho thành công!");
        setIsOpen(false);
        // Reset form
        setForm({ ten_lo: "", ma_loai: null, ma_ncc: null, ma_phong: null, so_luong: "", don_gia: "", so_hoa_don: "", ngay_hoa_don: "", ghi_chu: "" });
        window.dispatchEvent(new Event("reloadBatchTable"));
    } catch (err) {
        toast.error(err.response?.data?.message || "Lỗi nhập kho");
    } finally {
        setLoading(false);
    }
  };

  // Tính tổng tiền realtime
  const totalValue = form.so_luong && form.don_gia
    ? (Number(form.so_luong) * Number(form.don_gia)).toLocaleString("vi-VN")
    : "0";

  // Helper cho React-Select
  const getValueObj = (options, val) => options.find(op => op.value === val);

  // Style
  const customStyles = {
    control: (base) => ({ ...base, borderColor: "#dee2e6", minHeight: "38px" }),
    menu: (base) => ({ ...base, zIndex: 1060 })
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white">
            <div>
              <h5 className="modal-title fw-bold">Nhập kho thủ công (Không qua đề xuất)</h5>
              <p className="mb-0 text-white-50 text-sm">Dùng cho nhập số dư đầu kỳ, hàng được tặng...</p>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
          </div>
          
          <div className="modal-body">
            <div className="row g-3">
              {/* Tên lô */}
              <div className="col-12">
                <label className="form-label fw-bold">Tên lô thiết bị <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="VD: Lô máy tính được VNPT tài trợ"
                  value={form.ten_lo} onChange={(e) => setForm({ ...form, ten_lo: e.target.value })} />
              </div>

              {/* Loại thiết bị */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Loại thiết bị <span className="text-danger">*</span></label>
                <Select 
                    options={loaiOptions}
                    value={getValueObj(loaiOptions, form.ma_loai)}
                    onChange={(opt) => setForm({ ...form, ma_loai: opt?.value })}
                    placeholder="-- Chọn loại --"
                    styles={customStyles}
                />
              </div>

              {/* Nhà cung cấp */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Nhà cung cấp / Nguồn gốc</label>
                <Select 
                    options={nccOptions}
                    value={getValueObj(nccOptions, form.ma_ncc)}
                    onChange={(opt) => setForm({ ...form, ma_ncc: opt?.value })}
                    placeholder="-- Chọn nhà cung cấp --"
                    styles={customStyles}
                />
              </div>
              
              {/* Phòng (Phân bổ dự kiến - Tùy chọn) */}
              <div className="col-12">
                <label className="form-label fw-bold d-flex align-items-center gap-1">
                    <MapPin size={16}/> Phòng dự kiến nhận (Tùy chọn)
                </label>
                <Select 
                    options={phongOptions}
                    value={getValueObj(phongOptions, form.ma_phong)}
                    onChange={(opt) => setForm({ ...form, ma_phong: opt?.value })}
                    placeholder="Chọn phòng..."
                    styles={customStyles}
                    isClearable
                />
                <p className="form-text text-muted mb-0">
                    * Nếu chọn phòng, thiết bị sẽ được nhập kho và phân bổ trực tiếp cho phòng này (trạng thái: Đang sử dụng). Nếu không chọn, thiết bị ở trạng thái "Sẵn sàng".
                </p>
              </div>

              {/* Số lượng & Giá */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Số lượng <span className="text-danger">*</span></label>
                <input type="number" className="form-control" placeholder="VD: 10"
                  value={form.so_luong} onChange={(e) => setForm({ ...form, so_luong: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Đơn giá (VNĐ) <span className="text-danger">*</span></label>
                <input type="number" className="form-control" placeholder="VD: 5000000"
                  value={form.don_gia} onChange={(e) => setForm({ ...form, don_gia: e.target.value })} />
              </div>

              {/* Hóa đơn */}
              <div className="col-md-6">
                <label className="form-label">Số hóa đơn / Chứng từ</label>
                <input type="text" className="form-control" placeholder="VD: HD-001"
                  value={form.so_hoa_don} onChange={(e) => setForm({ ...form, so_hoa_don: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Ngày chứng từ</label>
                <input type="date" className="form-control"
                  value={form.ngay_hoa_don} onChange={(e) => setForm({ ...form, ngay_hoa_don: e.target.value })} />
              </div>

              {/* Ghi chú */}
              <div className="col-12">
                <label className="form-label">Ghi chú / Cấu hình chi tiết</label>
                <textarea className="form-control" rows="2" placeholder="VD: Core i5, Ram 8GB..."
                  value={form.ghi_chu} onChange={(e) => setForm({ ...form, ghi_chu: e.target.value })}></textarea>
              </div>
            </div>

            {/* Checkbox Auto Generate */}
            <div className="border rounded p-3 bg-light mt-3">
              <div className="d-flex gap-3 align-items-start">
                <input type="checkbox" className="form-check-input mt-1" checked={autoGenerate} readOnly />
                <div>
                  <label className="form-check-label d-flex align-items-center gap-2 mb-1 fw-bold">
                    <Zap size={16} className="text-primary" />
                    <span>Tự động sinh mã tài sản</span>
                  </label>
                  <p className="text-sm text-muted mb-0">
                    Hệ thống sẽ tự động tạo {form.so_luong || "0"} thiết bị vào kho.
                  </p>
                </div>
              </div>
            </div>

            {/* Tổng tiền */}
            <div className="alert alert-primary d-flex justify-content-between align-items-center mt-3 mb-0">
                <span className="fw-bold">Tổng giá trị lô:</span>
                <span className="fs-5 fw-bold">{totalValue} đ</span>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={loading}>Hủy</button>
            <button className="btn btn-primary fw-bold" onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang xử lý..." : <><Save size={16} className="me-2" /> Lưu & Nhập kho</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}