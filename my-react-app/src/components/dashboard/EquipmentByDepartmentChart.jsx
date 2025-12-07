import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import dashboardService from "../../services/dashboardService";

export function EquipmentByDepartmentChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await dashboardService.getDashboardData();
        // Backend trả về: { soLuong, donVi }
        const chartData = (res.thietBiTheoDonVi || [])
          .filter(item => item.soLuong > 0) // Chỉ hiện đơn vị có thiết bị
          .map(item => ({
            name: item.donVi,
            count: item.soLuong
          }))
          .sort((a, b) => b.count - a.count); // Sắp xếp giảm dần
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
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0">
        <h5 className="mb-0">Thiết bị theo đơn vị</h5>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }} 
              angle={-20}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}