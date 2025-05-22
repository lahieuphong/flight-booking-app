import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/ManageVouchers.css';

const API_URL = 'http://localhost:5001/api/admin/vouchers';

const ManageVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [form, setForm] = useState({ code: '', discount: '', is_active: 1 });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await axios.get(API_URL);
      setVouchers(res.data);
    } catch (err) {
      alert('Lỗi khi tải voucher');
    }
  };

  const handleSave = async () => {
    if (!form.code || form.discount === '') {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (form.discount < 0 || form.discount > 100) {
      alert('Giảm giá phải trong khoảng từ 0 đến 100');
      return;
    }

    try {
      if (editing) {
        await axios.put(`${API_URL}/${editing.id}`, form);
        alert('Cập nhật voucher thành công');
      } else {
        await axios.post(API_URL, form);
        alert('Thêm voucher thành công');
      }
      fetchVouchers();
      setForm({ code: '', discount: '', is_active: 1 });
      setEditing(null);
      setShowForm(false);
    } catch (err) {
      alert('Lỗi khi lưu voucher');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa voucher này?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert('Xóa thành công');
      fetchVouchers();
    } catch {
      alert('Lỗi khi xóa');
    }
  };

  const startEdit = (v) => {
    setForm({ code: v.code, discount: v.discount, is_active: v.is_active });
    setEditing(v);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setForm({ code: '', discount: '', is_active: 1 });
    setEditing(null);
    setShowForm(false);
  };

  const toggleStatus = async (v) => {
    try {
      await axios.put(`${API_URL}/${v.id}`, {
        ...v,
        is_active: v.is_active ? 0 : 1,
      });
      fetchVouchers();
    } catch {
      alert('Lỗi khi đổi trạng thái');
    }
  };

  return (
    <div className="manage-voucher voucher-container">
      <h2>Quản lý Mã Giảm Giá</h2>
      <table className="voucher-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã</th>
            <th>Giảm (%)</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers
            .filter((v) => v.code !== 'Không chọn')
            .map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.code}</td>
                <td>{parseFloat(v.discount).toFixed(0)}%</td>
                <td>
                  <button
                    className={`status-toggle ${v.is_active ? 'active' : 'inactive'}`}
                    onClick={() => toggleStatus(v)}
                    type="button"
                  >
                    {v.is_active ? 'Đang hoạt động' : 'Đã tắt'}
                  </button>
                </td>
                <td>
                  <button
                    className="add-btn"
                    onClick={() => {
                      setShowForm(true);
                      setEditing(null);
                      setForm({ code: '', discount: '', is_active: 1 });
                    }}
                  >
                    Thêm
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => startEdit(v)}
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(v.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showForm && (
        <div className="voucher-form">
          <h3>{editing ? 'Cập nhật' : 'Thêm'} Voucher</h3>
          <input
            type="text"
            placeholder="Mã"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <input
            type="number"
            placeholder="Giảm giá (%)"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
          />
          <div className="form-actions">
            <button onClick={handleSave}>{editing ? 'Cập nhật' : 'Thêm'}</button>
            <button className="cancel-btn" onClick={cancelEdit}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVouchers;