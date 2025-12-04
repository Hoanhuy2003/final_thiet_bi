import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const mockEquipmentInRoom = [
  { id: 1, ma_tai_san: "TB-2024-001", ten_thiet_bi: "Máy tính Dell Latitude 5420", trang_thai_hien_tai: "Đang sử dụng", checked: false, trang_thai_kiem_ke: null, ghi_chu: "" },
  { id: 2, ma_tai_san: "TB-2024-002", ten_thiet_bi: "Màn hình LG 24 inch", trang_thai_hien_tai: "Đang sử dụng", checked: false, trang_thai_kiem_ke: null, ghi_chu: "" },
  { id: 3, ma_tai_san: "TB-2024-003", ten_thiet_bi: "Bàn làm việc", trang_thai_hien_tai: "Đang sử dụng", checked: false, trang_thai_kiem_ke: null, ghi_chu: "" },
  { id: 4, ma_tai_san: "TB-2024-004", ten_thiet_bi: "Ghế xoay văn phòng", trang_thai_hien_tai: "Đang sử dụng", checked: false, trang_thai_kiem_ke: null, ghi_chu: "" },
];

const inventoryStatusColors = {
  "Tốt": "badge-success",
  "Hỏng": "badge-warning",
  "Mất": "badge-danger",
};

export default function InventoryChecklistModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [equipmentList, setEquipmentList] = useState(mockEquipmentInRoom);

  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("selectedInventorySession");
      if (data) {
        setSession(JSON.parse(data));
        setEquipmentList(mockEquipmentInRoom.map(item => ({ ...item, checked: false, trang_thai_kiem_ke: null })));
        setIsOpen(true);
      }
    };
    window.addEventListener("openChecklistModal", handler);
    return () => window.removeEventListener("openChecklistModal", handler);
  }, []);

  const handleCheck = (id, status, note = "") => {
    setEquipmentList(prev => prev.map(item =>
      item.id === id ? { ...item, checked: true, trang_thai_kiem_ke: status, ghi_chu: note } : item
    ));
  };

  const checkedCount = equipmentList.filter(e => e.checked).length;
  const progress = (checkedCount / equipmentList.length) * 100;

  if (!isOpen || !session) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxHeight: "90vh" }}>
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Kiểm kê - {session.phong}</h5>
              <p className="text-muted mb-0 text-sm">Đánh dấu trạng thái cho từng thiết bị</p>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <div className="d-flex justify-content-between text-sm mb-2">
                <span>Tiến độ kiểm kê</span>
                <span>{checkedCount}/{equipmentList.length} thiết bị</span>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="border rounded" style={{ maxHeight: "384px", overflowY: "auto" }}>
              <table className="table table-sm mb-0">
                <thead>
                  <tr>
                    <th style={{ width: "48px" }}><input type="checkbox" className="form-check-input" /></th>
                    <th>Mã tài sản</th>
                    <th>Tên thiết bị</th>
                    <th>Trạng thái hiện tại</th>
                    <th>Kết quả kiểm kê</th>
                    <th className="text-end">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentList.map((eq) => (
                    <tr key={eq.id} className={eq.checked ? "table-active" : ""}>
                      <td><input type="checkbox" className="form-check-input" checked={eq.checked} readOnly /></td>
                      <td className="font-medium">{eq.ma_tai_san}</td>
                      <td>{eq.ten_thiet_bi}</td>
                      <td>{eq.trang_thai_hien_tai}</td>
                      <td>
                        {eq.trang_thai_kiem_ke ? (
                          <span className={`badge ${inventoryStatusColors[eq.trang_thai_kiem_ke]}`}>
                            {eq.trang_thai_kiem_ke}
                          </span>
                        ) : (
                          <span className="text-muted text-sm">Chưa kiểm tra</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <button className="btn btn-sm btn-link p-1" onClick={() => handleCheck(eq.id, "Tốt")} disabled={eq.checked}>
                            <CheckCircle size={16} style={{ color: "#10b981" }} />
                          </button>
                          <button className="btn btn-sm btn-link p-1" onClick={() => handleCheck(eq.id, "Hỏng", "Cần sửa chữa")} disabled={eq.checked}>
                            <AlertTriangle size={16} style={{ color: "#f59e0b" }} />
                          </button>
                          <button className="btn btn-sm btn-link p-1" onClick={() => handleCheck(eq.id, "Mất", "Không tìm thấy")} disabled={eq.checked}>
                            <XCircle size={16} style={{ color: "#dc2626" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Lưu tạm</button>
            <button
              className="btn btn-primary"
              disabled={checkedCount < equipmentList.length}
              onClick={() => setIsOpen(false)}
            >
              <CheckCircle size={16} className="me-2" />
              Hoàn thành kiểm kê
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}