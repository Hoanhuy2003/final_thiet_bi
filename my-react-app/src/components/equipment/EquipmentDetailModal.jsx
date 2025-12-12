import React, { useState, useEffect } from 'react';
import { Edit, Package, Calendar, DollarSign, Building2, AlertCircle, History, Tag, TrendingUp, TrendingDown, Factory } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import axiosInstance from "../../api/axiosInstance"; 
import toast from "react-hot-toast";

const statusColors = {
  "Đang sử dụng": "bg-success",
  "Bảo trì": "bg-warning",
  "Hỏng hóc": "bg-danger",
  "Chờ thanh lý": "bg-secondary",
  "Sẵn sàng": "bg-primary",
  "Đã thanh lý": "bg-dark",
  "Hết khấu hao": "bg-info",
};

export default function EquipmentDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [equipment, setEquipment] = useState(null);
  const [lichSu, setLichSu] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = async () => {
      const dataStr = localStorage.getItem("selectedEquipment");
      if (dataStr) {
        const eqBasic = JSON.parse(dataStr);
        setEquipment(eqBasic);
        setLoading(true);

        try {
          const res = await equipmentService.getById(eqBasic.maTB);
          const eqFull = res.data?.result || res.data || eqBasic;
          setEquipment(eqFull);

          const resLichSu = await axiosInstance.get(`/api/lich-su-thiet-bi/${eqBasic.maTB}`);
          setLichSu(resLichSu.data?.result || resLichSu.data || []);
        } catch (err) {
          toast.error("Không tải được chi tiết hoặc lịch sử thiết bị");
          setEquipment(eqBasic);
          setLichSu([]);
        } finally {
          setLoading(false);
        }
        setIsOpen(true);
      }
    };

    window.addEventListener("openDetailEquipmentModal", handler);
    return () => window.removeEventListener("openDetailEquipmentModal", handler);
  }, []);

  const formatCurrency = (v) => v ? new Intl.NumberFormat("vi-VN").format(v) + " đ" : "0 đ";
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "Chưa có";
  
  // Helper: Xử lý an toàn giá trị DTO (String hoặc Object)
  const getDisplayValue = (data) => {
      if (!data) return "Chưa phân bổ";
      if (typeof data === 'object') {
          return data.tenPhong || data.tenLoai || data.ten || "Tên bị lỗi";
      }
      return data;
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Package size={20} />
              Chi tiết thiết bị: {equipment?.maTB} - {equipment?.tenTB}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)} disabled={loading} />
          </div>

          <div className="modal-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-3">Đang tải chi tiết...</p>
              </div>
            ) : (
              <>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1">Mã thiết bị</h6>
                    <p className="mb-0 fw-bold">{equipment?.maTB}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1">Tên thiết bị</h6>
                    <p className="mb-0">{equipment?.tenTB}</p>
                  </div>
                  
                  {/* NHÀ CUNG CẤP - MỚI THÊM */}
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1 d-flex align-items-center gap-1">
                      <Factory size={16} /> Nhà cung cấp
                    </h6>
                    <p className="mb-0 fw-semibold">
                      {equipment?.nhaCungCap || "Chưa xác định"}
                    </p>
                  </div>

                  {/* CỘT PHÒNG */}
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1 d-flex align-items-center gap-1"><Building2 size={16} /> Phòng / Vị trí</h6>
                    <p className="mb-0 fw-semibold">{getDisplayValue(equipment?.phong)}</p>
                  </div>

                  {/* CỘT LOẠI */}
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1"><Tag size={16} /> Loại thiết bị</h6>
                    <p className="mb-0">{getDisplayValue(equipment?.loai)}</p>
                  </div>
                  
                  {/* Trạng thái */}
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1 d-flex align-items-center gap-1"><AlertCircle size={16} /> Trạng thái</h6>
                    <span className={`badge ${statusColors[equipment?.tinhTrang]} fw-normal text-white`}>
                      {equipment?.tinhTrang}
                    </span>
                    {equipment?.tinhTrang === 'Hết khấu hao' && (
                        <small className="text-info ms-2"> (Cần thanh lý/xem xét)</small>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1"><Calendar size={16} /> Ngày sử dụng</h6>
                    <p className="mb-0">{formatDate(equipment?.ngaySuDung)}</p>
                  </div>
                  
                  {/* Giá trị tài chính */}
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1">Nguyên giá</h6>
                    <p className="mb-0 fw-bold text-success">{formatCurrency(equipment?.giaTriBanDau)}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1 d-flex align-items-center gap-1">
                      {equipment?.giaTriHienTai > 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                      Giá trị hiện tại
                    </h6>
                    <p className="mb-0 fw-bold text-primary">
                      {formatCurrency(equipment?.giaTriHienTai)}
                      {equipment?.tinhTrang === 'Hết khấu hao' && (
                           <small className="ms-2 text-info small fw-normal">(0đ trên sổ sách)</small>
                      )}
                    </p>
                  </div>
                </div>

                {/* PHẦN LỊCH SỬ THIẾT BỊ */}
                <div className="mt-5 border-top pt-4">
                  <h5 className="mb-3 d-flex align-items-center gap-2">
                    <History size={20} className="text-primary" />
                    Lịch sử hoạt động ({lichSu.length})
                  </h5>
                  {lichSu.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Ngày</th>
                            <th>Người thực hiện</th>
                            <th>Thay đổi trạng thái</th>
                            <th>Thay đổi phòng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lichSu.map((ls, index) => (
                            <tr key={index}>
                              <td>{formatDate(ls.ngayThayDoi)}</td>
                              <td>{ls.tenNguoiThayDoi || ls.nguoiThucHien || "Hệ thống"}</td>
                              <td>
                                {ls.trangThaiCu && ls.trangThaiMoi ? `${ls.trangThaiCu} → ${ls.trangThaiMoi}` : ls.hanhDong || "-"}
                              </td>
                              <td>
                                {ls.phongCu && ls.phongMoi ? `${ls.phongCu} → ${ls.phongMoi}` : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted text-center py-3">Chưa có lịch sử hoạt động nào.</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="modal-footer bg-light">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Đóng</button>
            <button 
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => window.dispatchEvent(new Event("openEditEquipmentModal")), 300);
              }}
            >
              <Edit size={16} /> Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}