import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { deXuatMuaService } from '../../services/deXuatMuaService';
import { getMyInfo } from '../../services/userService';
import { getUserId } from '../../services/authService';
import { Plus, Save, User, Building, MapPin, Monitor, List, Clock, RefreshCcw, Eye, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select';

// --- CẤU HÌNH TRẠNG THÁI ---
const STATUS_COLORS = {
    "Chờ duyệt": { label: "Chờ duyệt", class: "bg-warning text-dark" },
    "Đã duyệt": { label: "Đã duyệt", class: "bg-success text-white" },
    "Từ chối": { label: "Đã Từ chối", class: "bg-danger text-white" },
};

const getStatusBadge = (status) => {
    const s = STATUS_COLORS[status] || { label: status || "Mới", class: "bg-secondary text-white" };
    return <span className={`badge ${s.class}`}>{s.label}</span>;
};

export default function UserProcurement() {
    const currentUserId = getUserId();
    const [activeTab, setActiveTab] = useState('create');

    // --- STATE FORM ---
    const [loaiOptions, setLoaiOptions] = useState([]);
    const [phongOptions, setPhongOptions] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [loadingForm, setLoadingForm] = useState(false);
    
    const [form, setForm] = useState({
        tieuDe: '',
        noiDung: '',
        maPhong: null,
        item: { maLoai: null, soLuong: 1, donGia: 0, ghiChu: '' }
    });

    // --- STATE DANH SÁCH ---
    const [listData, setListData] = useState([]);
    const [loadingList, setLoadingList] = useState(false);

    // ================== LOGIC LOAD DỮ LIỆU ==================
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [resLoai, userData, resPhong] = await Promise.all([
                    axiosInstance.get("/api/loai_thiet_bi"),
                    getMyInfo(),
                    axiosInstance.get("/api/phong")
                ]);

                setLoaiOptions((resLoai.data.result || resLoai.data || []).map(l => ({ value: l.maLoai, label: l.tenLoai })));

                if (userData) {
                    setUserInfo(userData);
                    if (userData.donVi) {
                        const myUnitId = userData.donVi.maDonVi;
                        const allPhongs = resPhong.data.result || resPhong.data || [];
                        setPhongOptions(allPhongs
                            .filter(p => String(p.maDonVi).trim() === myUnitId)
                            .map(p => ({ value: p.maPhong, label: p.tenPhong }))
                        );
                    }
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            }
        };
        fetchMasterData();
    }, []);

    const fetchMyList = useCallback(async () => {
        if (!currentUserId) return;
        setLoadingList(true);
        try {
            const response = await deXuatMuaService.getAll(0, 50, null, null, currentUserId);
            const content = response.result?.content || response.content || [];
            
            // Log để kiểm tra cấu trúc dữ liệu trả về xem tên loại nằm đâu
            console.log("Dữ liệu danh sách:", content);

            setListData(content.sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao)));
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
        } finally {
            setLoadingList(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        if (activeTab === 'list') fetchMyList();
    }, [activeTab, fetchMyList]);

    // ================== HANDLERS ==================
    const handleChangeInfo = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSelectPhong = (opt) => setForm({ ...form, maPhong: opt ? opt.value : null });
    const handleChangeItem = (field, value) => {
        let updatedValue = value;
        if (field === 'soLuong' || field === 'donGia') updatedValue = value === '' ? 0 : Number(value);
        setForm({ ...form, item: { ...form.item, [field]: updatedValue } });
    };
    const handleSelectLoai = (opt) => {
        setForm({ ...form, item: { ...form.item, maLoai: opt ? opt.value : null } });
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUserId) return toast.error("Vui lòng đăng nhập lại.");
        if (!form.tieuDe.trim()) return toast.error("Chưa nhập tiêu đề.");
        if (!form.maPhong) return toast.error("Chưa chọn phòng.");
        if (!form.item.maLoai) return toast.error("Chưa chọn loại thiết bị.");
        if (form.item.soLuong <= 0) return toast.error("Số lượng > 0.");

        const payload = {
            tieu_de: form.tieuDe.trim(),
            noi_dung: form.noiDung,
            ma_nd: currentUserId,
            ma_phong: form.maPhong,
            chi_tiet: [{
                ma_loai: form.item.maLoai,
                so_luong: Number(form.item.soLuong),
                don_gia: Number(form.item.donGia),
                ghi_chu: form.item.ghiChu
            }]
        };

        setLoadingForm(true);
        try {
            await deXuatMuaService.create(payload);
            toast.success("✅ Gửi đề xuất thành công!");
            setForm({ 
                tieuDe: '', noiDung: '', maPhong: null, 
                item: { maLoai: null, soLuong: 1, donGia: 0, ghiChu: '' } 
            });
            setActiveTab('list');
            fetchMyList(); 
        } catch (err) {
            console.error(err);
            toast.error("Lỗi: " + (err.response?.data?.message || err.message));
        } finally {
            setLoadingForm(false);
        }
    };

    // ================== RENDER ==================
    const selectStyles = { control: (base) => ({ ...base, borderColor: '#dee2e6', borderRadius: '0.375rem', minHeight: '38px' }), menu: (base) => ({ ...base, zIndex: 9999 }) };
    const totalAmount = (form.item.soLuong || 0) * (form.item.donGia || 0);

    return (
        <div className="container-fluid p-0">
            <ul className="nav nav-pills mb-4 bg-white p-2 rounded shadow-sm">
                <li className="nav-item">
                    <button className={`nav-link fw-bold d-flex align-items-center gap-2 ${activeTab === 'create' ? 'active bg-success' : 'text-secondary'}`} onClick={() => setActiveTab('create')}>
                        <Plus size={18}/> Tạo Đề Xuất Mới
                    </button>
                </li>
                <li className="nav-item ms-2">
                    <button className={`nav-link fw-bold d-flex align-items-center gap-2 ${activeTab === 'list' ? 'active bg-primary' : 'text-secondary'}`} onClick={() => setActiveTab('list')}>
                        <List size={18}/> Lịch Sử Đề Xuất
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {/* 1. TAB TẠO */}
                {activeTab === 'create' && (
                    <div className="card shadow-lg border-0 fade-in">
                        <div className="card-header bg-white py-3 border-bottom">
                            <h5 className="mb-0 fw-bold text-success">Thông tin phiếu đề xuất</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Info User */}
                                <div className="alert alert-light border d-flex justify-content-between align-items-center mb-4 py-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <User size={18} className="text-secondary"/>
                                        <span className="fw-bold text-dark">{userInfo?.hoTen || "..."}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Building size={18} className="text-secondary"/>
                                        <span className="fw-bold text-primary">{userInfo?.donVi?.tenDonVi || "..."}</span>
                                    </div>
                                </div>

                                {/* Inputs */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-8">
                                        <label className="form-label fw-bold">Tiêu đề phiếu <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" name="tieuDe" value={form.tieuDe} onChange={handleChangeInfo} placeholder="VD: Mua sắm máy tính cho phòng thực hành..." required />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold d-flex align-items-center gap-1"><MapPin size={16}/> Phòng <span className="text-danger">*</span></label>
                                        <Select options={phongOptions} onChange={handleSelectPhong} value={phongOptions.find(op => op.value === form.maPhong)} placeholder="🔍 Chọn phòng..." styles={selectStyles} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-bold">Lý do / Ghi chú chung</label>
                                        <textarea className="form-control" rows="2" name="noiDung" value={form.noiDung} onChange={handleChangeInfo} placeholder="Mô tả chi tiết mục đích..."></textarea>
                                    </div>
                                </div>

                                {/* Chi tiết */}
                                <label className="form-label fw-bold text-primary border-bottom pb-2 mb-3 w-100 d-block">Chi tiết thiết bị cần mua</label>
                                <div className="bg-light p-3 rounded border mb-3">
                                    <div className="row g-3">
                                        <div className="col-md-12">
                                            <label className="form-label small fw-bold text-muted"><Monitor size={14}/> Loại thiết bị <span className="text-danger">*</span></label>
                                            <Select 
                                                options={loaiOptions} 
                                                onChange={handleSelectLoai} 
                                                value={loaiOptions.find(op => op.value === form.item.maLoai)} 
                                                placeholder="🔍 Chọn loại thiết bị..." 
                                                styles={selectStyles} 
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted">Cấu hình / Mô tả kỹ thuật</label>
                                            <input type="text" className="form-control" value={form.item.ghiChu} onChange={(e) => handleChangeItem('ghiChu', e.target.value)} placeholder="VD: Core i5, RAM 8GB..." />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label small fw-bold text-muted">Số lượng <span className="text-danger">*</span></label>
                                            <input type="number" className="form-control fw-bold text-center" value={form.item.soLuong} onChange={(e) => handleChangeItem('soLuong', e.target.value)} min="1" />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label small fw-bold text-muted">Đơn giá dự kiến (VNĐ)</label>
                                            <input type="number" className="form-control text-end" value={form.item.donGia} onChange={(e) => handleChangeItem('donGia', e.target.value)} min="0" />
                                        </div>
                                    </div>
                                    <div className="row mt-3 pt-2 border-top">
                                        <div className="col-12 text-end">
                                            <span className="text-muted me-2">Thành tiền dự kiến:</span>
                                            <span className="fw-bold text-success fs-5">{totalAmount.toLocaleString('vi-VN')} đ</span>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-success w-100 fw-bold py-2 shadow-sm" disabled={loadingForm}>
                                    {loadingForm ? "Đang gửi..." : <><Save size={18} className="me-2"/> Gửi Đề Xuất</>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* 2. TAB DANH SÁCH (ĐÃ SỬA ÁNH XẠ) */}
                {activeTab === 'list' && (
                    <div className="card shadow-sm border-0 fade-in">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold text-primary">Danh sách đề xuất của tôi</h5>
                            <button className="btn btn-sm btn-outline-secondary" onClick={fetchMyList} title="Tải lại">
                                <RefreshCcw size={16} className={loadingList ? "animate-spin" : ""}/>
                            </button>
                        </div>
                        <div className="card-body p-0">
                            {loadingList ? (
                                <div className="text-center py-5 text-muted">Đang tải dữ liệu...</div>
                            ) : listData.length === 0 ? (
                                <div className="text-center py-5 text-muted">Bạn chưa có đề xuất nào.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">Mã phiếu</th>
                                                <th>Tiêu đề / Nội dung</th>
                                                <th>Loại TB</th>
                                                <th>Tổng tiền</th>
                                                <th>Ngày tạo</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listData.map(item => {
                                                // --- LOGIC ÁNH XẠ TÊN LOẠI TỪ CHI TIẾT ---
                                                // Kiểm tra nếu có mảng chiTiet và có ít nhất 1 phần tử
                                                const firstDetail = (item.chiTiet && item.chiTiet.length > 0) ? item.chiTiet[0] : null;
                                                const tenLoaiHienThi = firstDetail 
                                                    ? (firstDetail.tenLoai || firstDetail.tenLoaiThietBi || "---") 
                                                    : "---";
                                                // ------------------------------------------

                                                return (
                                                    <tr key={item.maDeXuat}>
                                                        <td className="fw-bold text-primary small ps-3">{item.maDeXuat}</td>
                                                        <td>
                                                            <div className="fw-bold text-dark">{item.tieuDe}</div>
                                                            <small className="text-muted d-flex align-items-center gap-1 text-truncate" style={{maxWidth: '250px'}}>
                                                                <FileText size={12}/> {item.noiDung}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            {/* HIỂN THỊ TÊN LOẠI ĐÃ ÁNH XẠ */}
                                                            <span className="badge bg-light text-dark border">
                                                                {tenLoaiHienThi}
                                                            </span>
                                                        </td>
                                                        <td className="fw-bold text-success">
                                                            {(item.tongTien || 0).toLocaleString('vi-VN')} đ
                                                        </td>
                                                        <td className="text-muted small">
                                                            <div className="d-flex align-items-center">
                                                                <Clock size={12} className="me-1"/>
                                                                {item.ngayTao ? new Date(item.ngayTao).toLocaleDateString('vi-VN') : "---"}
                                                            </div>
                                                        </td>
                                                        <td>{getStatusBadge(item.trangThai)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}