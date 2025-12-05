import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";

export default function EquipmentDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = async () => {
      const data = localStorage.getItem("selectedEquipment");
      if (data) {
        const eq = JSON.parse(data);
        setLoading(true);
        try {
          const detail = await equipmentService.getById(eq.maTB);
          setEquipment(detail);
        } catch (err) {
          setEquipment(eq); // fallback nếu lỗi
        } finally {
          setLoading(false);
        }
        setIsOpen(true);
      }
    };
    window.addEventListener("openDetailEquipmentModal", handler);
    return () => window.removeEventListener("openDetailEquipmentModal", handler);
  }, []);

  if (!isOpen || !equipment) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chi tiết thiết bị - {equipment.maTB}</h5>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          {loading ? (
            <div className="modal-body text-center py-5">Đang tải chi tiết...</div>
          ) : (
            <>
              <div className="modal-body">
                <div className="row g-3 mb-4">
                  <div className="col-6"><strong>Mã tài sản:</strong> {equipment.maTB}</div>
                  <div className="col-6"><strong>Tên thiết bị:</strong> {equipment.tenTB}</div>
                  <div className="col-6"><strong>Lô:</strong> {equipment.lo}</div>
                  <div className="col-6"><strong>Loại:</strong> {equipment.loai}</div>
                  <div className="col-6"><strong>Phòng:</strong> {equipment.phong}</div>
                  <div className="col-6"><strong>Đơn vị:</strong> {equipment.donVi}</div>
                  <div className="col-6"><strong>Trạng thái:</strong> <span className={`badge ${statusColors[equipment.tinhTrang]}`}>{equipment.tinhTrang}</span></div>
                  <div className="col-6"><strong>Ngày sử dụng:</strong> {equipment.ngaySuDung}</div>
                  <div className="col-6"><strong>Nguyên giá:</strong> {equipment.giaTriBanDau?.toLocaleString("vi-VN")}đ</div>
                  <div className="col-6"><strong>Giá trị hiện tại:</strong> {equipment.giaTriHienTai?.toLocaleString("vi-VN")}đ</div>
                </div>

                {equipment.lichSuHoatDong && equipment.lichSuHoatDong.length > 0 && (
                  <div className="border-top pt-3">
                    <h6>Lịch sử hoạt động</h6>
                    {equipment.lichSuHoatDong.map((ls, i) => (
                      <div key={i} className="d-flex gap-3 py-2 border-bottom">
                        <div className="text-primary">•</div>
                        <div>
                          <p className="mb-0">{ls.noiDung}</p>
                          <small className="text-muted">{ls.ngayThayDoi} - {ls.nguoiThucHien}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Đóng</button>
                <button className="btn btn-primary" onClick={() => { setIsOpen(false); window.dispatchEvent(new Event("openEditEquipmentModal")); }}>
                  <Edit size={16} className="me-2" />Chỉnh sửa
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}