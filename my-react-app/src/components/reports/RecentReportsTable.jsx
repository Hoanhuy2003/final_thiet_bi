import { Eye, Download } from "lucide-react";

const recentReports = [
  {
    id: 1,
    name: "Báo cáo thiết bị Q2/2024",
    type: "Báo cáo tổng hợp",
    created_by: "Nguyễn Văn A",
    created_at: "2024-06-30",
    size: "2.5 MB",
  },
  {
    id: 2,
    name: "Báo cáo kiểm kê tháng 6/2024",
    type: "Báo cáo kiểm kê",
    created_by: "Trần Thị B",
    created_at: "2024-06-25",
    size: "1.8 MB",
  },
  {
    id: 3,
    name: "Báo cáo thanh lý quý 2/2024",
    type: "Báo cáo thanh lý",
    created_by: "Lê Văn C",
    created_at: "2024-06-20",
    size: "1.2 MB",
  },
];

export default function RecentReportsTable() {
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Báo cáo gần đây</h5>
        <button className="btn btn-sm btn-outline-secondary">
          Xem tất cả
        </button>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Tên báo cáo</th>
                <th>Loại</th>
                <th>Người tạo</th>
                <th>Ngày tạo</th>
                <th>Kích thước</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id}>
                  <td className="font-medium">{report.name}</td>
                  <td>
                    <span className="badge badge-info">{report.type}</span>
                  </td>
                  <td>{report.created_by}</td>
                  <td>{report.created_at}</td>
                  <td>
                    <span className="text-muted">{report.size}</span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-link text-dark p-1"
                        title="Xem trước"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-link text-primary p-1"
                        title="Tải xuống"
                      >
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