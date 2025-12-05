// components/dashboard/RecentActivities.jsx
export function RecentActivities() {
  const activities = [
    { type: "Nhập thiết bị", desc: "Lô thiết bị LT-2024-045 - 15 máy tính Dell", time: "10 phút trước", user: "Nguyễn Văn A" },
    { type: "Kiểm kê", desc: "Hoàn thành kiểm kê phòng Lab A - 45 thiết bị", time: "1 giờ trước", user: "Trần Thị B" },
    { type: "Đề xuất thanh lý", desc: "TB-2018-023 - Máy chiếu Sony cũ", time: "2 giờ trước", user: "Lê Văn C" },
    { type: "Phê duyệt mua sắm", desc: "Đề xuất DX-2024-012 đã được phê duyệt", time: "3 giờ trước", user: "Phạm Thị D" },
  ];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-3">
        <h5 className="mb-0">Hoạt động gần đây</h5>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {activities.map((act, i) => (
            <div key={i} className="list-group-item px-4 py-3">
              <div className="d-flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-primary rounded-circle" style={{ width: 8, height: 8 }}></div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <strong>{act.type}</strong>
                    <small className="text-muted">{act.time}</small>
                  </div>
                  <p className="mb-1 text-muted">{act.desc}</p>
                  <small className="text-muted">Bởi: {act.user}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}