import { Plus } from "lucide-react";

export default function UserHeader() {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h3 className="mb-2">Quản lý người dùng</h3>
        <p className="text-muted mb-0">Quản lý tài khoản và phân quyền người dùng</p>
      </div>
      <button
        className="btn btn-primary"
        onClick={() => window.dispatchEvent(new Event("openCreateUserModal"))}
      >
        <Plus size={16} className="me-2" />
        Thêm người dùng
      </button>
    </div>
  );
}