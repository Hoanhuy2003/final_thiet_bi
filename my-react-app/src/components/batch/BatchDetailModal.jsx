import { useState, useEffect } from "react";
import { Package, Download } from "lucide-react";

const statusColors = {
  "Chờ phê duyệt": "badge-warning",
  "Đã nhập kho": "badge-success",
  "Đã phân phối": "badge-info",
};

export default function BatchDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [batch, setBatch] = useState(null);

  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("selectedBatch");
      if (data) {
        setBatch(JSON.parse(data));
        setIsOpen(true);
      }
    };
    window.addEventListener("openDetailBatchModal", handler);
    return () => window.removeEventListener("openDetailBatchModal", handler);
  }, []);

  if (!isOpen || !batch) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Chi tiết lô thiết bị</h5>
              <p className="text-muted mb-0 text-sm">Thông tin chi tiết về lô {batch.ma_lo}</p>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3 mb-4">
              <div className="col-6"><label className="form-label mb-1">Mã lô</label><p>{batch.ma_lo}</p></div>
              <div className="col-6"><label className="form-label mb-1">Tên lô</label><p>{batch.ten_lo}</p></div>
              <div className="col-6"><label className="form-label mb-1">Loại thiết bị</label><p>{batch.loai_thiet_bi}</p></div>
              <div className="col-6"><label className="form-label mb-1">Số lượng</label><p>{batch.so_luong} thiết bị</p></div>
              <div className="col-6"><label className="form-label mb-1">Nguyên giá/đơn vị</label><p>{batch.nguyen_gia_don_vi.toLocaleString("vi-VN")}đ</p></div>
              <div className="col-6"><label className="form-label mb-1">Tổng giá trị</label><p>{batch.tong_gia_tri.toLocaleString("vi-VN")}đ</p></div>
              <div className="col-6"><label className="form-label mb-1">Ngày tạo</label><p>{batch.ngay_tao}</p></div>
              <div className="col-6"><label className="form-label mb-1">Người tạo</label><p>{batch.nguoi_tao}</p></div>
              <div className="col-12">
                <label className="form-label mb-1">Trạng thái</label>
                <span className={`badge ${statusColors[batch.trang_thai]}`}>{batch.trang_thai}</span>
              </div>
            </div>

            <div className="border-top pt-3">
              <h6 className="mb-3 d-flex align-items-center gap-2">
                <Package size={16} />
                Danh sách thiết bị trong lô (25 thiết bị)
              </h6>
              <div className="border rounded" style={{ maxHeight: "240px", overflowY: "auto" }}>
                <table className="table table-sm mb-0">
                  <thead><tr><th>Mã tài sản</th><th>Tên thiết bị</th><th>Trạng thái</th></tr></thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td>TB-2024-{String(i + 1).padStart(3, "0")}</td>
                        <td>Máy tính Dell Latitude 5420</td>
                        <td><span className="badge badge-success">Đang sử dụng</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Đóng</button>
            <button className="btn btn-primary">
              <Download size={16} className="me-2" />
              Xuất danh sách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}