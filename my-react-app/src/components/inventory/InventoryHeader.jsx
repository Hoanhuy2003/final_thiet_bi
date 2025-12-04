import { Plus } from "lucide-react";

export default function InventoryHeader() {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="mb-2">Quản lý kiểm kê</h3>
        <p className="text-muted mb-0">
          Tạo và quản lý các phiên kiểm kê thiết bị
        </p>
      </div>
      <button
        className="btn btn-primary"
        onClick={() => window.dispatchEvent(new Event("openCreateInventoryModal"))}
      >
        <Plus size={16} className="me-2" />
        Tạo phiên kiểm kê
      </button>
    </div>
  );
}