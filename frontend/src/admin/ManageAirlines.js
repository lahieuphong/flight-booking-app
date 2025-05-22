import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ManageAirlines.css';

const API_URL = 'http://localhost:5001/api/admin/airlines';

const ManageAirlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [search, setSearch] = useState('');
  const [editingAirline, setEditingAirline] = useState(null);
  const [form, setForm] = useState({ name: '', logo: null });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    try {
      const res = await axios.get(API_URL);
      setAirlines(res.data);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải danh sách hãng bay');
    }
  };

  const filteredAirlines = airlines.filter(a =>
    (a.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, logo: file });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert('Tên hãng bay không được để trống');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    if (form.logo) {
      formData.append('logo', form.logo);
    }

    try {
      if (editingAirline) {
        await axios.put(`${API_URL}/${editingAirline.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Cập nhật hãng bay thành công');
      } else {
        await axios.post(API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Thêm hãng bay thành công');
      }
      setForm({ name: '', logo: null });
      setEditingAirline(null);
      setShowForm(false);
      fetchAirlines();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu hãng bay');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa hãng bay này không?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert('Xóa hãng bay thành công');
      fetchAirlines();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa hãng bay');
    }
  };

  const startEdit = (airline) => {
    setEditingAirline(airline);
    setForm({ name: airline.name, logo: null });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingAirline(null);
    setForm({ name: '', logo: null });
    setShowForm(false);
  };

  return (
    <div className="manage-airlines airline-container">
      <h2>Quản lý Hãng bay</h2>

      <input
        className="search-input"
        placeholder="Tìm kiếm hãng bay..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table className="airline-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên hãng bay</th>
            <th>Logo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredAirlines.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">
                Không tìm thấy hãng bay
              </td>
            </tr>
          ) : (
            filteredAirlines.map(airline => {
              const logoSrc = airline.logo
                ? airline.logo.startsWith('airline-')
                  ? `http://localhost:5001/images/${airline.logo}`
                  : `/images/${airline.logo}`
                : null;

              return (
                <tr key={airline.id}>
                  <td>{airline.id}</td>
                  <td>{airline.name}</td>
                  <td>
                    {logoSrc ? (
                      <img className="airline-logo" src={logoSrc} alt={airline.name} />
                    ) : (
                      'Chưa có logo'
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-add"
                        onClick={() => {
                          setEditingAirline(null);
                          setForm({ name: '', logo: null });
                          setShowForm(true);
                        }}
                      >
                        Thêm
                      </button>
                      <button className="btn btn-edit" onClick={() => startEdit(airline)}>
                        Sửa
                      </button>
                      <button className="btn btn-delete" onClick={() => handleDelete(airline.id)}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="airline-form">
          <h3>{editingAirline ? 'Cập nhật hãng bay' : 'Thêm hãng bay mới'}</h3>

          <div className="form-group">
            <label htmlFor="airline-name">Tên hãng bay:</label>
            <input
              id="airline-name"
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="airline-logo">Chọn logo:</label>
            <input
              id="airline-logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {form.logo && (
              <div className="preview-container">
                <p>File đã chọn: {form.logo.name}</p>
                <img
                  className="logo-preview"
                  src={URL.createObjectURL(form.logo)}
                  alt="Preview"
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button className="btn btn-save" onClick={handleSave}>
              {editingAirline ? 'Cập nhật' : 'Thêm'}
            </button>
            <button className="btn btn-cancel" onClick={cancelEdit}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAirlines;