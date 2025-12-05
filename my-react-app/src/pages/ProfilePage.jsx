import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileInfoCard from "../components/profile/ProfileInfoCard";
import ProfileActivityLog from "../components/profile/ProfileActivityLog";
export default function ProfilePage() {
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12 col-lg-4 mb-4">
          <ProfileSidebar />
        </div>
        <div className="col-12 col-lg-8">
          <ProfileInfoCard />
          <ProfileActivityLog />
        </div>
      </div>

     
    </div>
  );
}