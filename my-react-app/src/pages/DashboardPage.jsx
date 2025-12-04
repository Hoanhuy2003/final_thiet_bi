import { StatsCards } from "../components/dashboard/StatsCards";
import { EquipmentByDepartmentChart } from "../components/dashboard/EquipmentByDepartmentChart";
import { EquipmentStatusPieChart } from "../components/dashboard/EquipmentStatusPieChart";
import { RecentActivities } from "../components/dashboard/RecentActivities";

export default function DashboardPage() {
  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">Tổng quan hệ thống</h3>

      <StatsCards />

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <EquipmentByDepartmentChart />
        </div>
        <div className="col-12 col-lg-6">
          <EquipmentStatusPieChart />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}