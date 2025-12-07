import { useState, useEffect } from "react";
import { Check, X, Calendar, DollarSign, Package, UserCircle } from "lucide-react"; 
import { deXuatMuaService } from "../../services/deXuatMuaService";
import { getUserRole, getUserId } from "../../services/authService"; 
import toast from "react-hot-toast";

export default function ProcurementDetailModal() {
    // === 1. KHAI BÁO CÁC CONSTANT BÊN TRONG COMPONENT ===
    // FIX: Đưa vào trong component để tránh ReferenceError
    const statusColors = {
        "CHO_DUYET": "bg-warning text-dark",
        "DA_DUYET": "bg-success text-white",
        "TU_CHOI": "bg-danger text-white",
        "Chờ duyệt": "bg-warning text-dark",
        "Đã duyệt": "bg-success text-white",
        "Từ chối": "bg-danger text-white",
    };

    const [isOpen, setIsOpen] = useState(false);
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(false); 
    
   
    const currentUserId = getUserId(); 

    const role = getUserRole();
    const canApprove = ['ADMIN', 'HIEUTRUONG'].includes(role);

    useEffect(() => {
        // Lắng nghe sự kiện mở modal
        const handler = () => {
            const data = localStorage.getItem("selectedProcurement");
            if (data) {
                setRequest(JSON.parse(data));
                setIsOpen(true);
            }
        };
        window.addEventListener("openDetailProcurementModal", handler);
        return () => window.removeEventListener("openDetailProcurementModal", handler);
    }, []);

    // Hàm xử lý duyệt
    const handleApprove = async () => {
      console.log("--- DEBUG START ---");
    console.log("Mã đề xuất:", request.maDeXuat);
    console.log("ID người duyệt (currentUserId):", currentUserId); 
    console.log("--- DEBUG END ---");
        if (!currentUserId) { toast.error("Không tìm thấy ID người duyệt."); return; }
        if (!window.confirm("Bạn chắc chắn muốn duyệt đề xuất này?")) return;
        
        setLoading(true);
        try {
            // Gọi API duyệt (Service trả về DeXuatMuaResponse đã update)
            const res = await deXuatMuaService.approve(request.maDeXuat, currentUserId); 
            
            // Cập nhật state modal bằng dữ liệu mới trả về từ service
            setRequest(res.data?.result || res.data || res); 
            
            toast.success("Đã duyệt đề xuất thành công!");
            window.dispatchEvent(new Event("procurementFilterChange")); // Reload bảng
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi duyệt: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý từ chối
    const handleReject = async () => {
        if (!currentUserId) { toast.error("Không tìm thấy ID người duyệt."); return; }
        if (!window.confirm("Bạn chắc chắn muốn từ chối?")) return;
        
        setLoading(true);
        try {
            const res = await deXuatMuaService.reject(request.maDeXuat, currentUserId); 
            
            // Cập nhật state modal bằng dữ liệu mới trả về từ service
            setRequest(res.data?.result || res.data || res); 

            toast.success("Đã từ chối đề xuất thành công!");
            window.dispatchEvent(new Event("procurementFilterChange")); // Reload bảng
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi từ chối: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const formatMoney = (val) => val ? val.toLocaleString("vi-VN") + "đ" : "0đ";
    
    const formatDate = (dateVal) => {
        if (!dateVal) return "...";
        // Xử lý cả kiểu mảng (Java LocalDate) và kiểu chuỗi
        if (Array.isArray(dateVal)) return `${dateVal[2]}/${dateVal[1]}/${dateVal[0]}`;
        return new Date(dateVal).toLocaleDateString("vi-VN");
    };

    if (!isOpen || !request) return null;

    const isPending = request.trangThai === "Chờ duyệt" || request.trangThai === "CHO_DUYET";

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title d-flex align-items-center gap-2">
                            <Package size={20} /> Chi tiết đề xuất: {request.maDeXuat}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)} disabled={loading}></button>
                    </div>
                    
                    <div className="modal-body">
                        {/* Thông tin chung */}
                        <div className="row g-3 mb-4">
                            {/* ... (Các trường thông tin cơ bản) ... */}

                            <div className="col-md-6">
                                <label className="fw-bold text-muted small text-uppercase">Người đề xuất</label>
                                <div className="fw-medium">{request.tenNguoiTao}</div>
                            </div>

                            <div className="col-md-6">
                                <label className="fw-bold text-muted small text-uppercase">Ngày tạo</label>
                                <div className="d-flex align-items-center gap-2">
                                    <Calendar size={16} /> {formatDate(request.ngayTao)}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="fw-bold text-muted small text-uppercase">Tổng tiền dự kiến</label>
                                <div className="fs-5 fw-bold text-success d-flex align-items-center gap-2">
                                    <DollarSign size={20} /> {formatMoney(request.tongTien)}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="fw-bold text-muted small text-uppercase">Trạng thái</label>
                                <div>
                                    <span className={`badge ${statusColors[request.trangThai] || "bg-secondary"} fs-6`}>
                                        {request.trangThai}
                                    </span>
                                </div>
                            </div>
                            
                            {/* THÔNG TIN NGƯỜI DUYỆT */}
                            {request.maNguoiDuyet && (
                                <>
                                    <div className="col-md-6 border-top pt-3">
                                        <label className="fw-bold text-muted small text-uppercase">Người phê duyệt</label>
                                        <div className="d-flex align-items-center gap-2 fw-medium text-primary">
                                            <UserCircle size={16} /> {request.tenNguoiDuyet} ({request.maNguoiDuyet})
                                        </div>
                                    </div>
                                    <div className="col-md-6 border-top pt-3">
                                        <label className="fw-bold text-muted small text-uppercase">Ngày phê duyệt</label>
                                        <div className="d-flex align-items-center gap-2 fw-medium">
                                            <Calendar size={16} /> {formatDate(request.ngayDuyet)}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Danh sách chi tiết (Table con) */}
                        <h6 className="border-bottom pb-2 mb-3 fw-bold text-primary">Danh sách thiết bị cần mua</h6>
                        <div className="table-responsive border rounded">
                            <table className="table table-sm table-striped mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Tên loại</th>
                                        <th className="text-center">Số lượng</th>
                                        <th className="text-end">Đơn giá</th>
                                        <th className="text-end">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {request.chiTiet?.length > 0 ? (
                                        request.chiTiet.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.tenLoaiThietBi}</td>
                                                <td className="text-center fw-bold">{item.soLuong}</td>
                                                <td className="text-end">{formatMoney(item.donGia)}</td>
                                                <td className="text-end fw-bold">{formatMoney(item.thanhTien)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center py-3 text-muted">Không có chi tiết</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    <div className="modal-footer bg-light">
                        <button className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={loading}>Đóng</button>
                        
                        {/* Chỉ hiện nút duyệt nếu trạng thái là CHO_DUYET và user có quyền */}
                        {isPending && canApprove && (
                            <>
                                <button className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={handleReject} disabled={loading}>
                                    <X size={18} /> Từ chối
                                </button>
                                <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleApprove} disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm"></span> : <Check size={18} />}
                                    Phê duyệt
                                </button>
                            </>
                        )}
                        
                        {/* Hiển thị thông báo nếu đã duyệt */}
                        {request.maNguoiDuyet && !isPending && (
                            <span className="text-success small fw-bold">Phiếu đã được xử lý.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}