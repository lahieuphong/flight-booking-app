import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ManageBaggage.css';

const API_URL = 'http://localhost:5001/api/admin/baggage';

const ManageBaggage = () => {
  const [baggageList, setBaggageList] = useState([]);
  const [search, setSearch] = useState('');
  const [editingBaggage, setEditingBaggage] = useState(null);
  const [form, setForm] = useState({ weight: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchBaggage = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setBaggageList(res.data);
    } catch (error) {
      alert('Lỗi khi tải danh sách hành lý');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBaggage();
  }, []);

  const filteredBaggage = baggageList.filter(b =>
    b.weight.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.weight.trim() || form.price === '') {
      alert('Cân nặng và giá không được để trống');
      return;
    }

    try {
      const newBaggage = {
        ...form,
        id: baggageList.length + 1,
      };

      if (editingBaggage) {
        await axios.put(`${API_URL}/${editingBaggage.id}`, form);
        alert('Cập nhật hành lý thành công');
        setBaggageList(baggageList.map(b => (b.id === editingBaggage.id ? { ...b, ...form } : b)));
      } else {
        await axios.post(API_URL, newBaggage);
        alert('Thêm hành lý thành công');
        setBaggageList([...baggageList, newBaggage]);
      }

      setEditingBaggage(null);
      setForm({ weight: '', price: '' });
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert('Lỗi khi lưu hành lý');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa mức hành lý này không?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert('Xóa hành lý thành công');
      setBaggageList(baggageList.filter(b => b.id !== id));
    } catch (error) {
      alert('Lỗi khi xóa hành lý');
    }
  };

  const startEdit = (baggage) => {
    setEditingBaggage(baggage);
    setForm({ weight: baggage.weight, price: baggage.price });
    setShowForm(true);
  };

  const startAddNew = () => {
    setEditingBaggage(null);
    setForm({ weight: '', price: '' });
    setShowForm(true);
  };

  const cancelForm = () => {
    setEditingBaggage(null);
    setForm({ weight: '', price: '' });
    setShowForm(false);
  };

  return (
    <div className="manage-baggage baggage-container">
      <h2>Quản lý Hành lý ký gửi</h2>

      <input
        className="search-input"
        placeholder="Tìm kiếm theo cân nặng..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="baggage-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cân nặng (kg)</th>
              <th>Giá (VND)</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBaggage.length === 0 ? (
              <tr><td colSpan={4} className="center-text">Không tìm thấy hành lý</td></tr>
            ) : (
              filteredBaggage.map(baggage => (
                <tr key={baggage.id}>
                  <td>{baggage.id}</td>
                  <td>{baggage.weight} kg</td>
                  <td>{Number(baggage.price).toLocaleString()} VND</td>
                  <td>
                    <div className="button-group">
                      <button className="add-button" onClick={startAddNew}>Thêm</button>
                      <button className="edit-button" onClick={() => startEdit(baggage)}>Sửa</button>
                      <button className="delete-button" onClick={() => handleDelete(baggage.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="form-container">
          <h3>{editingBaggage ? 'Cập nhật hành lý' : 'Thêm hành lý mới'}</h3>
          <div className="form-group">
            <label htmlFor="weight">Cân nặng (kg):</label>
            <input
              type="text"
              id="weight"
              value={form.weight}
              onChange={e => setForm({ ...form, weight: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Giá (VNĐ):</label>
            <input
              type="number"
              id="price"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div className="form-buttons">
            <button className="save-button" onClick={handleSave}>
              {editingBaggage ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button className="cancel-button" onClick={cancelForm}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBaggage;