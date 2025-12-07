import { useState, useEffect } from "react";
import dashboardService from "../../services/dashboardService";

export function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await dashboardService.getDashboardData();
        setActivities(res.hoatDongGanDay || []);
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-center py-5">Đang tải hoạt động...</div>;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-3">
        <h5 className="mb-0">Hoạt động gần đây</h5>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {activities.length > 0 ? (
            activities.map((act, i) => (
              <div key={i} className="list-group-item px-4 py-3">
                <div className="d-flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-primary rounded-circle" style={{ width: 8, height: 8 }}></div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <strong>{act.loai}</strong>
                      <small className="text-muted">{act.thoiGian}</small>
                    </div>
                    <p className="mb-1 text-muted">{act.tieuDe || act.noiDung}</p>
                    <small className="text-muted">Bởi: {act.nguoiThucHien}</small>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-muted">Chưa có hoạt động nào</div>
          )}
        </div>
      </div>
    </div>
  );
}