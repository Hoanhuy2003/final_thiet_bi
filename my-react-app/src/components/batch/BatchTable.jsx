import { useState, useEffect, useMemo } from "react";
import { Eye, Package } from "lucide-react";
import { loThietBiService } from "../../services/batchService"; 
import toast from "react-hot-toast";

export default function BatchTable() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. KHỞI TẠO VÀ LẮNG NGHE FILTER
    const [filter, setFilter] = useState(() => {
        try {
            const saved = localStorage.getItem("batchFilters");
            return saved ? JSON.parse(saved) : { search: "", maNCC: "all", maLoai: "all" };
        } catch {
            return { search: "", maNCC: "all", maLoai: "all" };
        }
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await loThietBiService.getAll();
            const data = res.result || res.data || (Array.isArray(res) ? res : []);
            setBatches(data);
        } catch (error) {
            console.error("Lỗi tải danh sách lô:", error);
            toast.error("Không thể tải danh sách lô thiết bị.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        
        const handleFilterChange = () => {
            const saved = localStorage.getItem("batchFilters");
            if (saved) {
                setFilter(JSON.parse(saved));
            }
        };

        // Chỉ lắng nghe 2 sự kiện chính, tránh lỗi vòng lặp
        window.addEventListener("reloadBatchTable", loadData);
        window.addEventListener("batchFilterChange", handleFilterChange);
        
        return () => {
            window.removeEventListener("reloadBatchTable", loadData);
            window.removeEventListener("batchFilterChange", handleFilterChange);
        };
    }, []);
    
    // 2. LOGIC LỌC DỮ LIỆU
    const filteredList = useMemo(() => {
        const searchKey = filter.search?.toLowerCase() || '';
        const maNCCFilter = filter.maNCC;
        const maLoaiFilter = filter.maLoai;

        return batches.filter(batch => {
            // Lọc từ khóa
            const keywordMatch = 
                searchKey === '' ||
                batch.maLo?.toLowerCase().includes(searchKey) ||
                batch.tenLo?.toLowerCase().includes(searchKey) ||
                batch.tenNhaCungCap?.toLowerCase().includes(searchKey);

            // Lọc theo Loại thiết bị
            const loaiMatch = 
                maLoaiFilter === "all" ||
                batch.maLoai === maLoaiFilter;

            // Lọc theo Nhà cung cấp
            const nccMatch = 
                maNCCFilter === "all" ||
                batch.maNhaCungCap === maNCCFilter;

            return keywordMatch && nccMatch && loaiMatch;
        });
    }, [batches, filter]);

    const openDetail = (batch) => {
        localStorage.setItem("selectedBatch", JSON.stringify(batch));
        window.dispatchEvent(new Event("openDetailBatchModal"));
    };

    const formatMoney = (amount) => {
        return amount ? Number(amount).toLocaleString("vi-VN") + "đ" : "0đ";
    };

    const renderStatus = (status) => {
        const s = String(status);
        if (s === '0' || status === null) {
            return <span className="badge bg-warning text-dark">Mới nhập</span>;
        }
        if (s === '1') {
            return <span className="badge bg-success">Đã tạo tài sản</span>;
        }
        return <span className="badge bg-secondary">Khác</span>;
    };

    if (loading) {
        return <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>;
    }

    return (
        <div className="card shadow-sm border-0">
            {/* Header */}
            <div className="card-header bg-white py-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                    <Package className="text-primary" />
                    <h5 className="mb-0 fw-bold text-primary">Danh sách lô thiết bị nhập kho</h5>
                </div>
                <small className="text-muted">
                    Hiển thị <b>{filteredList.length}</b> / {batches.length} kết quả
                </small>
            </div>
            {/* Table */}
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Mã lô</th>
                                <th>Tên lô</th>
                                <th>Loại thiết bị</th>
                                <th className="text-center">Số lượng</th>
                                <th className="text-end">Đơn giá nhập</th>
                                <th className="text-end">Tổng giá trị</th>
                                <th className="text-center">Ngày nhập</th>
                                <th>NCC</th>
                                <th className="text-center">Trạng thái</th>
                                <th className="text-end">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.length > 0 ? (
                                filteredList.map((batch) => (
                                    <tr key={batch.maLo}> 
                                        <td className="fw-bold text-primary small">{batch.maLo}</td>
                                        <td>
                                            <div className="fw-medium text-truncate" style={{maxWidth: "180px"}} title={batch.tenLo}>
                                                {batch.tenLo}
                                            </div>
                                        </td>                  
                                        <td>{batch.tenLoai || "N/A"}</td>
                                        
                                        <td className="text-center fw-bold">{batch.soLuong}</td>
                                        <td className="text-end">{formatMoney(batch.donGia)}</td>
                                        
                                        <td className="text-end fw-bold text-success">{formatMoney(batch.tongTien)}</td>
                                        
                                        <td className="text-center small">
                                            {batch.ngayNhap}
                                        </td>
                                        
                                        <td>{batch.tenNhaCungCap}</td>

                                        <td className="text-center">
                                            {renderStatus(batch.trangThai)}
                                        </td>
                                        
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary border-0" 
                                                    onClick={() => openDetail(batch)}
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-4 text-muted">
                                        Không tìm thấy lô hàng nào phù hợp với bộ lọc.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}