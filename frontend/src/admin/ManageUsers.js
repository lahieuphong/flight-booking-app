import React, { useState, useEffect } from 'react';
import './styles/ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user', is_active: true });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const API_URL = 'http://localhost:5001/api/admin/user';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      alert('Lỗi khi tải danh sách user');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.username || !form.email) {
      alert('Username và Email không được để trống');
      return;
    }

    try {
      const updatedUser = {
        ...form,
        password: form.password || (editingUser ? editingUser.password : ''),
      };

      if (editingUser) {
        const res = await fetch(`${API_URL}/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
        if (!res.ok) throw new Error('Update failed');
        const newUser = await res.json();
        setUsers(users.map(u => (u.id === newUser.id ? newUser : u)));
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
        if (!res.ok) throw new Error('Create failed');
        const newUser = await res.json();
        setUsers([...users, newUser]);
      }

      setEditingUser(null);
      setForm({ username: '', email: '', password: '', role: 'user', is_active: true });
      setShowForm(false);
    } catch (error) {
      alert('Lỗi khi lưu user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này không?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      alert('Lỗi khi xóa user');
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      is_active: user.is_active
    });
    setShowForm(true);
  };

  const startAddNew = () => {
    setEditingUser(null);
    setForm({ username: '', email: '', password: '', role: 'user', is_active: true });
    setShowForm(true);
  };

  const cancelForm = () => {
    setEditingUser(null);
    setForm({ username: '', email: '', password: '', role: 'user', is_active: true });
    setShowForm(false);
  };

  return (
    <div className="manage-users users-container">
      <h2>Quản lý Người dùng</h2>

      <input
        className="searchInput"
        placeholder="Tìm kiếm username hoặc email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="userTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={7} className="noData">Không tìm thấy user</td></tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.role}</td>
                  <td>{user.is_active ? 'Có' : 'Khóa'}</td>
                  <td>
                    <button className="addButton" onClick={startAddNew}>Thêm</button>
                    <button className="actionButton" onClick={() => startEdit(user)}>Sửa</button>
                    <button className="deleteButton" onClick={() => handleDelete(user.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="formContainer">
          <h3>{editingUser ? 'Cập nhật user' : 'Thêm user mới'}</h3>

          <div className="formGroup">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              id="password"
              type="password"
              placeholder={editingUser ? 'Để trống nếu không đổi mật khẩu' : ''}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="formGroup checkboxLabel">
            <label htmlFor="is_active">Kích hoạt tài khoản:</label>
            <input
              id="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={e => setForm({ ...form, is_active: e.target.checked })}
            />
          </div>

          <button className="saveButton" onClick={handleSave}>
            {editingUser ? 'Cập nhật' : 'Thêm mới'}
          </button>
          <button className="cancelButton" onClick={cancelForm}>Hủy</button>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;