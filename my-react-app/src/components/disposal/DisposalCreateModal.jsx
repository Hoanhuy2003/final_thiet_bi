import { useState, useEffect } from "react";
import { Plus, Trash2, Calculator } from "lucide-react";
import disposalService from "../../services/disposalService";
import { equipmentService } from "../../services/equipmentService";
import toast from "react-hot-toast";

export default function PhieuThanhLyCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [danhSachTB, setDanhSachTB] = useState([]);
  const [loadingTB, setLoadingTB] = useState(true);

  const [form, setForm] = useState({
    soPhieu: "",
    hinhThuc: "Bán thanh lý",
    lyDoThanhLy: "",
    ghiChu: "",
    chiTiet: [],
  });

  // Lấy danh sách thiết bị
  useEffect(() => {
    const loadThietBi = async () => {
      try {
        const data = await equipmentService.getAllAsList();
        const dataArray = data.result || data.data || data;
        const filtered = dataArray.filter(tb => 
          ["Đang sử dụng", "Hỏng hóc", "Bảo trì"].includes(tb.tinhTrang)
        );
        setDanhSachTB(filtered);
      } catch (err) {
        toast.error("Không tải được danh sách thiết bị");
      } finally {
        setLoadingTB(false);
      }
    };
    loadThietBi();
  }, []);

  // MỞ MODAL + TỰ ĐỘNG THÊM THIẾT BỊ TỪ BẢNG THIẾT BỊ
  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
      setForm(prev => ({
        ...prev,
        soPhieu: "", // để backend sinh
        hinhThuc: "Bán thanh lý",
        lyDoThanhLy: "",
        ghiChu: "",
        chiTiet: []
      }));

      // Kiểm tra có thiết bị được chọn từ bảng thiết bị không
      const selectedTBStr = localStorage.getItem("selectedThietBiForThanhLy");
      if (selectedTBStr) {
        const selectedTB = JSON.parse(selectedTBStr);
        themThietBi(selectedTB.maTB);
        localStorage.removeItem("selectedThietBiForThanhLy");
      }
    };

    window.addEventListener("openCreateThanhLyModal", handler);
    return () => window.removeEventListener("openCreateThanhLyModal", handler);
  }, [danhSachTB]); // thêm dependency để themThietBi dùng được danhSachTB

  // Thêm thiết bị
  const themThietBi = (maTB) => {
    const tb = danhSachTB.find(t => t.maTB === maTB);
    if (!tb) {
      toast.error("Thiết bị không tồn tại hoặc đã thanh lý");
      return;
    }
    if (form.chiTiet.some(ct => ct.maTB === maTB)) {
      toast.error("Thiết bị đã được chọn!");
      return;
    }
    setForm(prev => ({
      ...prev,
      chiTiet: [...prev.chiTiet, { 
        maTB: tb.maTB, 
        tenTB: tb.tenTB, 
        giaTriThuVe: 0, 
        lyDo: "" 
      }]
    }));
    toast.success(`Đã thêm ${tb.maTB} - ${tb.tenTB}`);
  };

  // Xóa thiết bị
  const xoaThietBi = (maTB) => {
    setForm(prev => ({
      ...prev,
      chiTiet: prev.chiTiet.filter(ct => ct.maTB !== maTB)
    }));
  };

  // Cập nhật chi tiết
  const capNhatChiTiet = (maTB, field, value) => {
    setForm(prev => ({
      ...prev,
      chiTiet: prev.chiTiet.map(ct =>
        ct.maTB === maTB 
          ? { ...ct, [field]: field === "giaTriThuVe" ? Number(value) || 0 : value } 
          : ct
      )
    }));
  };

  // Tính tổng
  const tongThuVe = form.chiTiet.reduce((sum, ct) => sum + (ct.giaTriThuVe || 0), 0);

  // Format ngày
  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (form.chiTiet.length === 0) return toast.error("Vui lòng chọn ít nhất 1 thiết bị!");
    if (!form.lyDoThanhLy.trim()) return toast.error("Vui lòng nhập lý do thanh lý!");

    const payload = {
      hinh_thuc: form.hinhThuc,
      ly_do_thanh_ly: form.lyDoThanhLy,
      ghi_chu: form.ghiChu || null,
      ngay_lap: formatDate(new Date()),
      ma_nguoi_tao: "ND001",
      ma_nguoi_duyet: null,
      trang_thai: "Chờ duyệt",
      chi_tiet: form.chiTiet.map(ct => ({
        ma_tb: ct.maTB,
        gia_tri_thu_ve: ct.giaTriThuVe,
        ly_do_thanh_ly: ct.lyDo || null,
        hinh_thuc_thanh_ly: form.hinhThuc
      }))
    };

    setLoading(true);
    try {
      await disposalService.create(payload);
      toast.success("Tạo phiếu thanh lý thành công!");
      setIsOpen(false);
      window.dispatchEvent(new Event("reloadThanhLyTable"));
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Lỗi: " + (err.response?.data?.message || "Kiểm tra console"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Plus size={20} />
              Tạo phiếu thanh lý mới
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)} disabled={loading} />
          </div>

          <div className="modal-body">
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Hình thức thanh lý *</label>
                <select className="form-select" value={form.hinhThuc} onChange={e => setForm({ ...form, hinhThuc: e.target.value })}>
                  <option value="Bán thanh lý">Bán thanh lý</option>
                  <option value="Tiêu hủy">Tiêu hủy</option>
                  <option value="Đấu giá">Đấu giá</option>
                  <option value="Tặng">Tặng</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Lý do thanh lý *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="VD: Thiết bị cũ, hết khấu hao, không còn sử dụng..."
                  value={form.lyDoThanhLy}
                  onChange={e => setForm({ ...form, lyDoThanhLy: e.target.value })}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Ghi chú</label>
                <textarea className="form-control" rows="2" value={form.ghiChu} onChange={e => setForm({ ...form, ghiChu: e.target.value })} />
              </div>
            </div>

            <div className="border rounded p-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">Danh sách thiết bị thanh lý ({form.chiTiet.length})</h6>
                <select
                  className="form-select w-auto"
                  onChange={(e) => { if (e.target.value) themThietBi(e.target.value); e.target.value = ""; }}
                  disabled={loadingTB}
                >
                  <option value="">+ Thêm thiết bị</option>
                  {danhSachTB.map(tb => (
                    <option key={tb.maTB} value={tb.maTB}>
                      {tb.maTB} - {tb.tenTB} ({tb.tinhTrang})
                    </option>
                  ))}
                </select>
              </div>

              {form.chiTiet.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  Chưa chọn thiết bị nào
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Mã TB</th>
                        <th>Tên thiết bị</th>
                        <th>Giá trị thu về</th>
                        <th>Lý do chi tiết</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.chiTiet.map(ct => (
                        <tr key={ct.maTB}>
                          <td className="fw-semibold">{ct.maTB}</td>
                          <td>{ct.tenTB}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={ct.giaTriThuVe}
                              onChange={e => capNhatChiTiet(ct.maTB, "giaTriThuVe", e.target.value)}
                              min="0"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={ct.lyDo}
                              onChange={e => capNhatChiTiet(ct.maTB, "lyDo", e.target.value)}
                              placeholder="VD: Hỏng đầu in"
                            />
                          </td>
                          <td>
                            <button className="btn btn-sm btn-link text-danger" onClick={() => xoaThietBi(ct.maTB)}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="text-end mt-3">
                <strong>Tổng thu về dự kiến: </strong>
                <span className="text-success fs-5 fw-bold">
                  {new Intl.NumberFormat("vi-VN").format(tongThuVe)} đ
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)} disabled={loading}>
              Hủy
            </button>
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSubmit} disabled={loading || form.chiTiet.length === 0}>
              <Calculator size={18} />
              {loading ? "Đang tạo..." : "Tạo phiếu thanh lý"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}