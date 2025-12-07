import React, { useState } from 'react';

const UserProcurement = () => {
  // State quản lý danh sách các món muốn mua
  const [items, setItems] = useState([{ name: '', quantity: 1, reason: '' }]);

  // Thêm dòng mới
  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1, reason: '' }]);
  };

  // Xóa dòng
  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Cập nhật giá trị input
  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Đã gửi đề xuất mua sắm thành công! Chờ duyệt.');
    console.log(items);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white py-3">
        <h4 className="mb-0 text-success fw-bold">Đề Xuất Mua Sắm Mới</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Tiêu đề đề xuất</label>
            <input type="text" className="form-control" placeholder="Ví dụ: Mua máy tính cho phòng Lab mới" required />
          </div>

          <label className="form-label fw-bold">Danh sách thiết bị cần mua:</label>
          {items.map((item, index) => (
            <div key={index} className="row g-2 mb-2 align-items-center bg-light p-2 rounded">
              <div className="col-md-4">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tên thiết bị (VD: Laptop Dell)"
                  value={item.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  required 
                />
              </div>
              <div className="col-md-2">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Số lượng"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                  required 
                />
              </div>
              <div className="col-md-5">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Lý do / Ghi chú"
                  value={item.reason}
                  onChange={(e) => handleChange(index, 'reason', e.target.value)}
                />
              </div>
              <div className="col-md-1 text-center">
                {items.length > 1 && (
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveItem(index)}>X</button>
                )}
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-outline-secondary btn-sm mt-2" onClick={handleAddItem}>
            + Thêm dòng thiết bị
          </button>

          <hr />
          <button type="submit" className="btn btn-success w-100 fw-bold">Gửi Đề Xuất</button>
        </form>
      </div>
    </div>
  );
};

export default UserProcurement;