// src/components/inventory/InventoryChecklistModal.jsx
import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Save, Loader2, List, ClipboardList } from "lucide-react";
import { inventoryService } from "../../services/inventoryService"; 
import toast from "react-hot-toast";

// Cấu hình nút trạng thái
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
          const devices = await inventoryService.getDevicesByRoom(maPhong);
          
          // Map dữ liệu chuẩn cho UI
          const formattedList = devices.map(item => ({
              maTB: item.maTB || item.maThietBi,
              tenTB: item.tenTB || item.tenThietBi,
              tinhTrangHeThong: item.tinhTrang || "Đang sử dụng",
              
              // Mặc định là chưa kiểm tra
              checked: false, 
              ketQuaKiemKe: null, 
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

  // --- 2. XỬ LÝ CHỌN TRẠNG THÁI (CÓ TOGGLE) ---
  const handleSelectStatus = (maTB, statusKey) => {
    setEquipmentList(prevList => prevList.map(item => {
        if (item.maTB === maTB) {
            const clickedLabel = STATUS_OPTS[statusKey].label;
            
            // Nếu đang chọn cái này rồi mà bấm lại -> Bỏ chọn (Reset)
            const isSameStatus = item.ketQuaKiemKe === clickedLabel;

            return {
                ...item,
                checked: !isSameStatus, // Nếu trùng thì false, ngược lại true
                ketQuaKiemKe: isSameStatus ? null : clickedLabel,
                // Nếu chọn Mất -> Tự điền ghi chú, ngược lại giữ nguyên hoặc xóa nếu bỏ chọn
                ghiChu: (!isSameStatus && statusKey === 'MAT') ? 'Không thấy tại phòng' : item.ghiChu 
            };
        }
        return item;
    }));
  };

  const handleNoteChange = (maTB, text) => {
    setEquipmentList(prev => prev.map(item => 
        item.maTB === maTB ? { ...item, ghiChu: text } : item
    ));
  };

  // --- 3. SUBMIT ---
  const handleSubmit = async () => {
        const checkedItems = equipmentList.filter(e => e.checked);
        
        if (checkedItems.length === 0) {
            return toast.error("Bạn chưa kiểm kê thiết bị nào!");
        }

        // Logic nhắc nhở
        const remaining = equipmentList.length - checkedItems.length;
        const msg = remaining > 0 
            ? `Bạn đang lưu ${checkedItems.length} thiết bị. Còn ${remaining} thiết bị chưa kiểm.` 
            : `Xác nhận lưu kết quả cho toàn bộ ${checkedItems.length} thiết bị?`;

        if (!window.confirm(msg)) return;

        setIsSubmitting(true);
        
        const payload = {
            ma_kiem_ke: session.maKiemKe,
            ma_nguoi_kiem_ke: session.maND || session.maNguoiKiemKe,
            chi_tiet: checkedItems.map(item => ({
                ma_tb: item.maTB,
                tinh_trang_thuc_te: item.ketQuaKiemKe,
                ghi_chu: item.ghiChu
            }))
        };

        try {
            await inventoryService.submitChecklist(payload);
            toast.success("Đã lưu kết quả kiểm kê!");
            
            // Reload bảng bên ngoài
            window.dispatchEvent(new Event("reloadInventoryTable"));

            // UX Thông minh: Nếu đã kiểm hết thì đóng, chưa hết thì giữ nguyên để làm tiếp
            if (checkedItems.length === equipmentList.length) {
                setIsOpen(false);
            }
        } catch (error) {
            console.error("Lỗi submit:", error);
            toast.error("Lỗi khi lưu. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
  };

  if (!isOpen || !session) return null;

  // Thống kê nhanh
  const countDaKiem = equipmentList.filter(e => e.checked).length;
  const countTot = equipmentList.filter(e => e.ketQuaKiemKe === "Tốt").length;
  const countHong = equipmentList.filter(e => e.ketQuaKiemKe === "Hỏng").length;
  const countMat = equipmentList.filter(e => e.ketQuaKiemKe === "Mất").length;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content h-100">
          
          {/* HEADER */}
          <div className="modal-header bg-white shadow-sm py-2" style={{zIndex: 10}}>
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-center">
                  <h5 className="modal-title fw-bold text-primary d-flex align-items-center">
                    <ClipboardList className="me-2" size={20}/>
                    {session.tenPhong || "Kiểm kê phòng"}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
              </div>
              
              {/* Thanh thống kê */}
              <div className="d-flex gap-2 text-sm mt-2 pt-2 border-top">
                 <span className="badge bg-light text-dark border">Tổng: {equipmentList.length}</span>
                 <span className="badge bg-secondary text-white">Đã kiểm: {countDaKiem}</span>
                 <div className="vr mx-1"></div>
                 <span className="badge bg-success-subtle text-success border-success">Tốt: {countTot}</span>
                 <span className="badge bg-warning-subtle text-warning border-warning">Hỏng: {countHong}</span>
                 <span className="badge bg-danger-subtle text-danger border-danger">Mất: {countMat}</span>
              </div>
            </div>
          </div>
          
          {/* BODY */}
          <div className="modal-body p-0 bg-light">
            {loading ? (
                <div className="text-center py-5">
                    <Loader2 className="animate-spin mx-auto text-primary" size={40} />
                    <p className="mt-2 text-muted">Đang tải danh sách thiết bị...</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover table-striped align-middle mb-0 bg-white">
                        <thead className="table-light sticky-top" style={{top: 0, zIndex: 5}}>
                        <tr>
                            <th style={{width: "5%"}} className="text-center bg-light">#</th>
                            <th style={{width: "15%"}} className="bg-light">Mã TS</th>
                            <th style={{width: "25%"}} className="bg-light">Tên thiết bị</th>
                            <th style={{width: "15%"}} className="bg-light">TT Hệ thống</th>
                            <th style={{width: "20%"}} className="text-center bg-light">Kết quả thực tế</th>
                            <th style={{width: "20%"}} className="bg-light">Ghi chú</th>
                        </tr>
                        </thead>
                        <tbody>
                        {equipmentList.map((eq, index) => (
                            <tr key={eq.maTB} className={eq.checked ? "" : "table-warning"}>
                                <td className="text-center">{index + 1}</td>
                                <td className="fw-bold font-monospace text-primary">{eq.maTB}</td>
                                <td className="fw-medium">{eq.tenTB}</td>
                                <td>
                                    <span className="badge bg-secondary opacity-75">{eq.tinhTrangHeThong}</span>
                                </td>
                                
                                {/* CỘT CHỌN TRẠNG THÁI */}
                                <td className="text-center">
                                    <div className="btn-group shadow-sm" role="group">
                                        {Object.keys(STATUS_OPTS).map(key => {
                                            const opt = STATUS_OPTS[key];
                                            const isSelected = eq.ketQuaKiemKe === opt.label;
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    className={`btn btn-sm ${isSelected ? `btn-${opt.color}` : 'btn-outline-secondary bg-white'}`}
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
                                        placeholder={eq.ketQuaKiemKe === "Mất" ? "Lý do mất..." : "..."}
                                        value={eq.ghiChu}
                                        onChange={(e) => handleNoteChange(eq.maTB, e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                        {equipmentList.length === 0 && (
                            <tr><td colSpan="6" className="text-center py-5 text-muted">Phòng này hiện chưa có thiết bị nào.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
          
          {/* FOOTER */}
          <div className="modal-footer bg-white shadow-lg py-2">
            <div className="me-auto text-muted small fst-italic">
                {countDaKiem < equipmentList.length 
                    ? `⚠️ Còn ${equipmentList.length - countDaKiem} thiết bị chưa kiểm tra.` 
                    : "✅ Đã kiểm tra toàn bộ thiết bị."}
            </div>
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>Đóng</button>
            <button
              className="btn btn-primary d-flex align-items-center gap-2 px-4"
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