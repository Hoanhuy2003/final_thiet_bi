import { useState } from "react";
import { Plus, Download, Loader } from "lucide-react"; 
import { getUserRole } from "../../services/authService"; 
import { equipmentService } from "../../services/equipmentService"; 
import toast from "react-hot-toast";

export default function EquipmentHeader() {
  const role = getUserRole();
  const [exporting, setExporting] = useState(false);
  
  const canCreate = ['ADMIN', 'THUKHO', 'HCQT', 'VT001'].includes(role);

  const handleExport = async () => {
    try {
      setExporting(true);
      // Thông báo đang tải toàn bộ (vì file có thể lớn)
      toast.loading("Đang tổng hợp toàn bộ dữ liệu...", { id: "exportId" }); 

      // 1. GỌI API (Không cần truyền params nữa vì Backend lấy tất cả)
      const response = await equipmentService.exportExcel();

      // 2. TẠO FILE TẢI XUỐNG TỪ BLOB
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Đặt tên file (VD: FULL_DATA_ThietBi_2025-12-12.xlsx)
      const date = new Date().toISOString().slice(0, 10);
      link.setAttribute('download', `FULL_DATA_ThietBi_${date}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      
      // Dọn dẹp bộ nhớ
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Tải xuống thành công!", { id: "exportId" });

    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xuất file Excel.", { id: "exportId" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
      <div>
        <h3 className="mb-1 fw-bold">Quản lý thiết bị</h3>
        <p className="text-muted mb-0">Danh sách toàn bộ trang thiết bị trong hệ thống</p>
      </div>
      
      <div className="d-flex gap-2">
        {/* Nút Xuất Excel */}
        <button 
          className="btn btn-white border shadow-sm text-dark d-flex align-items-center"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? (
             <Loader size={18} className="me-2 animate-spin text-success" />
          ) : (
             <Download size={18} className="me-2 text-success" />
          )}
          {exporting ? "Đang tải..." : "Xuất Excel"}
        </button>

        {/* Nút Thêm mới */}
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