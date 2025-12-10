import ProcurementHeader from "../components/procurement/ProcurementHeader";
import ProcurementStatsCards from "../components/procurement/ProcurementStatsCards";
import ProcurementTable from "../components/procurement/ProcurementTable";
import CreateModal from "../components/procurement/ProcurementCreateModal";
import DetailModal from "../components/procurement/ProcurementDetailModal";
import ImportBatchModal from "../components/batch/ImportBatchModal";
import ProcurementFilters from "../components/procurement/ProcurementFilters";
export default function ProcurementPage() {
  return (
    <div className="container-fluid py-4">
       <ProcurementHeader />
      <ProcurementStatsCards />
      <ProcurementFilters />
      <ProcurementTable />

      <CreateModal />
      <DetailModal />
      <ImportBatchModal />
    </div>
  );
}