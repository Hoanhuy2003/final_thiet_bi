import React, { useState } from 'react';

const UserEquipmentList = () => {
  // Giả lập dữ liệu
  const [equipments] = useState([
    { id: 'TB001', name: 'PC Dell Optiplex', room: 'P102', status: 'DANG_SU_DUNG' },
    { id: 'TB002', name: 'Máy chiếu Sony', room: 'P102', status: 'HONG' },
    { id: 'TB005', name: 'Micro không dây', room: 'Khoa', status: 'DANG_SU_DUNG' },
  ]);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white py-3">
        <h4 className="mb-0 text-primary fw-bold">Thiết Bị Của Tôi</h4>
      </div>
      <div className="card-body p-0">
        <table className="table table-hover mb-0">
          <thead className="bg-light">
            <tr>
              <th className="ps-4">Mã TB</th>
              <th>Tên thiết bị</th>
              <th>Vị trí</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((item) => (
              <tr key={item.id}>
                <td className="ps-4 fw-bold">{item.id}</td>
                <td>{item.name}</td>
                <td><span className="badge bg-light text-dark border">{item.room}</span></td>
                <td>
                  {item.status === 'HONG' ? (
                    <span className="badge bg-danger">Hỏng</span>
                  ) : (
                    <span className="badge bg-success">Đang dùng</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserEquipmentList;