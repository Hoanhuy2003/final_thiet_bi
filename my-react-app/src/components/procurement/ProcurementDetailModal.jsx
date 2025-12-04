import { useState, useEffect } from "react";

const statusColors = {
  "Chờ duyệt": "badge-warning",
  "Đã duyệt": "badge-success",
  "Từ chối": "badge-danger",
  "Đang mua sắm": "badge-info",
  "Hoàn thành": "badge-success",
};

export default function ProcurementDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("selectedProcurement");
      if (data) {
        setRequest(JSON.parse(data));
        setIsOpen(true);
      }
    };
    window.addEventListener("openDetailProcurementModal", handler);
    return () => window.removeEventListener("openDetailProcurementModal", handler);
  }, []);

  if (!isOpen || !request) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chi tiết đề xuất - {request.ma_de_xuat}</h5>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label mb-1">Mã đề xuất</label>
                <p className="mb-0">{request.ma_de_xuat}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Tên đề xuất</label>
                <p className="mb-0">{request.ten_de_xuat}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Loại thiết bị</label>
                <p className="mb-0">{request.loai_thiet_bi}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Số lượng</label>
                <p className="mb-0">{request.so_luong} cái</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Giá trị dự kiến</label>
                <p className="mb-0">{request.gia_tri_du_kien.toLocaleString("vi-VN")}đ</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Đơn vị đề xuất</label>
                <p className="mb-0">{request.don_vi}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Người đề xuất</label>
                <p className="mb-0">{request.nguoi_de_xuat}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Ngày đề xuất</label>
                <p className="mb-0">{request.ngay_de_xuat}</p>
              </div>
              {request.nguoi_duyet && (
                <>
                  <div className="col-6">
                    <label className="form-label mb-1">Người duyệt</label>
                    <p className="mb-0">{request.nguoi_duyet}</p>
                  </div>
                  <div className="col-6">
                    <label className="form-label mb-1">Ngày duyệt</label>
                    <p className="mb-0">{request.ngay_duyet}</p>
                  </div>
                </>
              )}
              <div className="col-12">
                <label className="form-label mb-1">Trạng thái</label>
                <span className={`badge ${statusColors[request.trang_thai]}`}>
                  {request.trang_thai}
                </span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Đóng</button>
            {request.trang_thai === "Chờ duyệt" && (
              <>
                <button className="btn btn-danger me-2">Từ chối</button>
                <button className="btn btn-success">Phê duyệt</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}