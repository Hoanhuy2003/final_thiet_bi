import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { deXuatMuaService } from '../../services/deXuatMuaService';
import { getMyInfo } from '../../services/userService'; 
import { getUserId } from '../../services/authService';
import { Plus, Trash2, Save, User, Building, MapPin, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select'; // Import thư viện Select tìm kiếm

export default function UserProcurement() {
    const currentUserId = getUserId(); 
    
    // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
    const [loaiOptions, setLoaiOptions] = useState([]);   // Options Loại thiết bị cho React-Select
    const [phongOptions, setPhongOptions] = useState([]); // Options Phòng cho React-Select
    const [userInfo, setUserInfo] = useState(null); 
    const [loading, setLoading] = useState(false);

    // --- 2. STATE FORM NHẬP LIỆU ---
    const [form, setForm] = useState({
        tieuDe: '',
        noiDung: '',
        maLoaiTong: null, // React-Select dùng null
        maPhong: null,    // React-Select dùng null
        items: [{ soLuong: 1, donGia: 0, ghiChu: '' }]
    });

    // --- 3. LOAD DỮ LIỆU BAN ĐẦU ---
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                // Gọi song song 3 API
                const [resLoai, userData, resPhong] = await Promise.all([
                    axiosInstance.get("/api/loai_thiet_bi"), 
                    getMyInfo(),                             
                    axiosInstance.get("/api/phong")          
                ]);

                // 1. Xử lý Loại thiết bị -> Convert sang React-Select
                const listLoai = resLoai.data.result || resLoai.data || [];
                setLoaiOptions(listLoai.map(l => ({
                    value: l.maLoai,
                    label: l.tenLoai
                })));

                // 2. Xử lý User & Phòng
                if (userData) {
                    setUserInfo(userData);
                    
                    const allPhongs = resPhong.data.result || resPhong.data || [];
                    
                    // --- DEBUG LOGIC LỌC PHÒNG ---
                    console.log("Đơn vị của User:", userData.donVi?.maDonVi);
                    console.log("Tổng số phòng lấy về:", allPhongs.length);

                    if (userData.donVi) {
                        const myUnitId = userData.donVi.maDonVi;
                        
                        const myRooms = allPhongs.filter(p => {
                            
                            const roomUnitId = String(p.maDonVi).trim(); 
                            return roomUnitId === myUnitId;
                        });
                        
                        console.log("Số phòng sau khi lọc:", myRooms.length);

                        setPhongOptions(myRooms.map(p => ({
                            value: p.maPhong,
                            label: p.tenPhong
                        })));
                    }
                }

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                toast.error("Không tải được dữ liệu danh mục.");
            }
        };
        fetchMasterData();
    }, []);

    // --- 4. CÁC HÀM XỬ LÝ SỰ KIỆN ---
    const handleChangeInfo = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Xử lý chọn Loại thiết bị (React-Select)
    const handleSelectLoai = (option) => {
        setForm({ ...form, maLoaiTong: option ? option.value : null });
    };

    // Xử lý chọn Phòng (React-Select)
    const handleSelectPhong = (option) => {
        setForm({ ...form, maPhong: option ? option.value : null });
    };

    const handleChangeItem = (index, field, value) => {
        const newItems = [...form.items];
        if (field === 'soLuong' || field === 'donGia') {
            const numValue = value === '' ? 0 : Number(value); 
            newItems[index][field] = numValue;
        } else {
            newItems[index][field] = value;
        }
        setForm({ ...form, items: newItems });
    };

    const handleAddItem = () => {
        setForm({ ...form, items: [...form.items, { soLuong: 1, donGia: 0, ghiChu: '' }] });
    };

    const handleRemoveItem = (index) => {
        if (form.items.length === 1) return toast.error("Cần ít nhất 1 dòng thiết bị.");
        const newItems = form.items.filter((_, i) => i !== index);
        setForm({ ...form, items: newItems });
    };

    // --- 5. XỬ LÝ SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentUserId) return toast.error("Lỗi xác thực.");
        if (!form.tieuDe.trim()) return toast.error("Chưa nhập tiêu đề.");
        if (!form.maLoaiTong) return toast.error("Chưa chọn loại thiết bị.");
        if (!form.maPhong) return toast.error("Chưa chọn phòng."); 

        if (form.items.some(item => item.soLuong <= 0)) {
            return toast.error("Số lượng phải lớn hơn 0.");
        }

        const payload = {
            tieu_de: form.tieuDe.trim(),
            noi_dung: form.noiDung,
            ma_nd: currentUserId,
            ma_phong: form.maPhong, 
            
            chi_tiet: form.items.map(item => ({
                ma_loai: form.maLoaiTong,
                so_luong: Number(item.soLuong), 
                don_gia: Number(item.donGia),
                ghi_chu: item.ghiChu
            }))
        };

        setLoading(true);
        try {
            await deXuatMuaService.create(payload);
            toast.success("Gửi đề xuất thành công!");
            
            setForm({ 
                tieuDe: '', 
                noiDung: '', 
                maLoaiTong: null, 
                maPhong: null, 
                items: [{ soLuong: 1, donGia: 0, ghiChu: '' }] 
            });
            
            window.dispatchEvent(new Event("procurementFilterChange")); 

        } catch (err) {
            console.error(err);
            toast.error("Lỗi: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // --- 6. RENDER GIAO DIỆN ---
    // Style chung cho React-Select để đẹp giống Bootstrap
    const selectStyles = {
        control: (base) => ({
            ...base,
            borderColor: '#dee2e6',
            borderRadius: '0.375rem',
            minHeight: '38px'
        }),
        menu: (base) => ({ ...base, zIndex: 9999 }) // Đảm bảo menu đè lên các phần tử khác
    };

    return (
        <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white py-3">
                <h5 className="mb-0 fw-bold"><Plus size={20} className="me-2"/>Tạo Đề Xuất Mua Sắm</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    
                    {/* INFO USER */}
                    <div className="alert alert-light border d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center gap-2">
                            <User size={18} className="text-secondary"/>
                            <span className="fw-bold text-dark">{userInfo?.hoTen || userInfo?.tenND || "Đang tải..."}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <Building size={18} className="text-secondary"/>
                            <span className="fw-bold text-primary">{userInfo?.donVi?.tenDonVi || "Chưa có đơn vị"}</span>
                        </div>
                    </div>

                    {/* FORM INPUTS */}
                    <div className="row g-3 mb-4 border-bottom pb-3">
                        <div className="col-12">
                            <label className="form-label fw-bold">Tiêu đề phiếu <span className="text-danger">*</span></label>
                            <input 
                                type="text" className="form-control" 
                                name="tieuDe" value={form.tieuDe} onChange={handleChangeInfo}
                                placeholder="VD: Mua sắm máy tính cho phòng Lab 1" required disabled={loading}
                            />
                        </div>
                        
                        {/* 1. CHỌN LOẠI THIẾT BỊ (SEARCHABLE) */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold d-flex align-items-center gap-1">
                                <Monitor size={16}/> Loại thiết bị <span className="text-danger">*</span>
                            </label>
                            <Select
                                options={loaiOptions}
                                onChange={handleSelectLoai}
                                value={loaiOptions.find(op => op.value === form.maLoaiTong)}
                                placeholder="🔍 Tìm loại thiết bị..."
                                noOptionsMessage={() => "Không tìm thấy loại này"}
                                isClearable
                                isDisabled={loading}
                                styles={selectStyles}
                            />
                        </div>

                        {/* 2. CHỌN PHÒNG (SEARCHABLE) */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold d-flex align-items-center gap-1">
                                <MapPin size={16}/> Mua cho phòng nào? <span className="text-danger">*</span>
                            </label>
                            <Select
                                options={phongOptions}
                                onChange={handleSelectPhong}
                                value={phongOptions.find(op => op.value === form.maPhong)}
                                placeholder={phongOptions.length > 0 ? "🔍 Tìm tên phòng..." : "Đang tải / Không có phòng..."}
                                noOptionsMessage={() => "Không tìm thấy phòng"}
                                isClearable
                                isDisabled={loading || phongOptions.length === 0}
                                styles={selectStyles}
                            />
                            <div className="form-text small text-muted fst-italic">
                                * Chỉ hiển thị phòng thuộc {userInfo?.donVi?.tenDonVi || "đơn vị của bạn"}.
                            </div>
                        </div>
                        
                        <div className="col-12">
                            <label className="form-label fw-bold">Lý do / Ghi chú</label>
                            <textarea 
                                className="form-control" rows="2" 
                                name="noiDung" value={form.noiDung} onChange={handleChangeInfo}
                                placeholder="Mô tả chi tiết mục đích mua sắm..." disabled={loading}
                            ></textarea>
                        </div>
                    </div>
                    
                    {/* ITEMS LIST */}
                    <label className="form-label fw-bold text-primary">Chi tiết số lượng & cấu hình:</label>
                    <div className="mb-3">
                        {form.items.map((item, index) => (
                            <div key={index} className="row g-2 mb-2 align-items-center bg-light p-2 rounded border">
                                <div className="col-md-4">
                                    <small className="text-muted">Cấu hình / Mô tả</small>
                                    <input 
                                        type="text" className="form-control form-control-sm"
                                        value={item.ghiChu} onChange={(e) => handleChangeItem(index, 'ghiChu', e.target.value)}
                                        placeholder="VD: Core i5, RAM 8GB..."
                                    />
                                </div>
                                <div className="col-md-2">
                                    <small className="text-muted">Số lượng <span className="text-danger">*</span></small>
                                    <input 
                                        type="number" className="form-control form-control-sm fw-bold text-center"
                                        value={item.soLuong} onChange={(e) => handleChangeItem(index, 'soLuong', e.target.value)}
                                        min="1" required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <small className="text-muted">Đơn giá dự kiến</small>
                                    <input 
                                        type="number" className="form-control form-control-sm text-end"
                                        value={item.donGia} onChange={(e) => handleChangeItem(index, 'donGia', e.target.value)}
                                        min="0" placeholder="0"
                                    />
                                </div>
                                <div className="col-md-2 text-end">
                                    <small className="text-muted d-block">Thành tiền</small>
                                    <span className="fw-bold text-success">
                                        {((item.soLuong || 0) * (item.donGia || 0)).toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                                <div className="col-md-1 text-center">
                                    {form.items.length > 1 && (
                                        <button type="button" className="btn btn-sm btn-outline-danger border-0" onClick={() => handleRemoveItem(index)}>
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleAddItem} disabled={loading}>
                            <Plus size={16} className="me-1"/> Thêm dòng
                        </button>
                        <div className="flex-grow-1"></div>
                        <div className="fw-bold fs-5 text-primary">
                            Tổng cộng: {form.items.reduce((sum, item) => sum + (item.soLuong * item.donGia), 0).toLocaleString('vi-VN')}đ
                        </div>
                    </div>

                    <hr className="my-4" />
                    
                    <button type="submit" className="btn btn-success w-100 fw-bold py-2" disabled={loading}>
                        {loading ? "Đang xử lý..." : <><Save size={18} className="me-2"/> Gửi Đề Xuất</>}
                    </button>
                </form>
            </div>
        </div>
    );
}