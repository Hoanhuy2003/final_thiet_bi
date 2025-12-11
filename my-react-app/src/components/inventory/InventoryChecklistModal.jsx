import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Save, Loader2, List } from "lucide-react";
import { inventoryService } from "../../services/inventoryService"; 
import toast from "react-hot-toast";

// Màu sắc cho các nút trạng thái
const STATUS_OPTS = {
  TOT: { label: "Tốt", color: "success", icon: CheckCircle },
  HONG: { label: "Hỏng", color: "warning", icon: AlertTriangle },
  MAT: { label: "Mất", color: "danger", icon: XCircle },
};

export default function InventoryChecklistModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. MỞ MODAL & LOAD DỮ LIỆU ---
  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("selectedInventorySession");
      if (data) {
        const parsedSession = JSON.parse(data);
        setSession(parsedSession);
        setIsOpen(true);
        // Load thiết bị theo Phòng của phiếu
        fetchEquipment(parsedSession.maPhong); 
      }
    };
    window.addEventListener("openChecklistModal", handler);
    return () => window.removeEventListener("openChecklistModal", handler);
  }, []);

  const fetchEquipment = async (maPhong) => {
      if (!maPhong) return;
      setLoading(true);
      try {
          // Gọi API lấy danh sách thiết bị trong phòng
          const devices = await inventoryService.getDevicesByRoom(maPhong);
          
          // Map dữ liệu chuẩn cho UI
          const formattedList = devices.map(item => ({
              maTB: item.maTB || item.maThietBi, // ID duy nhất
              tenTB: item.tenTB || item.tenThietBi,
              tinhTrangHeThong: item.tinhTrang || "Đang sử dụng", // Trạng thái cũ
              
              // Các trường phục vụ kiểm kê (Mặc định chưa kiểm)
              checked: false, 
              ketQuaKiemKe: null, // "Tốt", "Hỏng", "Mất"
              ghiChu: "" 
          }));
          
          setEquipmentList(formattedList);
      } catch (error) {
          console.error("Lỗi tải thiết bị:", error);
          toast.error("Không tải được danh sách thiết bị.");
      } finally {
          setLoading(false);
      }
  };

  // --- 2. XỬ LÝ CLICK CHỌN TRẠNG THÁI (FIXED) ---
  const handleSelectStatus = (maTB, statusKey) => {
    setEquipmentList(prevList => prevList.map(item => {
        if (item.maTB === maTB) {
            return {
                ...item,
                checked: true, // Đánh dấu đã kiểm
                ketQuaKiemKe: STATUS_OPTS[statusKey].label, // Lưu chữ "Tốt"/"Hỏng"
                ghiChu: statusKey === 'MAT' ? 'Không thấy tại phòng' : '' // Tự điền ghi chú nếu cần
            };
        }
        return item;
    }));
  };

  // Xử lý nhập ghi chú
  const handleNoteChange = (maTB, text) => {
    setEquipmentList(prev => prev.map(item => 
        item.maTB === maTB ? { ...item, ghiChu: text } : item
    ));
  };

  // --- 3. SUBMIT ---
  const handleSubmit = async () => {
        // Lọc ra những cái đã kiểm tra
        const checkedItems = equipmentList.filter(e => e.checked);
        
        if (checkedItems.length === 0) {
            return toast.error("Bạn chưa kiểm kê thiết bị nào!");
        }

        if (!window.confirm(`Bạn có chắc muốn lưu kết quả kiểm kê cho ${checkedItems.length} thiết bị?`)) return;

        setIsSubmitting(true);
        
        const payload = {
            ma_kiem_ke: session.maKiemKe,
            ma_nguoi_kiem_ke: session.maND || session.maNguoiKiemKe,
            chi_tiet: checkedItems.map(item => ({
                ma_tb: item.maTB,
                tinh_trang_thuc_te: item.ketQuaKiemKe, // "Tốt", "Hỏng",...
                ghi_chu: item.ghiChu
            }))
        };

        try {
            await inventoryService.submitChecklist(payload);
            toast.success("Đã lưu kết quả kiểm kê!");
            setIsOpen(false);
            window.dispatchEvent(new Event("reloadInventoryTable"));
        } catch (error) {
            console.error("Lỗi submit:", error);
            toast.error("Lỗi khi lưu. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
  };

  if (!isOpen || !session) return null;

  // Tính toán thống kê nhanh trên UI
  const countDaKiem = equipmentList.filter(e => e.checked).length;
  const countTot = equipmentList.filter(e => e.ketQuaKiemKe === "Tốt").length;
  const countHong = equipmentList.filter(e => e.ketQuaKiemKe === "Hỏng").length;
  const countMat = equipmentList.filter(e => e.ketQuaKiemKe === "Mất").length;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content h-100">
          
          {/* HEADER */}
          <div className="modal-header bg-white shadow-sm" style={{zIndex: 10}}>
            <div>
              <h5 className="modal-title fw-bold text-primary">
                <List className="me-2 d-inline-block" size={20}/>
                Kiểm kê: {session.tenPhong || "Phòng..."}
              </h5>
              <div className="d-flex gap-3 text-sm mt-1">
                 <span className="badge bg-light text-dark border">Tổng: {equipmentList.length}</span>
                 <span className="badge bg-success-subtle text-success border-success">Tốt: {countTot}</span>
                 <span className="badge bg-warning-subtle text-warning border-warning">Hỏng: {countHong}</span>
                 <span className="badge bg-danger-subtle text-danger border-danger">Mất: {countMat}</span>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          
          {/* BODY */}
          <div className="modal-body p-0 bg-light">
            {loading ? (
                <div className="text-center py-5">
                    <Loader2 className="animate-spin mx-auto text-primary" size={40} />
                    <p className="mt-2">Đang tải thiết bị...</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover table-striped align-middle mb-0 bg-white">
                        <thead className="table-light sticky-top" style={{top: 0, zIndex: 5}}>
                        <tr>
                            <th style={{width: "5%"}}>#</th>
                            <th style={{width: "15%"}}>Mã TS</th>
                            <th style={{width: "25%"}}>Tên thiết bị</th>
                            <th style={{width: "15%"}}>TT Hệ thống</th>
                            <th style={{width: "20%"}} className="text-center">Kết quả thực tế</th>
                            <th style={{width: "20%"}}>Ghi chú</th>
                        </tr>
                        </thead>
                        <tbody>
                        {equipmentList.map((eq, index) => (
                            <tr key={eq.maTB} className={eq.checked ? "" : "table-warning"}>
                                <td>{index + 1}</td>
                                <td className="fw-bold font-monospace text-primary">{eq.maTB}</td>
                                <td className="fw-medium">{eq.tenTB}</td>
                                <td>
                                    <span className="badge bg-secondary">{eq.tinhTrangHeThong}</span>
                                </td>
                                
                                {/* CỘT CHỌN TRẠNG THÁI */}
                                <td className="text-center">
                                    <div className="btn-group" role="group">
                                        {Object.keys(STATUS_OPTS).map(key => {
                                            const opt = STATUS_OPTS[key];
                                            const isSelected = eq.ketQuaKiemKe === opt.label;
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    className={`btn btn-sm ${isSelected ? `btn-${opt.color}` : 'btn-outline-secondary'}`}
                                                    onClick={() => handleSelectStatus(eq.maTB, key)}
                                                    title={opt.label}
                                                    style={{minWidth: "40px"}}
                                                >
                                                    <opt.icon size={16} />
                                                    {isSelected && <span className="ms-1 fw-bold">{opt.label}</span>}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </td>

                                {/* CỘT GHI CHÚ */}
                                <td>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-sm"
                                        placeholder="..."
                                        value={eq.ghiChu}
                                        onChange={(e) => handleNoteChange(eq.maTB, e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                        {equipmentList.length === 0 && (
                            <tr><td colSpan="6" className="text-center py-5 text-muted">Không có thiết bị nào trong phòng này.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
          
          {/* FOOTER */}
          <div className="modal-footer bg-white shadow-lg">
            <div className="me-auto text-muted small">
                * Vui lòng kiểm tra kỹ trước khi lưu.
            </div>
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>Đóng</button>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              disabled={countDaKiem === 0 || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
              Lưu kết quả ({countDaKiem})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}