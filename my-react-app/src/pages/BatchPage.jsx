import BatchHeader from "../components/batch/BatchHeader";
import BatchStatsCards from "../components/batch/BatchStatsCards";
import BatchTable from "../components/batch/BatchTable";
import BatchCreateModal from "../components/batch/BatchCreateModal";
import BatchDetailModal from "../components/batch/BatchDetailModal";

export default function BatchPage() {
  return (
    <div className="container-fluid py-4">
      <BatchHeader />
      <BatchStatsCards />
      <BatchTable />

      <BatchCreateModal />
      <BatchDetailModal />
    </div>
  );
}