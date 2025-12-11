import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search, X, Filter, AlertTriangle } from "lucide-react";
import disposalService from "../../services/disposalService";
import { equipmentService } from "../../services/equipmentService";
import userService from "../../services/userService";
import { getUserId } from "../../services/authService";
import toast from "react-hot-toast";

const UserDisposal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 border-bottom">
        <h4 className="mb-0 text-danger fw-bold d-flex align-items-center">
          <AlertTriangle className="me-2" /> Đề Xuất Thanh Lý Tài Sản
        </h4>
        <small className="text-muted">
          Tạo yêu cầu thanh lý tài sản hỏng, đang bảo trì hoặc đã hết khấu hao
        </small>
      </div>

      <div className="card-body text-center py-5">
        <button
          className="btn btn-danger btn-lg px-5"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={24} className="me-2" />
          Tạo Yêu Cầu Thanh Lý
        </button>

        <p className="text-muted mt-3">
          Chỉ được yêu cầu thanh lý thiết bị hỏng, bảo trì hoặc đã hết khấu hao (giá trị hiện tại = 0)
        </p>
      </div>

      {/* GỌI MODAL GIỐNG ADMIN */}
      {isModalOpen && <UserThanhLyModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

// ================= MODAL TẠO YÊU CẦU (GIỐNG ADMIN) =================
const UserThanhLyModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const currentUserId = getUserId();

  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [danhSachTB, setDanhSachTB] = useState([]);
  const [filteredTB, setFilteredTB] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedInModal, setSelectedInModal] = useState([]);

  const [form, setForm] = useState({
    hinhThuc: "Bán thanh lý",
    lyDoThanhLy: "",
    ghiChu: "",
    chiTiet: [],
  });

  // Load thiết bị ĐƯỢC PHÉP thanh lý
  useEffect(() => {
    const loadThietBi = async () => {
      try {
        const data = await equipmentService.getAllAsList();
        const dataArray = data.result || data.data || data || [];

        // Lấy thông tin đơn vị của giảng viên
        const userInfo = await userService.getMyInfo();
        const donViObj = userInfo.donVi || userInfo.don_vi || {};
        const donViName = (donViObj.tenDonVi || donViObj.ten_don_vi || "").trim().toLowerCase();

        // Lọc thiết bị thuộc đơn vị + chỉ hỏng, bảo trì, hoặc hết khấu hao
        const validList = dataArray.filter(tb => {
          const tbDonVi = (tb.donVi || "").trim().toLowerCase();
          const isMyUnit = tbDonVi === donViName;

          const isHong = tb.tinhTrang === "Hỏng hóc";
          const isBaoTri = tb.tinhTrang === "Bảo trì";
          const isLacHau = tb.tinhTrang === "Đang sử dụng" && (tb.giaTriHienTai === 0 || tb.giaTriHienTai == null);

          return isMyUnit && (isHong || isBaoTri || isLacHau) && !["Đã thanh lý", "Chờ thanh lý"].includes(tb.tinhTrang);
        });

        setDanhSachTB(validList);
        setFilteredTB(validList);
      } catch (err) {
        toast.error("Lỗi tải danh sách thiết bị");
      }
    };
    loadThietBi();
  }, []);

  // Lọc trong modal
  useEffect(() => {
    let result = danhSachTB;

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(tb => 
        tb.maTB.toLowerCase().includes(lower) || 
        tb.tenTB.toLowerCase().includes(lower)
      );
    }

    if (filterStatus !== "ALL") {
      if (filterStatus === "LAC_HAU") {
        result = result.filter(tb => tb.tinhTrang === "Đang sử dụng" && (tb.giaTriHienTai === 0 || tb.giaTriHienTai == null));
      } else {
        result = result.filter(tb => tb.tinhTrang === filterStatus);
      }
    }

    setFilteredTB(result);
  }, [searchTerm, filterStatus, danhSachTB]);

  const handleToggleSelect = (maTB) => {
    setSelectedInModal(prev => 
      prev.includes(maTB) ? prev.filter(id => id !== maTB) : [...prev, maTB]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const idsToAdd = filteredTB
        .filter(tb => !form.chiTiet.some(ct => ct.maTB === tb.maTB))
        .map(tb => tb.maTB);
      setSelectedInModal([...new Set([...selectedInModal, ...idsToAdd])]);
    } else {
      const visibleIds = filteredTB.map(t => t.maTB);
      setSelectedInModal(prev => prev.filter(id => !visibleIds.includes(id)));
    }
  };

  const handleConfirmSelection = () => {
    const newItems = selectedInModal.map(maTB => {
      const tb = danhSachTB.find(t => t.maTB === maTB);
      if (!tb) return null;
      return {
        maTB: tb.maTB,
        tenTB: tb.tenTB,
        tinhTrang: tb.tinhTrang,
        giaTriThuVe: 0,
        lyDo: ""
      };
    }).filter(Boolean);

    const finalItems = newItems.filter(newItem => !form.chiTiet.some(exist => exist.maTB === newItem.maTB));

    setForm(prev => ({
      ...prev,
      chiTiet: [...prev.chiTiet, ...finalItems]
    }));

    setIsSelectionModalOpen(false);
    setSelectedInModal([]);
    toast.success(`Đã thêm ${finalItems.length} thiết bị`);
  };

  const xoaThietBi = (maTB) => {
    setForm(prev => ({
      ...prev,
      chiTiet: prev.chiTiet.filter(ct => ct.maTB !== maTB)
    }));
  };

  const capNhatChiTiet = (maTB, field, value) => {
    setForm(prev => ({
      ...prev,
      chiTiet: prev.chiTiet.map(ct =>
        ct.maTB === maTB ? { ...ct, [field]: field === "giaTriThuVe" ? Number(value) || 0 : value } : ct
      )
    }));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    if (form.chiTiet.length === 0) return toast.error("Chưa chọn thiết bị nào!");
    if (!form.lyDoThanhLy.trim()) return toast.error("Vui lòng nhập lý do chung!");

    const payload = {
      hinh_thuc: form.hinhThuc,
      ly_do_thanh_ly: form.lyDoThanhLy,
      ghi_chu: form.ghiChu || "",
      ngay_lap: formatDate(new Date()),
      ma_nguoi_tao: currentUserId,
      trang_thai: "Chờ duyệt",
      chi_tiet: form.chiTiet.map(ct => ({
        ma_tb: ct.maTB,
        gia_tri_thu_ve: ct.giaTriThuVe || 0,
        ly_do_thanh_ly: ct.lyDo || null,
        hinh_thuc_thanh_ly: form.hinhThuc
      }))
    };

    setLoading(true);
    try {
      await disposalService.create(payload);
      toast.success("Gửi yêu cầu thanh lý thành công!");
      onClose();
      window.dispatchEvent(new Event("reloadThanhLyTable"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi gửi yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MODAL CHÍNH - GIỐNG ADMIN */}
      <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header bg-warning text-dark">
              <h5 className="modal-title d-flex align-items-center">
                <Plus size={20} className="me-2" /> Yêu Cầu Thanh Lý Thiết Bị
              </h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Hình thức</label>
                  <select className="form-select" value={form.hinhThuc} onChange={e => setForm({ ...form, hinhThuc: e.target.value })}>
                    <option>Bán thanh lý</option>
                    <option>Tiêu hủy</option>
                    <option>Điều chuyển</option>
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label fw-bold">Lý do chung <span className="text-danger">*</span></label>
                  <input className="form-control" value={form.lyDoThanhLy} onChange={e => setForm({ ...form, lyDoThanhLy: e.target.value })} placeholder="VD: Thiết bị hỏng nặng, hết khấu hao..." />
                </div>
                <div className="col-12">
                  <label className="form-label">Ghi chú</label>
                  <textarea className="form-control" rows="2" value={form.ghiChu} onChange={e => setForm({ ...form, ghiChu: e.target.value })} />
                </div>
              </div>

              <div className="border rounded p-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 fw-bold text-primary">Danh sách thiết bị ({form.chiTiet.length})</h6>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setIsSelectionModalOpen(true)}>
                    <Plus size={16} className="me-1" /> Chọn thiết bị
                  </button>
                </div>

                <div className="table-responsive" style={{ maxHeight: '300px' }}>
                  <table className="table table-sm table-hover">
                    <thead className="table-light sticky-top">
                      <tr>
                        <th>Mã TB</th>
                        <th>Tên thiết bị</th>
                        <th>Tình trạng</th>
                        <th>Giá trị thu về</th>
                        <th>Lý do riêng</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.chiTiet.map(ct => (
                        <tr key={ct.maTB}>
                          <td className="fw-bold small">{ct.maTB}</td>
                          <td>{ct.tenTB}</td>
                          <td><span className="badge bg-secondary">{ct.tinhTrang}</span></td>
                          <td>
                            <input type="number" className="form-control form-control-sm text-end" value={ct.giaTriThuVe} onChange={e => capNhatChiTiet(ct.maTB, 'giaTriThuVe', e.target.value)} min="0" />
                          </td>
                          <td>
                            <input type="text" className="form-control form-control-sm" value={ct.lyDo} onChange={e => capNhatChiTiet(ct.maTB, 'lyDo', e.target.value)} placeholder="Chi tiết..." />
                          </td>
                          <td>
                            <button className="btn btn-link text-danger p-0" onClick={() => xoaThietBi(ct.maTB)}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {form.chiTiet.length === 0 && (
                        <tr><td colSpan="6" className="text-center py-4 text-muted">Chưa chọn thiết bị nào</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="text-end mt-2 pt-2 border-top">
                  Tổng thu về: <span className="fw-bold text-success fs-5">
                    {new Intl.NumberFormat('vi-VN').format(form.chiTiet.reduce((s, i) => s + i.giaTriThuVe, 0))} đ
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
              <button className="btn btn-success px-4" onClick={handleSubmit} disabled={loading || form.chiTiet.length === 0}>
                {loading ? "Đang gửi..." : "Gửi Yêu Cầu"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CHỌN THIẾT BỊ - GIỐNG ADMIN */}
      {isSelectionModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Chọn thiết bị để yêu cầu thanh lý</h5>
                <button className="btn-close" onClick={() => setIsSelectionModalOpen(false)}></button>
              </div>
              <div className="modal-body p-0">
                <div className="p-3 bg-light border-bottom sticky-top">
                  <div className="d-flex gap-2 mb-2">
                    <div className="input-group">
                      <span className="input-group-text bg-white"><Search size={18} /></span>
                      <input type="text" className="form-control" placeholder="Tìm tên, mã..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} autoFocus />
                    </div>
                    <select className="form-select w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                      <option value="ALL">-- Tất cả --</option>
                      <option value="Hỏng hóc">Hỏng hóc</option>
                      <option value="Bảo trì">Bảo trì</option>
                      <option value="LAC_HAU">Đang sử dụng (lạc hậu)</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Tìm thấy: <b>{filteredTB.length}</b> thiết bị</small>
                    <div>
                      <input type="checkbox" className="form-check-input me-2" id="selectAll" onChange={handleSelectAll} 
                        checked={filteredTB.length > 0 && filteredTB.every(t => selectedInModal.includes(t.maTB))} />
                      <label htmlFor="selectAll" className="form-check-label cursor-pointer">Chọn tất cả</label>
                    </div>
                  </div>
                </div>

                <div className="list-group list-group-flush" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {filteredTB.map(tb => {
                    const isAlreadyAdded = form.chiTiet.some(ct => ct.maTB === tb.maTB);
                    const isChecked = selectedInModal.includes(tb.maTB);

                    return (
                      <label key={tb.maTB} className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 ${isAlreadyAdded ? 'bg-light opacity-50' : ''}`}>
                        <input type="checkbox" className="form-check-input flex-shrink-0" style={{ transform: 'scale(1.2)' }}
                          checked={isChecked} disabled={isAlreadyAdded} onChange={() => handleToggleSelect(tb.maTB)} />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <span className="fw-bold text-dark">{tb.tenTB}</span>
                            <span className="badge bg-light text-dark border">{tb.maTB}</span>
                          </div>
                          <div className="small text-muted d-flex gap-3 mt-1">
                            <span className={`badge ${tb.tinhTrang === 'Hỏng hóc' ? 'bg-danger' : tb.tinhTrang === 'Bảo trì' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                              {tb.tinhTrang} {tb.tinhTrang === "Đang sử dụng" && tb.giaTriHienTai === 0 && "(hết khấu hao)"}
                            </span>
                            <span>Phòng: {tb.phong || '-'}</span>
                          </div>
                        </div>
                        {isAlreadyAdded && <span className="text-success small fw-bold">Đã thêm</span>}
                      </label>
                    );
                  })}
                  {filteredTB.length === 0 && (
                    <div className="text-center py-5 text-muted">
                      Không có thiết bị nào đủ điều kiện thanh lý.
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer bg-light">
                <div className="fw-bold">Đã chọn: <span className="text-primary fs-5">{selectedInModal.length}</span></div>
                <div>
                  <button className="btn btn-outline-secondary me-2" onClick={() => setIsSelectionModalOpen(false)}>Hủy</button>
                  <button className="btn btn-primary" onClick={handleConfirmSelection} disabled={selectedInModal.length === 0}>
                    Xác nhận thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDisposal;