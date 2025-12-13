import { useState } from "react";
// 1. Thêm icon Download và Loader
import { Plus, Download, Loader } from "lucide-react";
import { getUserRole } from "../../services/authService";
// 2. Import Service
import { inventoryService } from "../../services/inventoryService"; 
import toast from "react-hot-toast";

export default function InventoryHeader() {
  const role = getUserRole();
  const canCreate = ["ADMIN"].includes(role);
  
  // State quản lý trạng thái loading của nút in
  const [exporting, setExporting] = useState(false);

  // --- HÀM GIẢI MÃ BASE64 THÀNH FILE (Bắt buộc vì Backend trả về ApiResponse) ---
  const base64ToBlob = (base64Data, contentType) => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  // --- HÀM XỬ LÝ CLICK NÚT XUẤT EXCEL ---
  const handleExport = async () => {
    try {
      setExporting(true);
      toast.loading("Đang xuất dữ liệu kiểm kê...", { id: "exportInventory" });

      // 1. Gọi API
      const apiResponse = await inventoryService.exportExcel();

      // 2. Kiểm tra kết quả trả về (apiResponse.result chứa chuỗi Base64)
      if (apiResponse && apiResponse.result) {
        
        // 3. Chuyển đổi Base64 sang Blob
        const blob = base64ToBlob(
          apiResponse.result,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        // 4. Tạo link tải xuống
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Đặt tên file: Danh_sach_kiem_ke_YYYY-MM-DD.xlsx
        const date = new Date().toISOString().slice(0, 10);
        link.setAttribute('download', `Danh_sach_kiem_ke_${date}.xlsx`);
        
        document.body.appendChild(link);
        link.click();
        
        // Dọn dẹp
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success("Xuất file thành công!", { id: "exportInventory" });
      } else {
        toast.error("Dữ liệu file bị trống", { id: "exportInventory" });
      }

    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xuất file Excel.", { id: "exportInventory" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="mb-2">Quản lý kiểm kê</h3>
        <p className="text-muted mb-0">
          Tạo và quản lý các phiên kiểm kê thiết bị
        </p>
      </div>
      
      <div className="d-flex gap-2">
        {/* --- NÚT XUẤT EXCEL (Mới thêm) --- */}
        <button 
          className="btn btn-white border shadow-sm text-dark d-flex align-items-center"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? (
             <Loader size={16} className="me-2 animate-spin text-success" />
          ) : (
             <Download size={16} className="me-2 text-success" />
          )}
          {exporting ? "Đang tải..." : "Xuất Excel"}
        </button>

        {/* Nút Tạo mới (Giữ nguyên) */}
        {canCreate && (
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={() => window.dispatchEvent(new Event("openCreateInventoryModal"))}
          >
            <Plus size={16} className="me-2" />
            Tạo phiên kiểm kê
          </button>
        )}
      </div>
    </div>
  );
}