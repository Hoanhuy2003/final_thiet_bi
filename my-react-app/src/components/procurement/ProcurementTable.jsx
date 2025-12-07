import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { deXuatMuaService } from "../../services/deXuatMuaService";
import toast from "react-hot-toast";

// Map trạng thái sang màu sắc (khớp với giá trị trả về từ backend)
const statusColors = {
  "Chờ duyệt": "bg-warning text-dark",
  "Đã duyệt": "bg-success text-white",
  "Từ chối": "bg-danger text-white",
  "Đang mua sắm": "bg-info text-white",
  "Hoàn thành": "bg-primary text-white",
};

export default function ProcurementTable() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu từ API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await deXuatMuaService.getAll();
        
        // Kiểm tra cấu trúc response để lấy mảng dữ liệu
        // Backend bạn gửi trả về trực tiếp mảng hoặc bọc trong .result
        const data = res.data?.result || res.data || res || [];
        setList(Array.isArray(data) ? data : []);
        
      } catch (err) {
        console.error("Lỗi tải danh sách đề xuất:", err);
        toast.error("Không thể tải danh sách đề xuất");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Lắng nghe sự kiện reload
    const handler = () => loadData();
    window.addEventListener("procurementFilterChange", handler);
    return () => window.removeEventListener("procurementFilterChange", handler);
  }, []);

  const openDetail = (request) => {
    localStorage.setItem("selectedProcurement", JSON.stringify(request));
    window.dispatchEvent(new Event("openDetailProcurementModal"));
  };

  const formatMoney = (val) => val ? val.toLocaleString("vi-VN") + "đ" : "0đ";

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p>Đang tải dữ liệu...</p></div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold text-primary">Danh sách đề xuất mua sắm</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-secondary">
              <tr>
                <th className="ps-4">Mã ĐX</th>
                <th style={{width: '30%'}}>Tiêu đề & Nội dung</th>
                <th>Ngày tạo</th>
                <th>Người đề xuất</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th className="text-end pe-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">Chưa có đề xuất nào.</td></tr>
              ) : (
                list.map((req) => (
                  <tr key={req.maDeXuat}>
                    {/* 1. Mã đề xuất */}
                    <td className="ps-4 fw-bold text-primary">{req.maDeXuat}</td>
                    
                    {/* 2. Tiêu đề & Nội dung ngắn */}
                    <td>
                        <div className="fw-semibold text-dark">{req.tieuDe}</div>
                        <small className="text-muted d-block text-truncate" style={{maxWidth: '250px'}}>
                           {req.noiDung}
                        </small>
                    </td>

                    {/* 3. Ngày tạo */}
                    <td>{req.ngayTao}</td>
                    
                    {/* 4. Người tạo */}
                    <td>
                        <div className="fw-medium">{req.tenNguoiTao}</div>
                        {/* Nếu backend chưa trả về đơn vị ở level này thì tạm ẩn */}
                        {/* <small className="text-muted" style={{fontSize: '0.7rem'}}>{req.donVi}</small> */}
                    </td>

                    {/* 5. Tổng tiền */}
                    <td className="fw-bold text-success">
                        {formatMoney(req.tongTien)}
                    </td>

                    {/* 6. Trạng thái */}
                    <td>
                      <span className={`badge rounded-pill fw-normal px-3 py-2 ${statusColors[req.trangThai] || "bg-secondary"}`}>
                        {req.trangThai}
                      </span>
                    </td>

                    {/* 7. Hành động */}
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-light btn-sm text-primary"
                        title="Xem chi tiết"
                        onClick={() => openDetail(req)}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}