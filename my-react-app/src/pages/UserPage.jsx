// src/pages/UserPage.jsx
import UserHeader from "../components/user/UserHeader";
import UserStatsCards from "../components/user/UserStatsCards";
import UserTable from "../components/user/UserTable";
import UserCreateModal from "../components/user/UserCreateModal";
import UserEditModal from "../components/user/UserEditModal";
import UserDetailModal from "../components/user/UserDetailModal";

export default function UserPage() {
  return (
    <div className="container-fluid py-4">
      <UserHeader />
      <UserStatsCards />
      <UserTable />

      <UserCreateModal />
      <UserEditModal />
      <UserDetailModal />
    </div>
  );
}