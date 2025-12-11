import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import toast from "react-hot-toast";

const statusColors = {
  "Đang sử dụng": "bg-success text-white",
  "Sẵn sàng": "bg-primary text-white",
  "Bảo trì": "bg-warning text-dark",
  "Hỏng hóc": "bg-danger text-white",
  "Chờ thanh lý": "bg-secondary text-white",
  "Đã thanh lý": "bg-dark text-white",
  "Hết khấu hao": "bg-info text-white", // Màu hiển thị cho trạng thái Khấu hao
};

const PAGE_SIZE = 10;
const MAX_VISIBLE_PAGES = 5;

// Helper: Format tiền tệ VND
const formatCurrency = (value) => {
    if (value === null || value === undefined) return "0 đ";
    // Sử dụng Intl.NumberFormat cho số lớn, thêm "đ"
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0 
    }).format(value);
};


export default function EquipmentTable() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters (khởi tạo từ localStorage)
  const [filter, setFilter] = useState(() => {
    try {
      const saved = localStorage.getItem("equipmentFilters");
      return saved
        ? JSON.parse(saved)
        : { search: "", loai: "all", tinhTrang: "all", phong: "all" };
    } catch {
      return { search: "", loai: "all", tinhTrang: "all", phong: "all" };
    }
  });

  const loadData = async (page = currentPage, filterParams = filter) => {
    try {
      setLoading(true);

      const params = {
        page: page,
        size: PAGE_SIZE,
        search: filterParams.search,
        loai: filterParams.loai === "all" ? null : filterParams.loai,
        tinhTrang: filterParams.tinhTrang === "all" ? null : filterParams.tinhTrang,
        phong: filterParams.phong === "all" ? null : filterParams.phong,
      };

      const res = await equipmentService.getAll(params);
      const apiResult = res.result || res.data?.result;

      if (apiResult?.content) {
        const newTotalPages = apiResult.totalPages || 0;
        setList(apiResult.content);
        setTotalPages(newTotalPages);
        setTotalElements(apiResult.totalElements || 0);
        
        // FIX LỖI 1: Tự động lùi trang nếu xóa item cuối cùng
        if (apiResult.content.length === 0 && page > 0 && newTotalPages > 0) {
            setCurrentPage(newTotalPages - 1);
        }
      } else {
        setList([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error("Lỗi load bảng:", err);
      toast.error("Lỗi tải dữ liệu thiết bị");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // USE EFFECT CHÍNH: Chạy lại khi filter hoặc currentPage thay đổi
  // ===========================
  useEffect(() => {
    loadData(currentPage, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, currentPage]);

  // ===========================
  // LẮNG NGHE SỰ KIỆN TỪ BÊN NGOÀI (FIX LỖI CẬP NHẬT FILTER)
  // ===========================
  useEffect(() => {
    const handleFilterChange = () => {
      const saved = localStorage.getItem("equipmentFilters");
      if (saved) {
        const newFilter = JSON.parse(saved);
        const isFilterChanged = JSON.stringify(newFilter) !== JSON.stringify(filter);
        
        setFilter(newFilter);
        
        if (isFilterChanged || currentPage !== 0) {
            setCurrentPage(0);
        } else if (!isFilterChanged && currentPage === 0) {
            loadData(0, newFilter);
        }
      }
    };

    // Reload đơn giản (khi sửa/thêm/xóa)
    const handleReload = () => loadData(currentPage, filter);

    window.addEventListener("equipmentFilterChange", handleFilterChange);
    window.addEventListener("reloadEquipmentTable", handleReload);

    return () => {
      window.removeEventListener("equipmentFilterChange", handleFilterChange);
      window.removeEventListener("reloadEquipmentTable", handleReload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, currentPage]); 

  // ===========================
  // CHUYỂN TRANG
  // ===========================
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  // ===========================
  // HÀNH ĐỘNG (detail / edit / delete)
  // ===========================
  const openDetail = (eq) => {
    localStorage.setItem("selectedEquipment", JSON.stringify(eq));
    window.dispatchEvent(new Event("openDetailEquipmentModal"));
  };

  const openEdit = (eq) => {
    localStorage.setItem("selectedEquipment", JSON.stringify(eq));
    window.dispatchEvent(new Event("openEditEquipmentModal"));
  };

  const handleDelete = async (maTB) => {
    if (!window.confirm(`Bạn có chắc muốn xóa thiết bị ${maTB}?`)) return;

    try {
      await equipmentService.delete(maTB);
      toast.success("Xóa thành công");
      loadData(currentPage, filter); 
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const openDisposal = (eq) => {
    localStorage.setItem("selectedEquipment", JSON.stringify(eq));
    window.dispatchEvent(new Event("openDisposalModal"));
  };
    
  const PaginationButtons = () => {
    if (totalPages <= 1) return null;

    const maxPages = MAX_VISIBLE_PAGES;

    let startPage = Math.max(0, currentPage - Math.floor(maxPages / 2));
    let endPage = startPage + maxPages - 1;

    if (endPage >= totalPages) {
        endPage = totalPages - 1;
        startPage = Math.max(0, endPage - maxPages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="d-flex gap-1 mx-2">

            {/* Previous */}
            <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0 || loading}
            >
                <ChevronLeft size={16} />
            </button>

            {/* Trang đầu + ... */}
            {startPage > 0 && (
                <>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => goToPage(0)}
                        disabled={loading}
                    >
                        1
                    </button>
                    {startPage > 1 && (
                        <span className="btn btn-sm btn-link text-muted disabled">
                            ...
                        </span>
                    )}
                </>
            )}

            {/* Các trang trong phạm vi hiển thị */}
            {pages.map((page) => (
                <button
                    key={page}
                    className={`btn btn-sm ${
                        page === currentPage ? "btn-primary" : "btn-outline-secondary"
                    }`}
                    onClick={() => goToPage(page)}
                    disabled={loading}
                >
                    {page + 1}
                </button>
            ))}

            {/* ... + trang cuối */}
            {endPage < totalPages - 1 && (
                <>
                    {endPage < totalPages - 2 && (
                        <span className="btn btn-sm btn-link text-muted disabled">
                            ...
                        </span>
                    )}
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => goToPage(totalPages - 1)}
                        disabled={loading}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next */}
            <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1 || loading}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};


  // ===========================
  // RENDER
  // ===========================
  return (
    <div className="card shadow-sm border-0">
        
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-primary">Danh sách thiết bị</h5>
          <small className="text-muted">
            Hiển thị <b>{list.length}</b> / {totalElements} kết quả
          </small>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã TB</th>
                <th>Tên thiết bị</th>
                <th>Serial</th>
                <th>Thông số kỹ thuật</th>
                <th>Loại</th>
                <th>Phòng</th>
                <th className="text-end">Giá trị gốc</th>
                <th className="text-end">Còn lại</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-5 text-muted">
                    Không tìm thấy thiết bị phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                list.map((eq) => (
                  <tr key={eq.maTB}>
                    <td className="fw-bold text-primary small">{eq.maTB}</td>
                    <td>
                      <div
                        className="fw-medium text-truncate"
                        style={{ maxWidth: "180px" }}
                        title={eq.tenTB}
                      >
                        {eq.tenTB}
                      </div>
                    </td>
                    <td className="text-muted small">{eq.soSeri || "N/A"}</td>
                    <td>
                      <div
                        className="text-truncate small"
                        style={{ maxWidth: "150px" }}
                        title={eq.thongSoKyThuat}
                      >
                        {eq.thongSoKyThuat || "N/A"}
                      </div>
                    </td>
                    
                    {/* CỘT LOẠI (FIXED: Dùng string từ DTO, hoặc tên object nếu DTO bị lỗi) */}
                    <td>
                      <span className="badge bg-light text-dark border">
                        {typeof eq.loai === 'object' ? eq.loai.tenLoai : eq.loai || "N/A"}
                      </span>
                    </td>
                    
                    {/* CỘT PHÒNG (FIXED: Dùng string từ DTO, hoặc tên object nếu DTO bị lỗi) */}
                    <td>{typeof eq.phong === 'object' ? eq.phong.tenPhong : eq.phong || "Chưa gán"}</td>
                    
                    {/* Giá trị gốc */}
                    <td className="text-end text-muted small">
                      {formatCurrency(eq.giaTriBanDau)}
                    </td>
                    
                    {/* Giá trị còn lại */}
                    <td className="text-end fw-bold">
                      {formatCurrency(eq.giaTriHienTai)}
                    </td>
                    <td className="text-center">
                      <span className={`badge ${statusColors[eq.tinhTrang] || "bg-secondary"}`}>
                        {eq.tinhTrang || "N/A"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary border-0"
                          onClick={() => openDetail(eq)}
                          title="Xem"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-dark border-0"
                          onClick={() => openEdit(eq)}
                          title="Sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning border-0"
                          onClick={() => openDisposal(eq)}
                          title="Thanh lý"
                        >
                          
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="card-footer bg-white d-flex justify-content-between align-items-center">
        <small className="text-muted">
          Trang {currentPage + 1} trên {totalPages}
        </small>

        <PaginationButtons />
      </div>
    </div>
  );
}