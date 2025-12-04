// src/pages/EquipmentPage.jsx
import EquipmentHeader from "../components/equipment/EquipmentHeader";
import EquipmentFilters from "../components/equipment/EquipmentFilters";
import EquipmentTable from "../components/equipment/EquipmentTable";
import EquipmentCreateModal from "../components/equipment/EquipmentCreateModal";
import EquipmentDetailModal from "../components/equipment/EquipmentDetailModal";
import EquipmentEditModal from "../components/equipment/EquipmentEditModal";
import EquipmentDisposalModal from "../components/equipment/EquipmentDisposalModal";

export default function EquipmentPage() {
  return (
    <div className="container-fluid py-4">
      <EquipmentHeader />
      <EquipmentFilters />
      <EquipmentTable />

      <EquipmentCreateModal />
      <EquipmentDetailModal />
      <EquipmentEditModal />
      <EquipmentDisposalModal />
    </div>
  );
}