// src/components/equipment/EquipmentHeader.jsx
import { Plus, Download } from "lucide-react";

export default function EquipmentHeader() {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="mb-2">Quản lý thiết bị</h3>
        <p className="text-muted mb-0">Quản lý toàn bộ thiết bị trong hệ thống</p>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-primary">
          <Download size={16} className="me-2" />
          Xuất Excel
        </button>
        <button className="btn btn-primary" onClick={() => window.dispatchEvent(new Event("openCreateEquipmentModal"))}>
          <Plus size={16} className="me-2" />
          Thêm thiết bị
        </button>
      </div>
    </div>
  );
}