import { useState } from "react";
// 1. Thêm icon Download, Loader
import { Plus, Download, Loader } from "lucide-react";
import { getUserRole } from "../../services/authService";
// 2. Import service
import { deXuatMuaService } from "../../services/deXuatMuaService";
import toast from "react-hot-toast";

export default function ProcurementHeader() {
  // ... (giữ nguyên logic role) ...
  
  // 3. State loading
  const [exporting, setExporting] = useState(false);

  // --- HÀM GIẢI MÃ BASE64 ---
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

  // --- HÀM XỬ LÝ CLICK ---
  const handleExport = async () => {
    try {
      setExporting(true);
      toast.loading("Đang xuất danh sách đề xuất...", { id: "exportProcurement" });

      // 4. Gọi API
      const apiResponse = await deXuatMuaService.exportExcel();

      if (apiResponse && apiResponse.result) {
        const blob = base64ToBlob(
          apiResponse.result,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const date = new Date().toISOString().slice(0, 10);
        link.setAttribute('download', `Danh_sach_de_xuat_mua_${date}.xlsx`);
        
        document.body.appendChild(link);
        link.click();
        
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success("Xuất file thành công!", { id: "exportProcurement" });
      } else {
        toast.error("Dữ liệu file bị trống", { id: "exportProcurement" });
      }

    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xuất file Excel.", { id: "exportProcurement" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="mb-2">Quản lý mua sắm</h3>
        <p className="text-muted mb-0">Tạo và quản lý đề xuất mua sắm thiết bị</p>
      </div>
      
      <div className="d-flex gap-2">
        {/* --- NÚT XUẤT EXCEL --- */}
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

        {/* Nút Tạo mới */}
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => window.dispatchEvent(new Event("openCreateProcurementModal"))}
        >
          <Plus size={16} className="me-2" />
          Tạo đề xuất mua sắm
        </button>
      </div>
    </div>
  );
}