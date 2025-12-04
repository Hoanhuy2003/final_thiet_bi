// src/pages/InventoryPage.jsx
import InventoryHeader from "../components/inventory/InventoryHeader";
import InventoryStatsCards from "../components/inventory/InventoryStatsCards";
import InventorySessionsTable from "../components/inventory/InventorySessionsTable";
import InventoryCreateModal from "../components/inventory/InventoryCreateModal";
import InventoryChecklistModal from "../components/inventory/InventoryChecklistModal";
import InventoryDetailModal from "../components/inventory/InventoryDetailModal";

export default function InventoryPage() {
  return (
    <div className="container-fluid py-4">
      <InventoryHeader />
      <InventoryStatsCards />
      <InventorySessionsTable />

      <InventoryCreateModal />
      <InventoryChecklistModal />
      <InventoryDetailModal />
    </div>
  );
}