import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { loThietBiService } from "../../services/batchService"; 
import axiosInstance from "../../api/axiosInstance"; 
import toast from "react-hot-toast"; 

export default function ImportBatchModal() {
    // 1. STATE (Khai báo biến)
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Thêm loading state
    const [dsNhaCungCap, setDsNhaCungCap] = useState([]);
    
    const [form, setForm] = useState({
        maCTDX: "",
        tenLo: "",
        soLuong: 1,
        donGia: 0,
        soHoaDon: "",
        ngayHoaDon: new Date().toISOString().split('T')[0],
        maNhaCungCap: "",
        ghiChu: ""
    });

    // 2. EFFECT (Khi mở Modal)
    useEffect(() => {
        const handleOpen = async () => {
            const data = localStorage.getItem("importBatchData");
            if (data) {
                const parsed = JSON.parse(data);
                
                setForm(prev => ({
                    ...prev,
                    maCTDX: parsed.maCTDX,
                    tenLo: parsed.tenLo,
                    soLuong: parsed.soLuong, 
                    donGia: parsed.donGia, 
                    soHoaDon: "",
                    maNhaCungCap: "",
                    ghiChu: parsed.ghiChu
                }));
                setIsOpen(true);

                // Load danh sách Nhà Cung Cấp
                try {
                    const res = await axiosInstance.get("/api/nha_cung_cap");
                    const listNCC = res.data?.result || res.data || [];
                    setDsNhaCungCap(Array.isArray(listNCC) ? listNCC : []);
                } catch (err) {
                    console.error("Lỗi tải NCC:", err);
                }
            }
        };

        window.addEventListener("openImportBatchModal", handleOpen);
        return () => window.removeEventListener("openImportBatchModal", handleOpen);
    }, []);

    // 3. LOGIC XỬ LÝ (Handle)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (form.soLuong <= 0) return toast.error("Số lượng phải > 0");
        if (!form.maNhaCungCap) return toast.error("Chưa chọn Nhà cung cấp");

        const payload = {
            ma_ctdx: form.maCTDX, 
            ten_lo: form.tenLo, 
            so_luong: Number(form.soLuong), 
            don_gia: Number(form.donGia), 
            so_hoa_don: form.soHoaDon, 
            ngay_hoa_don: form.ngayHoaDon, 
            ma_ncc: form.maNhaCungCap, 
            ghi_chu: form.ghiChu.trim() || null 
        };

        setLoading(true);
        try {
            await loThietBiService.create(payload);
            toast.success("Nhập kho thành công!");
            
            // QUAN TRỌNG: Phát sự kiện trước khi đóng modal để đảm bảo các listener bắt được
            window.dispatchEvent(new Event("reloadBatchTable")); 
            
            // Đóng modal sau
            setIsOpen(false);
            
        } catch (err) {
            console.error("Lỗi nhập kho:", err);
            const serverMessage = err.response?.data?.message;
            
            if (serverMessage) {
                if (serverMessage.includes("quá số lượng")) {
                    toast.error(`❌ Lỗi: ${serverMessage}`);
                } else {
                    toast.error(`⚠️ ${serverMessage}`);
                }
            } else {
                toast.error("Có lỗi xảy ra khi nhập kho. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    
    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow-lg">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title fw-bold">Xác nhận Nhập kho</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)} disabled={loading}></button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* ... (Các trường input giữ nguyên như cũ) ... */}
                            {/* Copy lại phần render form từ code cũ của bạn */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Tên lô hàng</label>
                                <input type="text" className="form-control" name="tenLo" value={form.tenLo} onChange={handleChange} required disabled={loading} />
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold text-success">Số lượng thực</label>
                                    <input type="number" className="form-control fw-bold" name="soLuong" value={form.soLuong} onChange={handleChange} min="1" required disabled={loading} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold text-success">Đơn giá (VNĐ)</label>
                                    <input type="number" className="form-control fw-bold" name="donGia" value={form.donGia} onChange={handleChange} min="0" required disabled={loading} />
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Số hóa đơn <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" name="soHoaDon" value={form.soHoaDon} onChange={handleChange} required disabled={loading} placeholder="VD: HD00123" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Ngày hóa đơn</label>
                                    <input type="date" className="form-control" name="ngayHoaDon" value={form.ngayHoaDon} onChange={handleChange} required disabled={loading} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Nhà cung cấp <span className="text-danger">*</span></label>
                                <select className="form-select" name="maNhaCungCap" value={form.maNhaCungCap} onChange={handleChange} required disabled={loading}>
                                    <option value="">-- Chọn nhà cung cấp --</option>
                                    {dsNhaCungCap.map(ncc => (
                                        <option key={ncc.maNhaCungCap} value={ncc.maNhaCungCap}>{ncc.ten}</option> 
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Thông số kỹ thuật/Ghi chú</label>
                                <textarea className="form-control" name="ghiChu" rows="2" value={form.ghiChu} onChange={handleChange} placeholder="VD: Core i7..." disabled={loading}></textarea>
                            </div>
                        </div>

                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={loading}>Hủy</button>
                            <button type="submit" className="btn btn-primary fw-bold" disabled={loading}> 
                                {loading ? "Đang xử lý..." : <><Save size={16} className="me-1"/> Lưu & Tạo Tài Sản</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}