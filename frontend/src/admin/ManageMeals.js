import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ManageMeals.css';

const API_URL = 'http://localhost:5001/api/admin/meals';

const ManageMeals = () => {
  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState('');
  const [editingMeal, setEditingMeal] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', type: 'food' });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await axios.get(API_URL);
      setMeals(res.data);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải danh sách bữa ăn');
    }
  };

  const filteredMeals = meals.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.type.toLowerCase().includes(search.toLowerCase())
  );

  const validMeals = filteredMeals.filter((m) => m.name !== 'Không chọn');
  const foodMeals = validMeals.filter((m) => m.type === 'food');
  const drinkMeals = validMeals.filter((m) => m.type === 'drink');

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert('Tên món ăn không được để trống');
      return;
    }

    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0) {
      alert('Giá tiền phải là số không âm');
      return;
    }

    if (!['food', 'drink'].includes(form.type)) {
      alert('Phân loại không hợp lệ');
      return;
    }

    try {
      if (editingMeal) {
        await axios.put(`${API_URL}/${editingMeal.id}`, {
          name: form.name.trim(),
          price: parseFloat(form.price),
          type: form.type,
        });
        alert('Cập nhật bữa ăn thành công');
      } else {
        await axios.post(API_URL, {
          name: form.name.trim(),
          price: parseFloat(form.price),
          type: form.type,
        });
        alert('Thêm bữa ăn thành công');
      }

      setForm({ name: '', price: '', type: 'food' });
      setEditingMeal(null);
      setFormVisible(false);
      fetchMeals();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu bữa ăn');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa món ăn này không?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert('Xóa món ăn thành công');
      fetchMeals();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa món ăn');
    }
  };

  const startEdit = (meal) => {
    setEditingMeal(meal);
    setForm({
      name: meal.name,
      price: meal.price.toString(),
      type: meal.type,
    });
    setFormVisible(true);
  };

  const cancelEdit = () => {
    setEditingMeal(null);
    setForm({ name: '', price: '', type: 'food' });
    setFormVisible(false);
  };

  const startAdd = () => {
    setEditingMeal(null);
    setForm({ name: '', price: '', type: 'food' });
    setFormVisible(true);
  };

  const renderTable = (title, meals) => (
    <div className="mealTableWrapper">
      <h3>{title}</h3>
      <table className="mealTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên món ăn</th>
            <th>Giá tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {meals.length === 0 ? (
            <tr className="emptyRow">
              <td colSpan={4}>Không tìm thấy món ăn</td>
            </tr>
          ) : (
            meals.map((meal) => (
              <tr key={meal.id}>
                <td>{meal.id}</td>
                <td>{meal.name}</td>
                <td>{Number(meal.price).toLocaleString('vi-VN')} VND</td>
                <td>
                  <button className="actionButton" onClick={startAdd}>
                    Thêm
                  </button>
                  <button className="actionButton" onClick={() => startEdit(meal)}>
                    Sửa
                  </button>
                  <button
                    className="actionButton deleteButton"
                    onClick={() => handleDelete(meal.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container">
      <h2>Quản lý Bữa ăn trên máy bay</h2>

      <input
        className="searchInput"
        placeholder="Tìm kiếm tên món ăn hoặc loại..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="tableSection">
        {renderTable('🍱 Danh sách Đồ ăn', foodMeals)}
        {renderTable('🥤 Danh sách Đồ uống', drinkMeals)}
      </div>

      {formVisible && (
        <div className="formContainer">
          <h3>{editingMeal ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}</h3>
          <div className="formGroup">
            <label htmlFor="meal-name">Tên món ăn:</label>
            <input
              id="meal-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="meal-price">Giá tiền (VNĐ):</label>
            <input
              id="meal-price"
              type="number"
              min="0"
              step="1000"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="meal-type">Phân loại:</label>
            <select
              id="meal-type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="food">Đồ ăn</option>
              <option value="drink">Đồ uống</option>
            </select>
          </div>
          <div className="formActions">
            <button className="saveButton" onClick={handleSave}>
              {editingMeal ? 'Cập nhật' : 'Thêm'}
            </button>
            <button className="cancelButton" onClick={cancelEdit}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMeals;