import { useState, useEffect } from "react";
import { Edit, Building2 } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";

import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function EquipmentEditModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [equipmentId, setEquipmentId] = useState(null);
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


  // ==================== 1. LOAD DANH MỤC (CHẠY 1 LẦN) ====================
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resLoai, resPhong] = await Promise.all([
          axiosInstance.get("/api/loai_thiet_bi"),
          axiosInstance.get("/api/phong"),
        ]);
        
        // Lưu ý: Kiểm tra xem API trả về .data hay .data.result
        setDsLoai(resLoai.data.result || resLoai.data || []);
        setDsPhong(resPhong.data.result || resPhong.data || []);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
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
        setEquipmentId(eq.maTB); // Lưu lại ID để fetch dữ liệu mới nhất
        setIsOpen(true);
      }
    };
    window.addEventListener("openEditEquipmentModal", handler);
    return () => window.removeEventListener("openEditEquipmentModal", handler);
  }, []);


  // ==================== 3. FETCH DỮ LIỆU & FILL FORM (QUAN TRỌNG) ====================
  useEffect(() => {
    // Chỉ chạy khi Modal mở + Có ID + Đã có danh mục để đối chiếu
    if (isOpen && equipmentId && dsLoai.length > 0 && dsPhong.length > 0) {
      loadDetailAndFill();
    }
  }, [isOpen, equipmentId, dsLoai, dsPhong]);

  const loadDetailAndFill = async () => {
    setLoading(true);
    try {
      // Gọi API lấy thông tin chi tiết thiết bị
      const res = await equipmentService.getById(equipmentId);
      const eq = res.data?.result || res.data || res; // Lấy data an toàn

      console.log("Dữ liệu cần sửa (Gốc):", eq);

      // --- LOGIC TÌM MÃ TỪ TÊN (REVERSE LOOKUP) ---
      // Vì data của bạn trả về Tên ("Lab Java") nhưng Select cần Mã ("P002")
      
      // 1. Xử lý Mã Loại
      let targetMaLoai = "";
      if (eq.maLoai) {
         targetMaLoai = eq.maLoai; // Nếu có mã sẵn thì dùng luôn
      } else if (eq.loai) {
         // Nếu chỉ có tên -> Tìm trong danh sách loại xem tên này ứng với mã nào
         const found = dsLoai.find(l => l.tenLoai === eq.loai || l.tenLoai === eq.loaiThietBi?.tenLoai);
         if (found) targetMaLoai = found.maLoai;
      }

      // 2. Xử lý Mã Phòng
      let targetMaPhong = "";
      if (eq.maPhong) {
         targetMaPhong = eq.maPhong;
      } else if (eq.phong) {
         // Tìm trong danh sách phòng xem tên này ứng với mã nào
         // So sánh cả trường hợp eq.phong là String hoặc Object
         const found = dsPhong.find(p => 
            p.tenPhong === eq.phong || 
            p.tenPhong === eq.phong?.tenPhong
         );
         if (found) targetMaPhong = found.maPhong;
      }

      console.log(`Mapping: "${eq.phong}" -> Mã: "${targetMaPhong}"`);

      // 3. Điền vào Form
      setForm({
        tenTB: eq.tenTB || "",
        maLoai: targetMaLoai,
        maLo: null, // Lô thường không sửa ở đây
        maPhong: targetMaPhong,
        tinhTrang: eq.tinhTrang || "Đang sử dụng",
        giaTriBanDau: eq.giaTriBanDau || 0,
        giaTriHienTai: eq.giaTriHienTai || 0,
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
    // Validate
    if (!form.tenTB.trim()) return toast.error("Vui lòng nhập tên thiết bị");
    if (!form.maLoai) return toast.error("Vui lòng chọn loại thiết bị");
    if (!form.maPhong) return toast.error("Vui lòng chọn phòng");

    setLoading(true);

    const payload = {
      ten_tb: form.tenTB.trim(),
      ma_loai: form.maLoai,
      ma_lo: form.maLo || null,
      ma_phong: form.maPhong,
      tinh_trang: form.tinhTrang,

      gia_tri_ban_dau: Number(form.giaTriBanDau),
      gia_tri_hien_tai: Number(form.giaTriHienTai),
    };

    try {
      await equipmentService.update(equipmentId, payload);
      toast.success("Cập nhật thành công!");
      setIsOpen(false);
      window.dispatchEvent(new Event("equipmentFilterChange")); // Reload bảng
    } catch (err) {

      console.error("Lỗi update:", err);
      toast.error("Lỗi: " + (err.response?.data?.message || err.message));
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
            <h5 className="modal-title">Chỉnh sửa thiết bị: {equipmentId}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
          </div>
          
          <div className="modal-body">
            {loading && !form.tenTB ? (
               <div className="text-center py-4"><div className="spinner-border text-primary"></div><p>Đang tải dữ liệu...</p></div>
            ) : (
              <div className="row g-3">
                {/* Tên TB */}
                <div className="col-md-8">
                  <label className="form-label fw-bold">Tên thiết bị</label>
                  <input 
                    className="form-control" 
                    value={form.tenTB} 
                    onChange={e => setForm({...form, tenTB: e.target.value})} 
                  />
                </div>

                {/* Loại TB */}
                <div className="col-md-4">
                  <label className="form-label fw-bold">Loại thiết bị</label>
                  <select 
                    className="form-select" 
                    value={form.maLoai} 
                    onChange={e => setForm({...form, maLoai: e.target.value})}
                  >
                    <option value="">-- Chọn loại --</option>
                    {dsLoai.map(item => (
                      <option key={item.maLoai} value={item.maLoai}>{item.tenLoai}</option>
                    ))}
                  </select>
                </div>

                {/* Phòng */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Phòng / Vị trí</label>
                  <select 
                    className="form-select" 
                    value={form.maPhong} 
                    onChange={e => setForm({...form, maPhong: e.target.value})}
                  >
                    <option value="">-- Chọn phòng --</option>
                    {dsPhong.map(item => (
                      <option key={item.maPhong} value={item.maPhong}>{item.tenPhong}</option>
                    ))}
                  </select>
                </div>

                {/* Trạng thái */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Trạng thái</label>
                  <select 
                    className="form-select" 
                    value={form.tinhTrang} 
                    onChange={e => setForm({...form, tinhTrang: e.target.value})}
                  >
                    <option value="Đang sử dụng">Đang sử dụng</option>
                    <option value="Bảo trì">Bảo trì</option>
                    <option value="Hỏng hóc">Hỏng hóc</option>
                    <option value="Chờ thanh lý">Chờ thanh lý</option>
                    <option value="Đã thanh lý">Đã thanh lý</option>
                  </select>
                </div>

                {/* Giá trị */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nguyên giá (VNĐ)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={form.giaTriBanDau} 
                    onChange={e => setForm({...form, giaTriBanDau: e.target.value})} 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Giá trị hiện tại (VNĐ)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={form.giaTriHienTai} 
                    onChange={e => setForm({...form, giaTriHienTai: e.target.value})} 
                  />
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