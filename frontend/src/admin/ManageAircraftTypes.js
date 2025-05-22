import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/ManageAircraftTypes.css';

const API_URL = 'http://localhost:5001/api/admin/aircraft';

const ManageAircraftTypes = () => {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ type_name: '', description: '' });
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false); // Trạng thái form thêm

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await axios.get(API_URL);
      setTypes(res.data);
    } catch (err) {
      alert('Lỗi khi tải dữ liệu');
    }
  };

  const handleSave = async () => {
    if (!form.type_name.trim()) {
      alert('Tên loại máy bay không được để trống');
      return;
    }

    try {
      if (editing) {
        await axios.put(`${API_URL}/${editing.id}`, form);
        alert('Cập nhật thành công');
      } else {
        await axios.post(API_URL, form);
        alert('Thêm thành công');
      }
      setForm({ type_name: '', description: '' });
      setEditing(null);
      setShowForm(false); // Đóng form khi lưu xong
      fetchTypes();
    } catch (err) {
      alert('Lỗi khi lưu dữ liệu');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa không?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTypes();
    } catch (err) {
      alert('Lỗi khi xóa');
    }
  };

  const startEdit = (type) => {
    setForm({ type_name: type.type_name, description: type.description });
    setEditing(type);
    setShowForm(true); // Hiển thị form khi sửa
  };

  const cancelEdit = () => {
    setForm({ type_name: '', description: '' });
    setEditing(null);
    setShowForm(false); // Đóng form khi hủy sửa
  };

  const filtered = types.filter(t =>
    t.type_name.toLowerCase().includes(search.toLowerCase())
  );

  // Hàm để hiển thị form khi thêm mới
  const handleAddNew = () => {
    setForm({ type_name: '', description: '' });
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="manage-aircraft container">
      <h2>Quản lý Loại máy bay</h2>

      <input
        placeholder="Tìm kiếm tên loại..."
        className="searchInput"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="aircraftTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên loại</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={4}>Không có dữ liệu</td></tr>
          ) : filtered.map((type) => (
            <tr key={type.id}>
              <td>{type.id}</td>
              <td>{type.type_name}</td>
              <td>{type.description}</td>
              <td>
                <button onClick={handleAddNew} className="addButton">Thêm</button>
                <button onClick={() => startEdit(type)} className="actionButton">Sửa</button>
                <button onClick={() => handleDelete(type.id)} className="deleteButton">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form thêm hoặc sửa loại máy bay */}
      {showForm && (
        <div className="formContainer">
          <h3>{editing ? 'Cập nhật loại máy bay' : 'Thêm loại máy bay mới'}</h3>
          <div className="formGroup">
            <label htmlFor="typeName">Tên loại:</label>
            <input
              id="typeName"
              value={form.type_name}
              onChange={e => setForm({ ...form, type_name: e.target.value })}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="desc">Mô tả:</label>
            <textarea
              id="desc"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button onClick={handleSave} className="saveButton">
            {editing ? 'Cập nhật' : 'Thêm'}
          </button>
          {editing && <button onClick={cancelEdit} className="cancelButton">Hủy</button>}
        </div>
      )}
    </div>
  );
};

export default ManageAircraftTypes;