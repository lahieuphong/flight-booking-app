import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ManageAirports.css';

const API_URL = 'http://localhost:5001/api/admin/airports';

const ManageAirports = () => {
  const [airports, setAirports] = useState([]);
  const [search, setSearch] = useState('');
  const [editingAirport, setEditingAirport] = useState(null);
  const [form, setForm] = useState({ name: '', code: '' });
  const [showForm, setShowForm] = useState(false);  // Trạng thái để hiển thị form thêm hoặc sửa

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const res = await axios.get(API_URL);
      setAirports(res.data);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải danh sách sân bay');
    }
  };

  const filteredAirports = airports.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      alert('Tên và mã sân bay không được để trống');
      return;
    }

    try {
      if (editingAirport) {
        await axios.put(`${API_URL}/${editingAirport.id}`, form);
        alert('Cập nhật sân bay thành công');
      } else {
        await axios.post(API_URL, form);
        alert('Thêm sân bay thành công');
      }
      setForm({ name: '', code: '' });
      setEditingAirport(null);
      setShowForm(false);  // Ẩn form sau khi lưu
      fetchAirports();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu sân bay');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sân bay này không?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert('Xóa sân bay thành công');
      fetchAirports();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa sân bay');
    }
  };

  const startEdit = (airport) => {
    setEditingAirport(airport);
    setForm({ name: airport.name, code: airport.code });
    setShowForm(true);  // Hiển thị form khi bắt đầu sửa
  };

  const cancelEdit = () => {
    setEditingAirport(null);
    setForm({ name: '', code: '' });
    setShowForm(false);  // Ẩn form khi hủy sửa
  };

  // Hàm để mở form thêm sân bay mới
  const handleAddNew = () => {
    setForm({ name: '', code: '' });
    setEditingAirport(null);
    setShowForm(true);  // Hiển thị form khi thêm mới sân bay
  };

  return (
    <div className="manage-airports airports-container">
      <h2>Quản lý Sân bay</h2>

      <input
        className="searchInput"
        placeholder="Tìm kiếm tên hoặc mã sân bay..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table className="userTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sân bay</th>
            <th>Mã</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredAirports.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
                Không tìm thấy sân bay
              </td>
            </tr>
          )}
          {filteredAirports.map(airport => (
            <tr key={airport.id}>
              <td>{airport.id}</td>
              <td>{airport.name}</td>
              <td>{airport.code}</td>
              <td>
                <button className="addButton" onClick={handleAddNew}>Thêm</button>
                <button className="actionButton" onClick={() => startEdit(airport)}>Sửa</button>
                <button className="actionButton deleteButton" onClick={() => handleDelete(airport.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form thêm hoặc sửa sân bay */}
      {showForm && (
        <div className="formContainer">
          <h3>{editingAirport ? 'Cập nhật sân bay' : 'Thêm sân bay mới'}</h3>
          <div className="formGroup">
            <label htmlFor="airport-name">Tên sân bay:</label>
            <input
              id="airport-name"
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="airport-code">Mã sân bay:</label>
            <input
              id="airport-code"
              type="text"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
          </div>
          <button className="saveButton" onClick={handleSave}>
            {editingAirport ? 'Cập nhật' : 'Thêm'}
          </button>
          {editingAirport && (
            <button className="cancelButton" onClick={cancelEdit}>Hủy</button>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageAirports;