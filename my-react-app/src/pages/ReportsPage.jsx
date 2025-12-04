import ReportsHeader from "../components/reports/ReportsHeader";
import ReportsFilterCard from "../components/reports/ReportsFilterCard";
import ReportsTypeGrid from "../components/reports/ReportsTypeGrid";
import RecentReportsTable from "../components/reports/RecentReportsTable";

export default function ReportsPage() {
  return (
    <div className="container-fluid py-4">
      <ReportsHeader />
      <ReportsFilterCard />
      <ReportsTypeGrid />
      <RecentReportsTable />
    </div>
  );
}