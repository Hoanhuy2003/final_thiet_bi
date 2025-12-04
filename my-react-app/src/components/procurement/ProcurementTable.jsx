import { Eye } from "lucide-react";

const mockProcurementRequests = [
  {
    id: 1,
    ma_de_xuat: "MS-2024-001",
    ten_de_xuat: "Mua sắm máy tính cho phòng Lab mới",
    loai_thiet_bi: "Máy tính",
    so_luong: 25,
    gia_tri_du_kien: 462500000,
    nguoi_de_xuat: "Nguyễn Văn A",
    ngay_de_xuat: "2024-06-10",
    trang_thai: "Chờ duyệt",
    don_vi: "Khoa CNTT",
  },
  {
    id: 2,
    ma_de_xuat: "MS-2024-002",
    ten_de_xuat: "Nâng cấp thiết bị thí nghiệm điện tử",
    loai_thiet_bi: "Thiết bị thí nghiệm",
    so_luong: 15,
    gia_tri_du_kien: 675000000,
    nguoi_de_xuat: "Trần Thị B",
    ngay_de_xuat: "2024-06-12",
    nguoi_duyet: "Phạm Thị D",
    ngay_duyet: "2024-06-15",
    trang_thai: "Đã duyệt",
    don_vi: "Khoa Điện tử",
  },
];

const statusColors = {
  "Chờ duyệt": "badge-warning",
  "Đã duyệt": "badge-success",
  "Từ chối": "badge-danger",
  "Đang mua sắm": "badge-info",
  "Hoàn thành": "badge-success",
};

export default function ProcurementTable() {
  const openDetail = (request) => {
    localStorage.setItem("selectedProcurement", JSON.stringify(request));
    window.dispatchEvent(new Event("openDetailProcurementModal"));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Danh sách đề xuất mua sắm</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Mã đề xuất</th>
                <th>Tên đề xuất</th>
                <th>Loại thiết bị</th>
                <th>Số lượng</th>
                <th>Giá trị dự kiến</th>
                <th>Đơn vị</th>
                <th>Ngày đề xuất</th>
                <th>Trạng thái</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {mockProcurementRequests.map((request) => (
                <tr key={request.id}>
                  <td className="font-medium">{request.ma_de_xuat}</td>
                  <td>{request.ten_de_xuat}</td>
                  <td>{request.loai_thiet_bi}</td>
                  <td>{request.so_luong}</td>
                  <td>{request.gia_tri_du_kien.toLocaleString("vi-VN")}đ</td>
                  <td>{request.don_vi}</td>
                  <td>{request.ngay_de_xuat}</td>
                  <td>
                    <span className={`badge ${statusColors[request.trang_thai]}`}>
                      {request.trang_thai}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-link text-dark p-1"
                      onClick={() => openDetail(request)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}