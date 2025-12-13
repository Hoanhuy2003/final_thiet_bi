import React, { useState, useEffect } from 'react';
import { Eye, Search, X, RefreshCcw, Package, Calendar, DollarSign, Building2, AlertCircle, History, Hash, FileText } from 'lucide-react';
import { equipmentService } from '../../services/equipmentService';
import userService from '../../services/userService';
import axiosInstance from '../../api/axiosInstance';
import Select from 'react-select';
import toast from 'react-hot-toast';

const statusColors = {
  "Đang sử dụng": "bg-success text-white",
  "Sẵn sàng": "bg-primary text-white",
  "Bảo trì": "bg-warning text-dark",
  "Hỏng hóc": "bg-danger text-white",
  "Chờ thanh lý": "bg-secondary text-white",
  "Đã thanh lý": "bg-dark text-white",
};

const UserEquipmentList = () => {
  const [rawList, setRawList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myUnitInfo, setMyUnitInfo] = useState({ name: "Đang tải..." });
  const [loaiOptions, setLoaiOptions] = useState([]);

  // Modal chi tiết
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [lichSu, setLichSu] = useState([]);

  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("truongKhoaEquipmentFilters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          search: parsed.search || "",
          loai: parsed.loai === "all" ? null : parsed.loai || null,
          tinhTrang: parsed.tinhTrang === "all" ? null : parsed.tinhTrang || null,
        };
      } catch {
        return { search: "", loai: null, tinhTrang: null };
      }
    }
    return { search: "", loai: null, tinhTrang: null };
  });

  const tinhTrangOptions = [
    { value: "Đang sử dụng", label: "Đang sử dụng" },
    { value: "Sẵn sàng", label: "Sẵn sàng" },
    { value: "Bảo trì", label: "Bảo trì" },
    { value: "Hỏng hóc", label: "Hỏng hóc" },
  ];

  // Khởi tạo
  useEffect(() => {
    const init = async () => {
      try {
        const [userInfo, resLoai] = await Promise.all([
          userService.getMyInfo(),
          axiosInstance.get("/api/loai_thiet_bi")
        ]);

        const donVi = userInfo.donVi || userInfo.don_vi || {};
        setMyUnitInfo({
          name: donVi.tenDonVi || donVi.ten_don_vi || "Không xác định"
        });

        const rawLoai = resLoai.data?.result || resLoai.data || [];
        setLoaiOptions(rawLoai.map(item => ({
          value: item.maLoai || item.ma_loai,
          label: item.tenLoai || item.ten_loai
        })));

      } catch (err) {
        console.error("Lỗi khởi tạo:", err);
        toast.error("Không tải được dữ liệu cơ bản");
        setMyUnitInfo({ name: "Lỗi tải dữ liệu" });
      }
    };
    init();
  }, []);

  // Lưu filter
  useEffect(() => {
    const toSave = {
      search: filters.search,
      loai: filters.loai || "all",
      tinhTrang: filters.tinhTrang || "all"
    };
    localStorage.setItem("truongKhoaEquipmentFilters", JSON.stringify(toSave));
  }, [filters]);

  // Load danh sách thiết bị
  useEffect(() => {
    const fetchData = async () => {
      if (myUnitInfo.name === "Đang tải..." || myUnitInfo.name === "Lỗi tải dữ liệu") return;

      setLoading(true);
      try {
        const params = { page: 0, size: 3000 };
        if (filters.search.trim()) params.search = filters.search.trim();

        const res = await equipmentService.getAll(params);
        const data = res.result?.content || res.result || res.data || res || [];
        const arrayData = Array.isArray(data) ? data : [];
        setRawList(arrayData);
      } catch (err) {
        console.error("Lỗi tải thiết bị:", err);
        toast.error("Không tải được danh sách thiết bị");
        setRawList([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 400);
    return () => clearTimeout(timer);
  }, [filters.search, myUnitInfo.name]);

  // Lọc client-side
  useEffect(() => {
    if (!rawList.length || !myUnitInfo.name || myUnitInfo.name.includes("tải")) {
      setFilteredList([]);
      return;
    }

    const filtered = rawList.filter(item => {
      const itemDonVi = (item.donVi || "").trim();
      const myUnitName = myUnitInfo.name.trim();
      if (itemDonVi !== myUnitName) return false;

      if (filters.loai) {
        const selectedLabel = loaiOptions.find(opt => opt.value === filters.loai)?.label;
        if (selectedLabel && item.loai !== selectedLabel) return false;
      }

      if (filters.tinhTrang && item.tinhTrang !== filters.tinhTrang) return false;

      return true;
    });

    setFilteredList(filtered);
  }, [rawList, myUnitInfo.name, filters.loai, filters.tinhTrang, loaiOptions]);

  // MỞ CHI TIẾT THIẾT BỊ
  const openDetail = async (item) => {
    setSelectedEquipment(item);
    setDetailLoading(true);
    setLichSu([]);

    try {
      // Load lịch sử hoạt động
      const resLichSu = await axiosInstance.get(`/api/lich-su-thiet-bi/${item.maTB}`);
      setLichSu(resLichSu.data || []);
    } catch (err) {
      console.error("Lỗi tải lịch sử:", err);
      toast.error("Không tải được lịch sử hoạt động");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedEquipment(null);
    setLichSu([]);
  };

  const formatCurrency = (v) => v ? new Intl.NumberFormat("vi-VN").format(v) + " đ" : "Chưa có";
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "Chưa có";

  const getSelectValue = (options, value) => options.find(opt => opt.value === value) || null;

  const handleSelectChange = (name, option) => {
    setFilters(prev => ({ ...prev, [name]: option ? option.value : null }));
  };

  const resetFilters = () => {
    setFilters({ search: "", loai: null, tinhTrang: null });
    toast.success("Đã xóa bộ lọc");
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: "38px",
      borderColor: "#dee2e6",
      boxShadow: "none",
      "&:hover": { borderColor: "#86b7fe" }
    }),
    menu: (base) => ({ ...base, zIndex: 1050 }),
  };

  return (
    <>
      {/* DANH SÁCH THIẾT BỊ */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 text-primary fw-bold">
              Thiết bị tại: <span className="text-dark">{myUnitInfo.name}</span>
            </h5>
            <span className="badge bg-light text-dark border">Tổng: {filteredList.length}</span>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-5">
              <div className="position-relative">
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Tìm mã, tên, serial..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <div className="col-12 col-md-3">
              <Select
                options={loaiOptions}
                value={getSelectValue(loaiOptions, filters.loai)}
                onChange={(opt) => handleSelectChange('loai', opt)}
                placeholder="-- Chọn loại --"
                isClearable
                styles={customStyles}
                noOptionsMessage={() => "Không có loại"}
              />
            </div>

            <div className="col-12 col-md-3">
              <Select
                options={tinhTrangOptions}
                value={getSelectValue(tinhTrangOptions, filters.tinhTrang)}
                onChange={(opt) => handleSelectChange('tinhTrang', opt)}
                placeholder="-- Trạng thái --"
                isClearable
                styles={customStyles}
              />
            </div>

            <div className="col-12 col-md-1 d-flex align-items-start">
              <button className="btn btn-light border w-100" onClick={resetFilters} title="Xóa bộ lọc">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border spinner-border-sm text-primary"></div>
              <div className="text-muted mt-2">Đang tải thiết bị...</div>
            </div>
          ) : filteredList.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="bg-light text-secondary small text-uppercase">
                  <tr>
                    {/* */}
                    <th className="ps-4">Mã TB</th>
                    <th>Tên thiết bị</th>
                    <th>Số Seri</th>
                    <th>Loại</th>
                    <th>Phòng</th>
                    <th>Ngày SD</th>
                    <th>Trạng thái</th>
                    <th className="text-center">Hành động</th>
                    {/* */}
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((item) => (
                    <tr key={item.maTB}>
                      {/* */}
                      <td className="ps-4 fw-bold text-primary small">{item.maTB || "-"}</td>
                      <td>
                        <div className="fw-medium">{item.tenTB || "-"}</div>
                        <div className="text-truncate small text-muted" style={{ maxWidth: "200px" }} title={item.thongSoKyThuat}>
                          {item.thongSoKyThuat || "-"}
                        </div>
                      </td>
                      <td className="small text-muted">
                        {item.soSeri ? <span className="font-monospace">{item.soSeri}</span> : <em className="text-secondary">Không có</em>}
                      </td>
                      <td><span className="badge bg-light text-dark border">{item.loai || "-"}</span></td>
                      <td className="small">{item.phong || "-"}</td>
                      <td className="small text-muted">{item.ngaySuDung || "-"}</td>
                      <td>
                        <span className={`badge ${statusColors[item.tinhTrang] || "bg-secondary"}`}>
                          {item.tinhTrang || "Không rõ"}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-light btn-sm text-primary border"
                          onClick={() => openDetail(item)}
                          title="Xem chi tiết thiết bị"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                      {/* */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <RefreshCcw size={32} className="mb-2 text-secondary opacity-50" />
              <br />Không tìm thấy thiết bị nào thuộc {myUnitInfo.name}.
            </div>
          )}
        </div>
      </div>

      {/* MODAL CHI TIẾT THIẾT BỊ - TÍCH HỢP TRỰC TIẾP */}
      {selectedEquipment && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-gradient-primary">
                <h5 className="modal-title d-flex align-items-center gap-3">
                  <Package size={24} />
                  <div>
                    <div className="fw-bold">{selectedEquipment.maTB} - {selectedEquipment.tenTB}</div>
                    <small className="opacity-90">Chi tiết thiết bị</small>
                  </div>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeDetail} />
              </div>

              <div className="modal-body">
                {detailLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}></div>
                    <p className="mt-3 text-muted">Đang tải thông tin chi tiết...</p>
                  </div>
                ) : (
                  <>
                    <div className="row g-4 mb-5">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <Hash size={16} /> Mã thiết bị
                        </div>
                        <h5 className="fw-bold text-primary">{selectedEquipment.maTB}</h5>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <Package size={16} /> Tên thiết bị
                        </div>
                        <h5>{selectedEquipment.tenTB}</h5>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <Hash size={16} /> Số Seri
                        </div>
                        <p className="mb-0 fw-medium font-monospace fs-5">
                          {selectedEquipment.soSeri || <em className="text-muted">Không có</em>}
                        </p>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <Building2 size={16} /> Phòng / Đơn vị
                        </div>
                        <p className="mb-1 fw-medium">{selectedEquipment.phong || "Chưa phân bổ"}</p>
                        <small className="text-muted">{selectedEquipment.donVi || ""}</small>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <FileText size={16} /> Loại thiết bị
                        </div>
                        <p className="mb-0 fw-medium">{selectedEquipment.loai || "Chưa xác định"}</p>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <AlertCircle size={16} /> Trạng thái
                        </div>
                        <span className={`badge fs-6 px-3 py-2 ${statusColors[selectedEquipment.tinhTrang] || "bg-secondary"}`}>
                          {selectedEquipment.tinhTrang || "Không rõ"}
                        </span>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <Calendar size={16} /> Ngày đưa vào sử dụng
                        </div>
                        <p className="mb-0 fw-bold">{formatDate(selectedEquipment.ngaySuDung)}</p>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <DollarSign size={16} /> Nguyên giá
                        </div>
                        <p className="mb-0 fw-bold text-success fs-4">{formatCurrency(selectedEquipment.giaTriBanDau)}</p>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <DollarSign size={16} /> Giá trị hiện tại
                        </div>
                        <p className="mb-0 fw-bold text-primary fs-4">{formatCurrency(selectedEquipment.giaTriHienTai)}</p>
                        {selectedEquipment.giaTriHienTai === 0 && (
                          <small className="text-danger d-block">→ Đã hết khấu hao</small>
                        )}
                      </div>

                      <div className="col-12">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <FileText size={16} /> Thông số kỹ thuật
                        </div>
                        <div className="border rounded p-3 bg-light">
                          <p className="mb-0 text-pre-wrap">{selectedEquipment.thongSoKyThuat || "Không có thông tin"}</p>
                        </div>
                      </div>
                    </div>

                    {/* LỊCH SỬ HOẠT ĐỘNG */}
                    <div className="border-top pt-4">
                      <h5 className="mb-4 d-flex align-items-center gap-2 text-primary">
                        <History size={22} />
                        Lịch sử hoạt động
                      </h5>

                      {lichSu.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-hover align-middle">
                            <thead className="table-light">
                              <tr>
                                <th>Ngày</th>
                                <th>Người thực hiện</th>
                                <th>Hành động</th>
                                <th>Trạng thái</th>
                                <th>Phòng</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lichSu.map((ls, i) => (
                                <tr key={i}>
                                  <td className="small">{formatDate(ls.ngayThayDoi)}</td>
                                  <td className="fw-medium">{ls.tenNguoiThayDoi || ls.nguoiThayDoi || "Hệ thống"}</td>
                                  <td><span className="badge bg-info text-dark">{ls.hanhDong || "Cập nhật"}</span></td>
                                  <td>
                                    {ls.trangThaiCu && ls.trangThaiMoi ? (
                                      <span>
                                        <span className="text-muted">{ls.trangThaiCu}</span> → <span className="text-success">{ls.trangThaiMoi}</span>
                                      </span>
                                    ) : "-"}
                                  </td>
                                  <td>
                                    {ls.phongCu && ls.phongMoi ? (
                                      <span>
                                        <span className="text-muted">{ls.phongCu}</span> → <span className="text-success">{ls.phongMoi}</span>
                                      </span>
                                    ) : "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-5 text-muted border rounded bg-light">
                          <History size={48} className="mb-3 text-secondary opacity-50" />
                          <p className="mb-0">Chưa có lịch sử hoạt động nào được ghi nhận.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer bg-light border-top">
                <button className="btn btn-outline-secondary" onClick={closeDetail}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserEquipmentList;