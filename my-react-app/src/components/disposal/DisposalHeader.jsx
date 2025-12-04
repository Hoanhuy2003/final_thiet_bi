import { Plus } from "lucide-react";

export default function DisposalHeader() {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="mb-2">Quản lý thanh lý</h3>
        <p className="text-muted mb-0">Quản lý đề xuất và quy trình thanh lý thiết bị</p>
      </div>
      <button
        className="btn btn-primary"
        onClick={() => window.dispatchEvent(new Event("openCreateDisposalModal"))}
      >
        <Plus size={16} className="me-2" />
        Tạo đề xuất thanh lý
      </button>
    </div>
  );
}