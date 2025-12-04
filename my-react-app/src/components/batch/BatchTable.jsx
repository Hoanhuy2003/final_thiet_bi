import { useEffect } from "react";
import { Eye, Download } from "lucide-react";

const mockBatches = [
  {
    id: 1,
    ma_lo: "LO-2024-001",
    ten_lo: "Lô máy tính Dell cho Khoa CNTT",
    loai_thiet_bi: "Máy tính",
    so_luong: 25,
    nguyen_gia_don_vi: 18500000,
    tong_gia_tri: 462500000,
    ngay_tao: "2024-01-15",
    trang_thai: "Đã nhập kho",
    nguoi_tao: "Nguyễn Văn A",
  },
  {
    id: 2,
    ma_lo: "LO-2024-002",
    ten_lo: "Lô bàn ghế học sinh",
    loai_thiet_bi: "Nội thất",
    so_luong: 50,
    nguyen_gia_don_vi: 3500000,
    tong_gia_tri: 175000000,
    ngay_tao: "2024-02-20",
    trang_thai: "Đã phân phối",
    nguoi_tao: "Trần Thị B",
  },
  {
    id: 3,
    ma_lo: "LO-2024-003",
    ten_lo: "Lô thiết bị thí nghiệm điện tử",
    loai_thiet_bi: "Thiết bị thí nghiệm",
    so_luong: 15,
    nguyen_gia_don_vi: 45000000,
    tong_gia_tri: 675000000,
    ngay_tao: "2024-03-10",
    trang_thai: "Chờ phê duyệt",
    nguoi_tao: "Lê Văn C",
  },
];

const statusColors = {
  "Chờ phê duyệt": "badge-warning",
  "Đã nhập kho": "badge-success",
  "Đã phân phối": "badge-info",
};

export default function BatchTable() {
  const openDetail = (batch) => {
    localStorage.setItem("selectedBatch", JSON.stringify(batch));
    window.dispatchEvent(new Event("openDetailBatchModal"));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Danh sách lô thiết bị</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Mã lô</th>
                <th>Tên lô</th>
                <th>Loại thiết bị</th>
                <th>Số lượng</th>
                <th>Nguyên giá/đơn vị</th>
                <th>Tổng giá trị</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {mockBatches.map((batch) => (
                <tr key={batch.id}>
                  <td className="font-medium">{batch.ma_lo}</td>
                  <td>{batch.ten_lo}</td>
                  <td>{batch.loai_thiet_bi}</td>
                  <td>{batch.so_luong}</td>
                  <td>{batch.nguyen_gia_don_vi.toLocaleString("vi-VN")}đ</td>
                  <td>{batch.tong_gia_tri.toLocaleString("vi-VN")}đ</td>
                  <td>{batch.ngay_tao}</td>
                  <td>
                    <span className={`badge ${statusColors[batch.trang_thai]}`}>
                      {batch.trang_thai}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-link text-dark p-1" onClick={() => openDetail(batch)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn btn-sm btn-link text-dark p-1">
                        <Download size={16} />
                      </button>
                    </div>
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