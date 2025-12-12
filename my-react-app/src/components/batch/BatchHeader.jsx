import { Plus } from "lucide-react";
import { getUserRole } from "../../services/authService";

export default function BatchHeader() {
  const role = getUserRole();
  const canCreate = ["ADMIN"].includes(role);
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="mb-2">Quản lý lô thiết bị</h3>
        <p className="text-muted mb-0">
          Tạo và quản lý các lô thiết bị nhập kho hàng loạt
        </p>
      </div>
      {canCreate && (
        <button
          className="btn btn-primary"
          onClick={() => window.dispatchEvent(new Event("openCreateBatchModal"))}
        >
          <Plus size={16} className="me-2" />
          Tạo lô mới
        </button>
      )}
      
    </div>
  );
}