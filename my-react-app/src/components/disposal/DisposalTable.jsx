import { Eye } from "lucide-react";

const mockDisposalRequests = [
  {
    id: 1,
    ma_de_xuat: "TL-2024-001",
    ma_tai_san: "TB-2018-023",
    ten_thiet_bi: "Máy chiếu Sony VPL-EX100",
    gia_tri_thanh_ly: 1500000,
    ly_do: "Thiết bị đã hỏng, không thể sửa chữa",
    nguoi_de_xuat: "Nguyễn Văn A",
    ngay_de_xuat: "2024-06-01",
    trang_thai: "Chờ duyệt",
  },
  {
    id: 2,
    ma_de_xuat: "TL-2024-002",
    ma_tai_san: "TB-2019-045",
    ten_thiet_bi: "Máy in HP LaserJet 1020",
    gia_tri_thanh_ly: 800000,
    ly_do: "Thiết bị lỗi thời",
    nguoi_de_xuat: "Trần Thị B",
    ngay_de_xuat: "2024-06-05",
    trang_thai: "Đã duyệt",
  },
];

const statusColors = {
  "Chờ duyệt": "badge-warning",
  "Đã duyệt": "badge-success",
  "Từ chối": "badge-danger",
  "Đã thanh lý": "badge-info",
};

export default function DisposalTable() {
  const openDetail = (request) => {
    localStorage.setItem("selectedDisposalRequest", JSON.stringify(request));
    window.dispatchEvent(new Event("openDetailDisposalModal"));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Danh sách đề xuất thanh lý</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Mã đề xuất</th>
                <th>Mã tài sản</th>
                <th>Tên thiết bị</th>
                <th>Giá trị thanh lý</th>
                <th>Người đề xuất</th>
                <th>Ngày đề xuất</th>
                <th>Trạng thái</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {mockDisposalRequests.map((request) => (
                <tr key={request.id}>
                  <td className="font-medium">{request.ma_de_xuat}</td>
                  <td>{request.ma_tai_san}</td>
                  <td>{request.ten_thiet_bi}</td>
                  <td>{request.gia_tri_thanh_ly.toLocaleString("vi-VN")}đ</td>
                  <td>{request.nguoi_de_xuat}</td>
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