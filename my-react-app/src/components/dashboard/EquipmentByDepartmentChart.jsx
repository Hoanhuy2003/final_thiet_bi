import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const equipmentByDepartment = [
  { name: "Khoa CNTT", count: 145 },
  { name: "Khoa Cơ khí", count: 98 },
  { name: "Khoa Điện tử", count: 123 },
  { name: "Khoa Xây dựng", count: 87 },
  { name: "Khoa Kinh tế", count: 65 },
];

export function EquipmentByDepartmentChart() {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0">
        <h5 className="mb-0">Thiết bị theo đơn vị</h5>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={equipmentByDepartment}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}