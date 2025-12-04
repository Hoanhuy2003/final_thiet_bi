import { FileText, BarChart } from "lucide-react";

const reportTypes = [
  {
    id: 1,
    title: "Báo cáo tổng hợp thiết bị",
    description: "Thống kê tổng quan về thiết bị theo đơn vị, trạng thái",
    icon: BarChart,
  },
  {
    id: 2,
    title: "Báo cáo nhập/xuất thiết bị",
    description: "Thống kê chi tiết về các hoạt động nhập xuất thiết bị",
    icon: FileText,
  },
  {
    id: 3,
    title: "Báo cáo kiểm kê",
    description: "Kết quả kiểm kê thiết bị theo từng phiên",
    icon: FileText,
  },
  {
    id: 4,
    title: "Báo cáo thanh lý",
    description: "Thống kê các đề xuất và hoạt động thanh lý",
    icon: FileText,
  },
  {
    id: 5,
    title: "Báo cáo mua sắm",
    description: "Thống kê các đề xuất và hoạt động mua sắm",
    icon: FileText,
  },
  {
    id: 6,
    title: "Báo cáo giá trị tài sản",
    description: "Thống kê giá trị tài sản theo thời gian",
    icon: BarChart,
  },
];

export default function ReportsTypeGrid() {
  const handleGenerate = (report) => {
    alert(`Tạo báo cáo: ${report.title}`);
    // Logic tạo báo cáo ở đây
  };

  return (
    <div className="mb-5">
      <h5 className="mb-3">Loại báo cáo</h5>
      <div className="row g-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm hover-shadow transition"
                style={{ cursor: "pointer" }}
                onClick={() => handleGenerate(report)}
              >
                <div className="card-body">
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-3 rounded bg-light-blue">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-2">{report.title}</h6>
                      <p className="text-sm text-muted mb-3">{report.description}</p>
                      <button className="btn btn-sm btn-outline-primary w-100">
                        <FileText size={16} className="me-2" />
                        Tạo báo cáo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}