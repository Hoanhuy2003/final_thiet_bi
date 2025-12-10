// src/components/equipment/EquipmentHeader.jsx
import { Plus, Download } from "lucide-react";
import { getUserRole } from "../../services/authService"; // Import check quyền
import toast from "react-hot-toast";

export default function EquipmentHeader() {
  const role = getUserRole();
  
  // Xác định quyền được phép thêm mới (Admin, Thủ kho, HCQT)
  // Bạn có thể điều chỉnh danh sách này tùy nghiệp vụ
  const canCreate = ['ADMIN', 'THUKHO', 'HCQT', 'VT001'].includes(role);

  const handleExport = () => {
    // Sau này bạn sẽ gọi API export ở đây
    toast.success("Đang xử lý xuất file Excel...");
  };

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
      <div>
        <h3 className="mb-1 fw-bold ">Quản lý thiết bị</h3>
        <p className="text-muted mb-0">Danh sách toàn bộ trang thiết bị trong hệ thống</p>
      </div>
      
      <div className="d-flex gap-2">
        <button 
          className="btn btn-white border shadow-sm text-dark d-flex align-items-center"
          onClick={handleExport}
        >
          <Download size={18} className="me-2 text-success" />
          Xuất Excel
        </button>

        {/* Chỉ hiển thị nút Thêm nếu đủ quyền */}
        {canCreate && (
          <button 
            className="btn btn-primary shadow-sm d-flex align-items-center" 
            onClick={() => window.dispatchEvent(new Event("openCreateEquipmentModal"))}
          >
            <Plus size={18} className="me-2" />
            Thêm thiết bị
          </button>
        )}
      </div>
    </div>
  );
}