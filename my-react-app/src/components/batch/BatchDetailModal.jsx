import { useState, useEffect } from "react";
import { X, Package, Tag } from "lucide-react"; // Bỏ Download
// Bỏ import service gọi API thiết bị con
// import { equipmentService } from "../../services/equipmentService"; 

export default function BatchDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [batch, setBatch] = useState(null);
  
  // Bỏ các state liên quan đến thiết bị con:
  // const [devices, setDevices] = useState([]); 
  // const [loadingDevices, setLoadingDevices] = useState(false);

  // Helper format tiền
  const formatMoney = (amount) => {
    return (Number(amount) || 0).toLocaleString("vi-VN") + "đ";
  };

  // Helper render trạng thái lô
  const renderBatchStatus = (status) => {
    if (status === null || status === 0) return <span className="badge bg-warning text-dark">Mới nhập</span>;
    if (status === 1) return <span className="badge bg-success">Đã tạo tài sản</span>;
    return <span className="badge bg-secondary">Khác</span>;
  };
  
  // Bỏ hàm loadDevices

  useEffect(() => {
    const handler = async () => {
      const data = localStorage.getItem("selectedBatch");
      if (data) {
        const parsedBatch = JSON.parse(data);
        setBatch(parsedBatch);
        setIsOpen(true);
        
        // Loại bỏ hoàn toàn logic gọi API thiết bị con ở đây
      }
    };
    
    window.addEventListener("openDetailBatchModal", handler);
    return () => window.removeEventListener("openDetailBatchModal", handler);
  }, []);

  if (!isOpen || !batch) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg">
          
          <div className="modal-header bg-primary text-white">
            <div>
              <h5 className="modal-title fw-bold">Chi tiết lô hàng: {batch.maLo}</h5>
              <p className="mb-0 text-white-50 small">{batch.tenLo}</p>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
          </div>
          
          <div className="modal-body">
            
            {/* THÔNG TIN CHUNG */}
            <h6 className="fw-bold mb-3 text-muted">THÔNG TIN LÔ HÀNG</h6>
            <div className="row g-3 mb-4 p-3 bg-light rounded shadow-sm">
                
                {/* Dòng 1: Tên lô, Loại, NCC */}
                <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Tên Lô / Mã Lô</label>
                    <p className="fw-medium mb-0">{batch.tenLo} ({batch.maLo})</p>
                </div>
                <div className="col-md-3">
                    <label className="form-label text-muted small fw-bold">Loại thiết bị</label>
                    <p className="fw-medium mb-0">{batch.tenLoai || "N/A"}</p>
                </div>
                <div className="col-md-3">
                    <label className="form-label text-muted small fw-bold">Trạng thái</label>
                    <div>{renderBatchStatus(batch.trangThai)}</div>
                </div>

                <hr className="my-2"/>

                {/* Dòng 2: Số lượng, Giá trị, Ngày nhập */}
                <div className="col-md-3">
                    <label className="form-label text-muted small fw-bold">Số lượng</label>
                    <p className="fw-bold mb-0">{batch.soLuong}</p>
                </div>
                <div className="col-md-3">
                    <label className="form-label text-muted small fw-bold">Đơn giá nhập</label>
                    <p className="fw-medium mb-0">{formatMoney(batch.donGia)}</p>
                </div>
                <div className="col-md-3">
                    <label className="form-label text-muted small fw-bold">Tổng giá trị</label>
                    <p className="fw-bold text-success mb-0">{formatMoney(batch.tongTien)}</p>
                </div>
                <div className="col-md-3">
                    <label className="form-label text-muted small fw-bold">Ngày nhập</label>
                    <p className="fw-medium mb-0">{batch.ngayNhap}</p>
                </div>

                {/* Dòng 3: NCC và Đề xuất */}
                <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Nhà cung cấp</label>
                    <p className="fw-medium mb-0">{batch.tenNhaCungCap || "Chưa cập nhật"}</p>
                </div>
                <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Đề xuất liên quan</label>
                    <p className="fw-medium mb-0">
                        {batch.maDeXuat ? `${batch.tieuDeDeXuat} (${batch.maDeXuat})` : "Không có"}
                    </p>
                </div>

                {/* Ghi chú chung */}
                <div className="col-12">
                    <label className="form-label text-muted small fw-bold">Ghi chú / Thông số kỹ thuật chung</label>
                    <p className="small mb-0 border rounded p-2 bg-white">{batch.ghiChu || "N/A"}</p>
                </div>

            </div>
          
            
          </div>
          
          <div className="modal-footer bg-light">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>
                <X size={16} className="me-1"/> Đóng
            </button>
            {/* Nút Xuất file cũng bị xóa */}
          </div>
        </div>
      </div>
    </div>
  );
}