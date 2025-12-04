import DisposalHeader from "../components/disposal/DisposalHeader";
import DisposalStatsCards from "../components/disposal/DisposalStatsCards";
import DisposalTable from "../components/disposal/DisposalTable";
import DisposalCreateModal from "../components/disposal/DisposalCreateModal";
import DisposalDetailModal from "../components/disposal/DisposalDetailModal";

export default function DisposalPage() {
  return (
    <div className="container-fluid py-4">
      <DisposalHeader />
      <DisposalStatsCards />
      <DisposalTable />

      <DisposalCreateModal />
      <DisposalDetailModal />
    </div>
  );
}