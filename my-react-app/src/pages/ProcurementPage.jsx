import ProcurementHeader from "../components/procurement/ProcurementHeader";
import ProcurementStatsCards from "../components/procurement/ProcurementStatsCards";
import ProcurementTable from "../components/procurement/ProcurementTable";
import CreateModal from "../components/procurement/ProcurementCreateModal";
import DetailModal from "../components/procurement/ProcurementDetailModal";

export default function ProcurementPage() {
  return (
    <div className="container-fluid py-4">
      <ProcurementHeader />
      <ProcurementStatsCards />
      <ProcurementTable />

      <CreateModal />
      <DetailModal />
    </div>
  );
}