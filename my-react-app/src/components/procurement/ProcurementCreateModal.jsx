import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Save, ShoppingCart } from "lucide-react";
import { deXuatMuaService } from "../../services/deXuatMuaService";
import axiosInstance from "../../api/axiosInstance";
import Select from "react-select"; 
import toast from "react-hot-toast";
import { getUserId } from "../../services/authService"; 

export default function ProcurementCreateModal() {
  const currentUserId = getUserId(); 
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State danh mục
  const [loaiOptions, setLoaiOptions] = useState([]);
  const [phongOptions, setPhongOptions] = useState([]); 

  const [form, setForm] = useState({
    tieuDe: "",
    noiDung: "",
    maPhong: null, 
    items: [{ maLoai: null, soLuong: 1, donGia: 0, ghiChu: "" }] 
  });

  // Tính tổng giá trị dự kiến của đề xuất
  const totalValue = useMemo(() => {
    return form.items.reduce((sum, item) => {
        const quantity = Number(item.soLuong) || 0;
        const price = Number(item.donGia) || 0;
        return sum + (quantity * price);
    }, 0);
  }, [form.items]);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openCreateProcurementModal", handler);
    
    const fetchMasterData = async () => {
      try {
        const [resLoai, resPhong] = await Promise.all([
          axiosInstance.get("/api/loai_thiet_bi"),
          axiosInstance.get("/api/phong")
        ]);
        
        const rawLoai = resLoai.data.result || resLoai.data || [];
        const rawPhong = resPhong.data.result || resPhong.data || [];
        
        setLoaiOptions(rawLoai.map(l => ({ value: l.maLoai, label: l.tenLoai })));
        setPhongOptions(rawPhong.map(p => ({ value: p.maPhong, label: p.tenPhong })));
      } catch (err) {
        console.error(err);
      }
    };
    fetchMasterData();

    return () => window.removeEventListener("openCreateProcurementModal", handler);
  }, []);

  // Thay đổi thông tin chung (dùng cho input thường)
  const handleChangeInfo = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  // Thay đổi Select thông tin chung (phòng)
  const handleSelectInfo = (name, value) => {
      setForm({ ...form, [name]: value });
  };

  // Thay đổi dòng chi tiết
  const handleChangeItem = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  // Thêm dòng
  const addItem = () => {
    setForm({ ...form, items: [...form.items, { maLoai: null, soLuong: 1, donGia: 0, ghiChu: "" }] });
  };

  // Xóa dòng
  const removeItem = (index) => {
    if (form.items.length === 1) return;
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async () => {
    if (!currentUserId) return toast.error("Lỗi xác thực người dùng. Vui lòng đăng nhập lại."); 
    if (!form.tieuDe.trim()) return toast.error("Vui lòng nhập tiêu đề");
    if (!form.maPhong) return toast.error("Vui lòng chọn phòng/đơn vị yêu cầu");
    
    // Validate chi tiết
    for (const item of form.items) {
        if (!item.maLoai) return toast.error("Vui lòng chọn loại thiết bị cho tất cả các dòng");
        if (Number(item.soLuong) <= 0) return toast.error("Số lượng phải lớn hơn 0");
    }

    setLoading(true);
    try {
      // MAPPING DỮ LIỆU SANG SNAKE_CASE ĐỂ KHỚP VỚI DTO CỦA BẠN
      const payload = {
            // Sửa: tieuDe -> tieu_de, noiDung -> noi_dung
            "tieu_de": form.tieuDe.trim(),
            "noi_dung": form.noiDung,
            "ma_nd": currentUserId, // Giữ nguyên
            "ma_phong": form.maPhong, // Sửa: maPhong -> ma_phong
            
            // Sửa: chiTietDeXuats -> chi_tiet
            "chi_tiet": form.items.map(item => ({
                "ma_loai": item.maLoai,
                "so_luong": Number(item.soLuong), 
                "don_gia": Number(item.donGia),
                "ghi_chu": item.ghiChu // Đã đồng bộ với ChiTietDeXuatMuaDto
            }))
        };

      await deXuatMuaService.create(payload);
      toast.success("Đề xuất đã được gửi thành công, chờ phê duyệt!");
      setIsOpen(false);
      
      // Reset form
      setForm({ tieuDe: "", noiDung: "", maPhong: null, items: [{ maLoai: null, soLuong: 1, donGia: 0, ghiChu: "" }] });
      
      // Reload bảng dữ liệu
      window.dispatchEvent(new Event("procurementFilterChange"));

    } catch (err) {
      console.error(err);
      toast.error("Lỗi: " + (err.response?.data?.message || "Không thể tạo đề xuất"));
    } finally {
      setLoading(false);
    }
  };
  
  // Helper cho React-Select
  const getValueObj = (options, val) => options.find(op => String(op.value) === String(val)) || null;

  const customStyles = {
    control: (base) => ({ ...base, minHeight: "30px" }),
    menu: (base) => ({ ...base, zIndex: 1060 })
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
                <ShoppingCart size={20} /> Tạo đề xuất mua sắm mới
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            {/* Thông tin chung */}
            <div className="mb-4 row g-3">
                <div className="col-12">
                    <label className="form-label fw-bold">Tiêu đề đề xuất <span className="text-danger">*</span></label>
                    <input 
                        type="text" className="form-control" 
                        name="tieuDe" value={form.tieuDe} onChange={handleChangeInfo}
                        placeholder="Ví dụ: Mua sắm trang thiết bị cho HK2 2025" 
                    />
                </div>
                
                <div className="col-md-8">
                    <label className="form-label fw-bold">Lý do / Nội dung chi tiết</label>
                    <textarea 
                        className="form-control" rows="2" 
                        name="noiDung" value={form.noiDung} onChange={handleChangeInfo}
                        placeholder="Mô tả chi tiết mục đích mua sắm..."
                    ></textarea>
                </div>
                
                {/* Phòng yêu cầu (Select) */}
                <div className="col-md-4">
                    <label className="form-label fw-bold">Phòng yêu cầu <span className="text-danger">*</span></label>
                    <Select
                        options={phongOptions}
                        value={getValueObj(phongOptions, form.maPhong)}
                        onChange={(opt) => handleSelectInfo('maPhong', opt?.value)}
                        placeholder="Chọn phòng..."
                        styles={customStyles}
                        isClearable
                    />
                </div>
            </div>

            {/* Danh sách thiết bị */}
            <label className="form-label fw-bold d-block mb-2 border-top pt-3">Danh sách thiết bị cần mua:</label>
            
            <div style={{maxHeight: '350px', overflowY: 'auto', paddingRight: '5px'}}>
                {form.items.map((item, index) => (
                    <div key={index} className="row g-2 mb-2 align-items-center bg-light p-2 rounded border">
                        <div className="col-md-4">
                            <small className="text-muted d-block">Loại thiết bị</small>
                            <Select 
                                options={loaiOptions}
                                value={getValueObj(loaiOptions, item.maLoai)}
                                onChange={(opt) => handleChangeItem(index, 'maLoai', opt?.value)}
                                placeholder="-- Chọn --"
                                styles={customStyles}
                            />
                        </div>
                        <div className="col-md-2">
                            <small className="text-muted d-block">Số lượng</small>
                            <input 
                                type="number" className="form-control form-control-sm"
                                value={item.soLuong} min="1"
                                onChange={(e) => handleChangeItem(index, 'soLuong', e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <small className="text-muted d-block">Đơn giá (dự kiến)</small>
                            <input 
                                type="number" className="form-control form-control-sm"
                                value={item.donGia} min="0"
                                onChange={(e) => handleChangeItem(index, 'donGia', e.target.value)}
                            />
                            <div className="small text-muted text-end">
                                {Number(item.soLuong) * Number(item.donGia) > 0 ? (Number(item.soLuong) * Number(item.donGia)).toLocaleString("vi-VN") + 'đ' : ''}
                            </div>
                        </div>
                        <div className="col-md-2">
                             <small className="text-muted d-block">Ghi chú (Cấu hình)</small>
                            <input 
                                type="text" className="form-control form-control-sm"
                                value={item.ghiChu}
                                onChange={(e) => handleChangeItem(index, 'ghiChu', e.target.value)}
                                placeholder="VD: Core i7, RAM 16GB"
                            />
                        </div>
                        <div className="col-md-1 text-end">
                            {form.items.length > 1 && (
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeItem(index)}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button type="button" className="btn btn-sm btn-outline-primary mt-3" onClick={addItem}>
                <Plus size={16} className="me-1"/> Thêm dòng
            </button>
            
            {/* Tổng giá trị */}
            <div className="alert alert-info mt-3 mb-0 d-flex justify-content-between">
                <span className="fw-bold">Tổng giá trị dự kiến:</span>
                <span className="fw-bold text-primary">{totalValue.toLocaleString("vi-VN")}đ</span>
            </div>

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