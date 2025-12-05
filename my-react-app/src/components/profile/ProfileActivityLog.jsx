export default function ProfileActivityLog() {
  const activities = [
    { action: "Đăng nhập hệ thống", time: "29/11/2025 14:30" },
    { action: "Tạo đề xuất thanh lý TL-2024-005", time: "28/11/2025 10:15" },
    { action: "Phê duyệt đề xuất mua sắm MS-2024-012", time: "27/11/2025 16:45" },
    { action: "Cập nhật thông tin thiết bị TB-2024-089", time: "26/11/2025 09:20" },
    { action: "Hoàn thành kiểm kê Lab A101", time: "25/11/2025 15:30" },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Hoạt động gần đây</h5>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column gap-3">
          {activities.map((item, index) => (
            <div key={index} className="d-flex gap-3 pb-3 border-bottom last:border-0">
              <div
                className="rounded-circle mt-1"
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "var(--bs-primary)",
                  flexShrink: 0,
                }}
              />
              <div className="flex-grow-1">
                <p className="mb-0 fw-medium">{item.action}</p>
                <p className="text-xs text-muted mb-0">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}