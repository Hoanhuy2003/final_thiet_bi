import { Plus } from "lucide-react";

export default function ProcurementHeader() {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="mb-2">Quản lý mua sắm</h3>
        <p className="text-muted mb-0">Tạo và quản lý đề xuất mua sắm thiết bị</p>
      </div>
      <button
        className="btn btn-primary"
        onClick={() => window.dispatchEvent(new Event("openCreateProcurementModal"))}
      >
        <Plus size={16} className="me-2" />
        Tạo đề xuất mua sắm
      </button>
    </div>
  );
}