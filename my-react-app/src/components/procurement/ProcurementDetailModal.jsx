import { useState, useEffect, useRef } from "react";
import { Check, X, Package, Download, RefreshCw } from "lucide-react"; 
import { deXuatMuaService } from "../../services/deXuatMuaService";
import { getUserRole, getUserId } from "../../services/authService"; 
import toast from "react-hot-toast";

export default function ProcurementDetailModal() {
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
    const [reloading, setReloading] = useState(false); // Loading riêng cho reload
    
    // Dùng Ref để giữ giá trị maDeXuat mới nhất cho Event Listener
    const currentRequestRef = useRef(null);

    const currentUserId = getUserId(); 
    const role = getUserRole();
    const canApprove = ['ADMIN', 'HIEUTRUONG'].includes(role);

    // --- HÀM TẢI LẠI CHI TIẾT ---
    const loadDetail = async (maDeXuat) => {
        if (!maDeXuat) return;
        try {
            setReloading(true);
            const res = await deXuatMuaService.getById(maDeXuat);
            const newData = res.data?.result || res.data || res;
            
            setRequest(newData);
            currentRequestRef.current = newData; // Cập nhật Ref
            
        } catch (err) {
            console.error("Lỗi reload chi tiết:", err);
        } finally {
            setReloading(false);
        }
    };

    // 1. MỞ MODAL
    useEffect(() => {
        const handler = () => {
            const data = localStorage.getItem("selectedProcurement");
            if (data) {
                const parsed = JSON.parse(data);
                setRequest(parsed);
                currentRequestRef.current = parsed; // Lưu vào Ref
                setIsOpen(true);
                
                // Gọi API lấy dữ liệu mới nhất
                loadDetail(parsed.maDeXuat); 
            }
        };
        window.addEventListener("openDetailProcurementModal", handler);
        return () => window.removeEventListener("openDetailProcurementModal", handler);
    }, []);

    // 2. LẮNG NGHE SỰ KIỆN RELOAD (SỬA LẠI ĐỂ CHẮC CHẮN CHẠY)
    useEffect(() => {
        const reloadHandler = () => {
            // Lấy mã từ Ref để đảm bảo không bị null hoặc cũ
            const ma = currentRequestRef.current?.maDeXuat;
            if (isOpen && ma) {
                console.log("Đang tải lại dữ liệu cho đề xuất:", ma);
                // Thêm delay 300ms để chờ Backend commit xong dữ liệu nhập kho
                setTimeout(() => {
                    loadDetail(ma);
                }, 300);
            }
        };

        // Lắng nghe cả 2 sự kiện
        window.addEventListener("reloadBatchTable", reloadHandler); 
        window.addEventListener("procurementFilterChange", reloadHandler);

        return () => {
            window.removeEventListener("reloadBatchTable", reloadHandler);
            window.removeEventListener("procurementFilterChange", reloadHandler);
        };
    }, [isOpen]); // Chỉ phụ thuộc isOpen


    // --- CÁC HÀM XỬ LÝ KHÁC ---
    const handleOpenImport = (item) => {
        const slDaNhap = item.da_nhap || 0; 
        const slConThieu = item.soLuong - slDaNhap;

        const importData = {
            maCTDX: item.maCTDX,
            tenLo: "Lô " + (item.tenLoaiThietBi || "Thiết bị"), 
            soLuong: slConThieu > 0 ? slConThieu : 1, 
            donGia: item.donGia,
            maNhaCungCap: "",
            ghiChu: item.ghiChu
        };
        
        localStorage.setItem("importBatchData", JSON.stringify(importData));
        window.dispatchEvent(new Event("openImportBatchModal"));
    };

    const handleApprove = async () => {
        if (!currentUserId) { toast.error("Lỗi xác thực."); return; }
        if (!window.confirm("Duyệt đề xuất này?")) return;
        setLoading(true);
        try {
            const res = await deXuatMuaService.approve(request.maDeXuat, currentUserId);
            const newData = res.data?.result || res.data || res;
            setRequest(newData); 
            currentRequestRef.current = newData;
            toast.success("Đã duyệt thành công!");
            window.dispatchEvent(new Event("procurementFilterChange"));
        } catch (err) {
            toast.error("Lỗi: " + (err.response?.data?.message || err.message));
        } finally { setLoading(false); }
    };

    const handleReject = async () => {
        if (!currentUserId) { toast.error("Lỗi xác thực."); return; }
        if (!window.confirm("Từ chối đề xuất này?")) return;
        setLoading(true);
        try {
            const res = await deXuatMuaService.reject(request.maDeXuat, currentUserId);
            const newData = res.data?.result || res.data || res;
            setRequest(newData); 
            currentRequestRef.current = newData;
            toast.success("Đã từ chối!");
            window.dispatchEvent(new Event("procurementFilterChange"));
        } catch (err) {
            toast.error("Lỗi: " + (err.response?.data?.message || err.message));
        } finally { setLoading(false); }
    };

    const formatMoney = (val) => val ? val.toLocaleString("vi-VN") + "đ" : "0đ";
    const formatDate = (dateVal) => {
        if (!dateVal) return "...";
        if (Array.isArray(dateVal)) return `${dateVal[2]}/${dateVal[1]}/${dateVal[0]}`;
        return new Date(dateVal).toLocaleDateString("vi-VN");
    };

    if (!isOpen || !request) return null;
    const isPending = request.trangThai === "Chờ duyệt" || request.trangThai === "CHO_DUYET";
    const isApproved = request.trangThai === "Đã duyệt" || request.trangThai === "DA_DUYET";
    
    const isProcuringOrComplete = [
        "Đã duyệt", "DA_DUYET", 
        "Đang mua sắm", "DANG_MUA_SAM", 
        "Hoàn thành", "HOAN_THANH"
    ].includes(request.trangThai);

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content border-0 shadow-lg">
                    {/* Header */}
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title d-flex align-items-center gap-2">
                            <Package size={20} /> Chi tiết đề xuất: {request.maDeXuat}
                            {reloading && <RefreshCw size={16} className="animate-spin ms-2" />}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
                    </div>
                    
                    <div className="modal-body bg-light">
                        {/* Thông tin chung */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="fw-bold text-muted small text-uppercase">Người đề xuất</label>
                                        <div className="fw-medium text-dark">{request.tenNguoiTao}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="fw-bold text-muted small text-uppercase">Ngày tạo</label>
                                        <div className="fw-medium text-dark">{formatDate(request.ngayTao)}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="fw-bold text-muted small text-uppercase">Tổng tiền</label>
                                        <div className="text-success fw-bold fs-5">{formatMoney(request.tongTien)}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="fw-bold text-muted small text-uppercase">Trạng thái</label>
                                        <div><span className={`badge ${statusColors[request.trangThai]}`}>{request.trangThai}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DANH SÁCH CHI TIẾT */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white py-3 d-flex justify-content-between">
                                <h6 className="mb-0 fw-bold text-primary">Danh sách thiết bị cần mua</h6>
                                {reloading && <small className="text-muted fst-italic">Đang cập nhật...</small>}
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-3">Tên loại thiết bị</th>
                                            <th className="text-center">Số lượng</th>
                                            <th className="text-end">Đơn giá dự kiến</th>
                                            <th className="text-end">Thành tiền</th>
                                            <th className="text-center" style={{width: '140px'}}>Tác vụ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {request.chiTiet?.length > 0 ? (
                                            request.chiTiet.map((item, idx) => {
                                                const slCanMua = item.soLuong || 0;
                                                const slDaNhap = item.da_nhap || 0; 
                                                const isCompleted = slDaNhap >= slCanMua;

                                                return (
                                                    <tr key={idx}>
                                                        <td className="ps-3">
                                                            <span className="fw-medium text-dark">{item.tenLoaiThietBi}</span>
                                                            {item.ghiChu && <div className="small text-muted fst-italic">{item.ghiChu}</div>}
                                                        </td>
                                                        
                                                        <td className="text-center">
                                                            <span className="fw-bold fs-6">{slCanMua}</span>
                                                            {slDaNhap > 0 && (
                                                                <div className={`small fw-bold mt-1 ${isCompleted ? 'text-success' : 'text-warning'}`}>
                                                                    Đã về: {slDaNhap}/{slCanMua}
                                                                </div>
                                                            )}
                                                        </td>
                                                        
                                                        <td className="text-end">{formatMoney(item.donGia)}</td>
                                                        <td className="text-end fw-bold text-success">{formatMoney(item.thanhTien)}</td>
                                                        
                                                        {/* CỘT TÁC VỤ */}
                                                        <td className="text-center">
                                                            {isProcuringOrComplete && !isCompleted ? (
                                                                <button 
                                                                    className={`btn btn-sm ${slDaNhap > 0 ? 'btn-warning text-dark' : 'btn-primary'} d-flex align-items-center justify-content-center w-100 fw-medium shadow-sm`}
                                                                    onClick={() => handleOpenImport(item)}
                                                                    title={`Còn thiếu ${slCanMua - slDaNhap} chiếc`}
                                                                >
                                                                    <Download size={14} className="me-1"/> 
                                                                    {slDaNhap > 0 ? "Nhập tiếp" : "Nhập kho"}
                                                                </button>
                                                            ) : isCompleted ? (
                                                                <span className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1">
                                                                    <Check size={14} className="me-1"/> Đủ hàng
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted small">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr><td colSpan="5" className="text-center py-4 text-muted">Không có dữ liệu chi tiết</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer bg-light">
                        <button className="btn btn-secondary px-4" onClick={() => setIsOpen(false)}>Đóng</button>
                        
                        {isPending && canApprove && (
                            <>
                                <button className="btn btn-danger px-3 d-flex align-items-center gap-2" onClick={handleReject}>
                                    <X size={18}/> Từ chối
                                </button>
                                <button className="btn btn-success px-3 d-flex align-items-center gap-2" onClick={handleApprove}>
                                    <Check size={18}/> Phê duyệt
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}