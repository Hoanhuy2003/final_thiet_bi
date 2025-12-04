import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const equipmentByStatus = [
  { name: "Đang sử dụng", value: 385, color: "#10b981" },
  { name: "Bảo trì", value: 42, color: "#f59e0b" },
  { name: "Hỏng hóc", value: 18, color: "#ef4444" },
  { name: "Chờ thanh lý", value: 23, color: "#6b7280" },
];

export function EquipmentStatusPieChart() {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Trạng thái thiết bị</h5>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={equipmentByStatus}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              dataKey="value"
            >
              {equipmentByStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}