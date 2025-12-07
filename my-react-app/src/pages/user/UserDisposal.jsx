import React, { useState } from 'react';

const UserDisposal = () => {
  // Giả lập danh sách thiết bị CÓ THỂ thanh lý (thường là đang hỏng hoặc cũ)
  const [assets] = useState([
    { id: 'TB002', name: 'Máy chiếu Sony', status: 'HONG', purchaseDate: '2018-01-01' },
    { id: 'TB009', name: 'Laptop HP cũ', status: 'HET_KHAU_HAO', purchaseDate: '2015-05-20' },
  ]);

  const [selectedIds, setSelectedIds] = useState([]);

  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 thiết bị!");
      return;
    }
    alert(`Đã gửi yêu cầu thanh lý cho ${selectedIds.length} thiết bị.`);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white py-3">
        <h4 className="mb-0 text-danger fw-bold">Đề Xuất Thanh Lý</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
             <label className="form-label fw-bold">Lý do thanh lý chung:</label>
             <textarea className="form-control" rows="3" placeholder="Ví dụ: Thiết bị hư hỏng nặng không thể sửa chữa..." required></textarea>
          </div>

          <label className="form-label fw-bold">Chọn thiết bị đề xuất:</label>
          <div className="table-responsive border rounded mb-3">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center">Chọn</th>
                  <th>Mã TB</th>
                  <th>Tên thiết bị</th>
                  <th>Tình trạng</th>
                  <th>Ngày mua</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => (
                  <tr key={asset.id}>
                    <td className="text-center">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        onChange={() => handleCheckboxChange(asset.id)}
                        checked={selectedIds.includes(asset.id)}
                      />
                    </td>
                    <td className="fw-bold">{asset.id}</td>
                    <td>{asset.name}</td>
                    <td>
                      <span className="badge bg-warning text-dark">{asset.status}</span>
                    </td>
                    <td>{asset.purchaseDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="submit" className="btn btn-danger w-100 fw-bold">Gửi Yêu Cầu Thanh Lý</button>
        </form>
      </div>
    </div>
  );
};

export default UserDisposal;