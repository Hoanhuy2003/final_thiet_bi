import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { deXuatMuaService } from "../../services/deXuatMuaService";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function ProcurementCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State danh mục loại để chọn
  const [dsLoai, setDsLoai] = useState([]);

  const [form, setForm] = useState({
    tieuDe: "",
    noiDung: "",
    items: [{ maLoai: "", soLuong: 1, donGia: 0, lyDo: "" }]
  });

  useEffect(() => {
    // Lắng nghe sự kiện mở modal
    const handler = () => setIsOpen(true);
    window.addEventListener("openCreateProcurementModal", handler);
    
    // Load danh mục loại thiết bị
    const fetchLoai = async () => {
      try {
        const res = await axiosInstance.get("/api/loai_thiet_bi");
        setDsLoai(res.data.result || res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLoai();

    return () => window.removeEventListener("openCreateProcurementModal", handler);
  }, []);

  // Thay đổi thông tin chung
  const handleChangeInfo = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Thay đổi dòng chi tiết
  const handleChangeItem = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  // Thêm dòng
  const addItem = () => {
    setForm({ ...form, items: [...form.items, { maLoai: "", soLuong: 1, donGia: 0, lyDo: "" }] });
  };

  // Xóa dòng
  const removeItem = (index) => {
    if (form.items.length === 1) return;
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async () => {
    if (!form.tieuDe.trim()) return toast.error("Vui lòng nhập tiêu đề");
    
    // Validate chi tiết
    for (const item of form.items) {
        if (!item.maLoai) return toast.error("Vui lòng chọn loại thiết bị cho tất cả các dòng");
        if (item.soLuong <= 0) return toast.error("Số lượng phải lớn hơn 0");
    }

    setLoading(true);
    try {
      // Mapping dữ liệu theo chuẩn Backend yêu cầu
      const payload = {
        tieuDe: form.tieuDe,
        noiDung: form.noiDung,
        chiTietDeXuats: form.items.map(item => ({
            maLoai: item.maLoai,
            soLuong: Number(item.soLuong),
            donGia: Number(item.donGia),
            ghiChu: item.lyDo
        }))
      };

      await deXuatMuaService.create(payload);
      toast.success("Tạo đề xuất thành công!");
      setIsOpen(false);
      // Reset form
      setForm({ tieuDe: "", noiDung: "", items: [{ maLoai: "", soLuong: 1, donGia: 0, lyDo: "" }] });
      
      // Reload bảng dữ liệu (ở cả trang Admin hoặc Portal)
      window.dispatchEvent(new Event("procurementFilterChange"));

    } catch (err) {
      console.error(err);
      toast.error("Lỗi: " + (err.response?.data?.message || "Không thể tạo đề xuất"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Tạo đề xuất mua sắm mới</h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            {/* Thông tin chung */}
            <div className="mb-4">
                <label className="form-label fw-bold">Tiêu đề đề xuất <span className="text-danger">*</span></label>
                <input 
                    type="text" className="form-control mb-3" 
                    name="tieuDe" value={form.tieuDe} onChange={handleChangeInfo}
                    placeholder="Ví dụ: Mua sắm trang thiết bị cho HK2 2025" 
                />
                
                <label className="form-label fw-bold">Lý do / Nội dung chi tiết</label>
                <textarea 
                    className="form-control" rows="2" 
                    name="noiDung" value={form.noiDung} onChange={handleChangeInfo}
                    placeholder="Mô tả chi tiết mục đích mua sắm..."
                ></textarea>
            </div>

            {/* Danh sách thiết bị */}
            <label className="form-label fw-bold d-block">Danh sách thiết bị cần mua:</label>
            {form.items.map((item, index) => (
                <div key={index} className="row g-2 mb-2 align-items-end bg-light p-2 rounded border">
                    <div className="col-md-4">
                        <small className="text-muted">Loại thiết bị</small>
                        <select 
                            className="form-select form-select-sm"
                            value={item.maLoai}
                            onChange={(e) => handleChangeItem(index, 'maLoai', e.target.value)}
                        >
                            <option value="">-- Chọn --</option>
                            {dsLoai.map(l => (
                                <option key={l.maLoai} value={l.maLoai}>{l.tenLoai}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <small className="text-muted">Số lượng</small>
                        <input 
                            type="number" className="form-control form-control-sm"
                            value={item.soLuong} min="1"
                            onChange={(e) => handleChangeItem(index, 'soLuong', e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <small className="text-muted">Đơn giá dự kiến</small>
                        <input 
                            type="number" className="form-control form-control-sm"
                            value={item.donGia} min="0"
                            onChange={(e) => handleChangeItem(index, 'donGia', e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                         <small className="text-muted">Ghi chú</small>
                         <input 
                            type="text" className="form-control form-control-sm"
                            value={item.lyDo}
                            onChange={(e) => handleChangeItem(index, 'lyDo', e.target.value)}
                        />
                    </div>
                    <div className="col-md-1 text-end">
                        {form.items.length > 1 && (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(index)}>
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            ))}

            <button className="btn btn-sm btn-outline-primary mt-2" onClick={addItem}>
                <Plus size={16} className="me-1"/> Thêm dòng
            </button>

          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Đang gửi..." : <><Save size={18} className="me-2"/> Gửi đề xuất</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}