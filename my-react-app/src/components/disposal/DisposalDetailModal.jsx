import { useState, useEffect } from "react";

const statusColors = {
  "Chờ duyệt": "badge-warning",
  "Đã duyệt": "badge-success",
  "Từ chối": "badge-danger",
  "Đã thanh lý": "badge-info",
};

export default function DisposalDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("selectedDisposalRequest");
      if (data) {
        setRequest(JSON.parse(data));
        setIsOpen(true);
      }
    };
    window.addEventListener("openDetailDisposalModal", handler);
    return () => window.removeEventListener("openDetailDisposalModal", handler);
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
                <label className="form-label mb-1">Mã tài sản</label>
                <p className="mb-0">{request.ma_tai_san}</p>
              </div>
              <div className="col-12">
                <label className="form-label mb-1">Tên thiết bị</label>
                <p className="mb-0">{request.ten_thiet_bi}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Giá trị thanh lý</label>
                <p className="mb-0">{request.gia_tri_thanh_ly.toLocaleString("vi-VN")}đ</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Người đề xuất</label>
                <p className="mb-0">{request.nguoi_de_xuat}</p>
              </div>
              <div className="col-12">
                <label className="form-label mb-1">Lý do thanh lý</label>
                <p className="mb-0">{request.ly_do}</p>
              </div>
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