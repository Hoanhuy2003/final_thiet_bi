import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import dashboardService from "../../services/dashboardService";

const COLORS = {
  "Đang sử dụng": "#10b981",
  "Bảo trì": "#f59e0b",
  "Hỏng hóc": "#ef4444",
  "Chờ thanh lý": "#6b7280",
  "Đã thanh lý": "#374151",
};

export function EquipmentStatusPieChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await dashboardService.getDashboardData();
        // Backend trả về: { soLuong, tyLe, trangThai }
        const chartData = (res.trangThaiThietBi || []).map(item => ({
          name: item.trangThai,
          value: item.soLuong,
          percent: item.tyLe
        }));
        setData(chartData);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-center py-5">Đang tải biểu đồ...</div>;
  if (data.length === 0) return <div className="text-center py-5 text-muted">Chưa có dữ liệu</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Trạng thái thiết bị</h5>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent}%`}
              outerRadius={100}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#888"} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} thiết bị`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}