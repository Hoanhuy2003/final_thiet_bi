import { Plus } from "lucide-react";

export default function DisposalHeader() {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="mb-2">Quản lý phiếu thanh lý</h3>
        <p className="text-muted mb-0">Quản lý quy trình thanh lý tài sản cố định</p>
      </div>
      <button
        className="btn btn-primary d-flex align-items-center gap-2"
        onClick={() => window.dispatchEvent(new Event("openCreateThanhLyModal"))}
      >
        <Plus size={18} />
        Tạo phiếu thanh lý
      </button>
    </div>
  );
}