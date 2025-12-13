// src/components/disposal/DisposalHeader.jsx
import { useState } from "react";
import { Plus, Download, Loader } from "lucide-react";
import thanhLyService from "../../services/disposalService"; // Import service
import toast from "react-hot-toast";

export default function DisposalHeader() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      toast.loading("Đang xuất file Excel...", { id: "exportDisposal" });

      // 1. Gọi API (Lấy tất cả, không cần tham số lọc)
      const response = await thanhLyService.exportExcel();

      // 2. Tạo file tải xuống từ Blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Đặt tên file (VD: Danh_sach_thanh_ly_2025-12-12.xlsx)
      const date = new Date().toISOString().slice(0, 10);
      link.setAttribute('download', `Danh_sach_thanh_ly_${date}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      
      // Dọn dẹp
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Xuất file thành công!", { id: "exportDisposal" });

    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xuất file Excel.", { id: "exportDisposal" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="mb-2">Quản lý phiếu thanh lý</h3>
        <p className="text-muted mb-0">Quản lý quy trình thanh lý tài sản cố định</p>
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

        {/* Nút Tạo mới */}
        <button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={() => window.dispatchEvent(new Event("openCreateThanhLyModal"))}
        >
          <Plus size={18} />
          Tạo phiếu thanh lý
        </button>
      </div>
    </div>
  );
}