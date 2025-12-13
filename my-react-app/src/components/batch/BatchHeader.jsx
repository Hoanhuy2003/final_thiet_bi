import { useState } from "react";
import { Plus, Download, Loader } from "lucide-react";
import { getUserRole } from "../../services/authService";
// Import service
import {loThietBiService} from "../../services/batchService"; 
import toast from "react-hot-toast";

export default function BatchHeader() {
  const role = getUserRole();
  const canCreate = ["ADMIN"].includes(role);
  const [exporting, setExporting] = useState(false);

  // --- HÀM QUAN TRỌNG: CHUYỂN BASE64 -> FILE BLOB ---
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

  const handleExport = async () => {
    try {
      setExporting(true);
      toast.loading("Đang xuất danh sách lô...", { id: "exportBatch" });

      // 1. Gọi API
      const apiResponse = await loThietBiService.exportExcel();

      // 2. Kiểm tra kết quả trả về
      // apiResponse.result chứa chuỗi Base64
      if (apiResponse && apiResponse.result) {
          
          // 3. Giải mã Base64 thành File
          const blob = base64ToBlob(
              apiResponse.result, 
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );

          // 4. Tải xuống
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const date = new Date().toISOString().slice(0, 10);
          link.setAttribute('download', `Danh_sach_lo_thiet_bi_${date}.xlsx`);
          
          document.body.appendChild(link);
          link.click();
          
          // Dọn dẹp
          link.remove();
          window.URL.revokeObjectURL(url);

          toast.success("Xuất file thành công!", { id: "exportBatch" });
      } else {
          console.log("Dữ liệu nhận được:", apiResponse); // Debug nếu vẫn lỗi
          toast.error("Dữ liệu file bị trống (undefined)", { id: "exportBatch" });
      }

    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xuất file Excel.", { id: "exportBatch" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="mb-2">Quản lý lô thiết bị</h3>
        <p className="text-muted mb-0">Tạo và quản lý các lô thiết bị nhập kho hàng loạt</p>
      </div>

      <div className="d-flex gap-2">
        <button 
          className="btn btn-white border shadow-sm text-dark d-flex align-items-center"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? <Loader size={18} className="me-2 animate-spin text-success" /> : <Download size={18} className="me-2 text-success" />}
          {exporting ? "Đang tải..." : "Xuất Excel"}
        </button>

        {canCreate && (
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={() => window.dispatchEvent(new Event("openCreateBatchModal"))}
          >
            <Plus size={16} className="me-2" />
            Tạo lô mới
          </button>
        )}
      </div>
    </div>
  );
}