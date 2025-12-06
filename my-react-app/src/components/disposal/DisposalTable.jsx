import { useState, useEffect } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import thanhLyService from "../../services/thanhLyService";
import toast from "react-hot-toast";

const statusColors = {
  "Chờ duyệt": "bg-warning text-dark",
  "Hoàn tất": "bg-success",
  "Từ chối": "bg-danger",
};

export default function DisposalTable() {
  const [phieuList, setPhieuList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      console.log("Bắt đầu gọi API: GET /api/thanh_ly");
      const data = await thanhLyService.getAll();
      console.log("Nhận dữ liệu thành công:", data);
      setPhieuList(data);
    } catch (err) {
      console.error("LỖI KHI LẤY DANH SÁCH PHIẾU THANH LÝ:");
      console.error("Status:", err.response?.status);
      console.error("Message:", err.message);
      console.error("Full error:", err);

      const msg = err.response?.data?.message || err.message || "Lỗi không xác định";
      toast.error("Không tải được danh sách phiếu thanh lý: " + msg);
    } finally {
      setLoading(false);
    }
  };

  // RELOAD KHI CÓ AI ĐÓ DUYỆT/TỪ CHỐI PHIẾU
  useEffect(() => {
    loadData();
    const handleReload = () => {
      console.log("Bảng phiếu thanh lý: Đang reload dữ liệu...");
      loadData();
    };

    window.addEventListener("reloadThanhLyTable", handleReload);
    return () => window.removeEventListener("reloadThanhLyTable", handleReload);
  }, []);

  // Mở modal chi tiết
  const openDetail = (phieu) => {
    localStorage.setItem("selectedPhieuThanhLy", JSON.stringify(phieu));
    window.dispatchEvent(new Event("openDetailThanhLyModal"));
  };

  // Mở modal chỉnh sửa
  const openEdit = (phieu) => {
    localStorage.setItem("selectedPhieuThanhLy", JSON.stringify(phieu));
    window.dispatchEvent(new Event("openEditThanhLyModal"));
  };

  // Xóa phiếu
  const handleDelete = async (maPhieu) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phiếu thanh lý này?")) return;

    try {
      await thanhLyService.delete(maPhieu);
      toast.success("Xóa phiếu thành công!");
      loadData(); // Reload lại danh sách
    } catch (err) {
      toast.error("Xóa thất bại: " + (err.response?.data || err.message));
    }
  };

  if (loading) {
    return <div className="text-center py-5">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Danh sách phiếu thanh lý</h5>
        <small className="text-muted">{phieuList.length} phiếu</small>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã phiếu</th>
                <th>Số TB</th>
                <th>Thu về</th>
                <th>Người lập</th>
                <th>Ngày lập</th>
                <th>Trạng thái</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {phieuList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    Chưa có phiếu thanh lý nào
                  </td>
                </tr>
              ) : (
                phieuList.map((p) => {
                  const canEditOrDelete = p.trangThai === "Chờ duyệt";

                  return (
                    <tr key={p.maPhieuThanhLy}>
                      <td className="fw-semibold text-primary">
                        {p.maPhieuThanhLy}
                      </td>
                      <td>
                        <span className="badge bg-primary fs-6">
                          {p.tongThietBi}
                        </span>
                      </td>
                      <td className="text-success fw-bold">
                        {new Intl.NumberFormat("vi-VN").format(p.tongGiaTriThuVe)}đ
                      </td>
                      <td>{p.tenNguoiTao}</td>
                      <td>{p.ngayLap}</td>
                      <td>
                        <span className={`badge ${statusColors[p.trangThai] || "bg-secondary"}`}>
                          {p.trangThai}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          {/* Chi tiết - luôn hiện */}
                          <button
                            className="btn btn-sm btn-link text-dark p-1"
                            title="Xem chi tiết"
                            onClick={() => openDetail(p)}
                          >
                            <Eye size={16} />
                          </button>

                          {/* Chỉnh sửa - chỉ khi Chờ duyệt */}
                          {canEditOrDelete && (
                            <button
                              className="btn btn-sm btn-link text-primary p-1"
                              title="Chỉnh sửa"
                              onClick={() => openEdit(p)}
                            >
                              <Edit size={16} />
                            </button>
                          )}

                          {/* Xóa - chỉ khi Chờ duyệt */}
                          {canEditOrDelete && (
                            <button
                              className="btn btn-sm btn-link text-danger p-1"
                              title="Xóa phiếu"
                              onClick={() => handleDelete(p.maPhieuThanhLy)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                          {/* Nếu đã duyệt thì chỉ xem */}
                          {!canEditOrDelete && (
                            <small className="text-muted">Đã xử lý</small>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}