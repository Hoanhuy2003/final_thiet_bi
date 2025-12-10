import { useState, useEffect, useMemo } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
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

const PAGE_SIZE = 10;
const MAX_VISIBLE_PAGES = 5;

export default function ProcurementTable() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters (Khởi tạo từ localStorage)
  const [filter, setFilter] = useState(() => {
    try {
      const saved = localStorage.getItem("procurementFilters");
      return saved 
        ? JSON.parse(saved) 
        : { search: "", trangThai: null, nguoiTao: null };
    } catch {
      return { search: "", trangThai: null, nguoiTao: null };
    }
  });

  // ===========================
  // LOAD DATA (Sửa để hỗ trợ Phân trang/Lọc)
  // ===========================
  const loadData = async (page = currentPage, filterParams = filter) => {
    try {
      setLoading(true);
      
      // Tham số gửi lên Backend (Backend cần phải triển khai searchAndFilter)
      const params = {
        page: page,
        size: PAGE_SIZE,
        search: filterParams.search,
        trangThai: filterParams.trangThai,
        nguoiTao: filterParams.nguoiTao, // maND
      };
      const res = await deXuatMuaService.getAllPage(params); 
      
      const apiResult = res.result || res.data?.result;

      if (apiResult?.content) {
        const newTotalPages = apiResult.totalPages || 0;
        setList(apiResult.content);
        setTotalPages(newTotalPages);
        setTotalElements(apiResult.totalElements || 0);

        // Tự động lùi trang nếu trang hiện tại bị rỗng sau khi xóa
        if (apiResult.content.length === 0 && page > 0 && newTotalPages > 0) {
            setCurrentPage(newTotalPages - 1);
        }
      } else {
        setList([]);
        setTotalPages(0);
        setTotalElements(0);
      }

    } catch (err) {
      console.error("Lỗi tải danh sách đề xuất:", err);
      toast.error("Không thể tải danh sách đề xuất");
    } finally {
      setLoading(false);
    }
  };
    
  // ===========================
  // USE EFFECT: Đồng bộ hóa State
  // ===========================
  useEffect(() => {
    loadData(currentPage, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, currentPage]);

  useEffect(() => {
    const handleFilterChange = () => {
      const saved = localStorage.getItem("procurementFilters");
      if (saved) {
        const newFilter = JSON.parse(saved);
        const isFilterChanged = JSON.stringify(newFilter) !== JSON.stringify(filter);
        
        setFilter(newFilter);
        
        // Reset về trang 0 nếu filter thay đổi hoặc đang ở trang khác 0
        if (isFilterChanged || currentPage !== 0) {
            setCurrentPage(0);
        } else if (!isFilterChanged && currentPage === 0) {
            // Buộc reload nếu ở trang 0 và filter không đổi (để cập nhật bảng)
            loadData(0, newFilter);
        }
      }
    };

    const handler = () => loadData(currentPage, filter);
    window.addEventListener("procurementFilterChange", handleFilterChange);
    window.addEventListener("reloadProcurementTable", handler);

    return () => {
      window.removeEventListener("procurementFilterChange", handleFilterChange);
      window.removeEventListener("reloadProcurementTable", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, currentPage]);

  // ===========================
  // HÀM CHUYỂN TRANG
  // ===========================
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };
    
    // ===========================
    // LOGIC TẠO NÚT PHÂN TRANG
    // ===========================
    const PaginationButtons = () => {
        if (totalPages <= 1) return null;

        let startPage = Math.max(0, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
        let endPage = Math.min(totalPages - 1, startPage + MAX_VISIBLE_PAGES - 1);

        if (endPage - startPage < MAX_VISIBLE_PAGES - 1) {
            startPage = Math.max(0, endPage - MAX_VISIBLE_PAGES + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="d-flex gap-1 mx-2">
                {/* Nút Previous */}
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 0 || loading}
                >
                    <ChevronLeft size={16} />
                </button>
                
                {/* Hiển thị trang 1 và dấu ... */}
                {startPage > 0 && (
                    <>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => goToPage(0)}
                            disabled={loading}
                        >
                            1
                        </button>
                        {startPage > 1 && <span className="btn btn-sm btn-link text-muted disabled">...</span>}
                    </>
                )}

                {/* Các nút trang chính */}
                {pages.map(page => (
                    <button
                        key={page}
                        className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => goToPage(page)}
                        disabled={loading}
                    >
                        {page + 1}
                    </button>
                ))}

                {/* Hiển thị trang cuối cùng và dấu ... */}
                {endPage < totalPages - 1 && (
                    <>
                        {endPage < totalPages - 2 && <span className="btn btn-sm btn-link text-muted disabled">...</span>}
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => goToPage(totalPages - 1)}
                            disabled={loading}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Nút Next */}
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

  const openDetail = (request) => {
    localStorage.setItem("selectedProcurement", JSON.stringify(request));
    window.dispatchEvent(new Event("openDetailProcurementModal"));
  };

  const formatMoney = (val) => val ? val.toLocaleString("vi-VN") + "đ" : "0đ";

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p>Đang tải dữ liệu...</p></div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-primary">Danh sách đề xuất mua sắm</h5>
          <small className="text-muted">
            Hiển thị <b>{list.length}</b> / {totalElements} kết quả
          </small>
        </div>
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
        
      {/* PAGINATION FOOTER */}
      <div className="card-footer bg-white d-flex justify-content-between align-items-center">
        <small className="text-muted">
          Trang {currentPage + 1} trên {totalPages}
        </small>
        <PaginationButtons />
      </div>
    </div>
  );
}