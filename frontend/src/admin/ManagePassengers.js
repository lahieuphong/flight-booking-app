import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ManagePassengers.css';

const API_PASSENGERS = 'http://localhost:5001/api/admin/passengers';
const API_CONTACT_INFO = 'http://localhost:5001/api/admin/passengers/contact-info';

const ManagePassengers = () => {
  // --- State quản lý hành khách ---
  const [passengers, setPassengers] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  // --- State quản lý thông tin liên hệ ---
  const [contactList, setContactList] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false); // Thêm state để kiểm tra khi nào hiển thị form

  // --- Load dữ liệu ---
  useEffect(() => {
    fetchPassengers();
    fetchContactInfo();
  }, []);

  // Lấy danh sách hành khách
  const fetchPassengers = async () => {
    try {
      const res = await axios.get(API_PASSENGERS);
      setPassengers(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách hành khách:', err);
    }
  };

  // Lấy danh sách thông tin liên hệ
  const fetchContactInfo = async () => {
    try {
      const res = await axios.get(API_CONTACT_INFO);
      setContactList(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách thông tin liên hệ:', err);
    }
  };

  // --- Xử lý mở rộng hàng ---
  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // --- Form contact_info ---
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // PUT sửa contact_info
        await axios.put(`${API_CONTACT_INFO}/${editId}`, formData);
      } else {
        // POST thêm mới contact_info
        await axios.post(API_CONTACT_INFO, formData);
      }
      setFormData({ name: '', phone: '', email: '', address: '' });
      setEditId(null);
      setShowForm(false); // Ẩn form sau khi submit
      fetchContactInfo();
    } catch (err) {
      console.error('Lỗi khi gửi dữ liệu thông tin liên hệ:', err);
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      address: contact.address || ''
    });
    setEditId(contact.id);
    setShowForm(true); // Hiển thị form khi sửa
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá thông tin này?')) {
      try {
        await axios.delete(`${API_CONTACT_INFO}/${id}`);
        if (editId === id) {
          setEditId(null);
          setFormData({ name: '', phone: '', email: '', address: '' });
        }
        fetchContactInfo();
      } catch (err) {
        console.error('Lỗi khi xoá thông tin liên hệ:', err);
      }
    }
  };

  const handleAddNew = () => {
    setFormData({ name: '', phone: '', email: '', address: '' });
    setEditId(null);
    setShowForm(true); // Hiển thị form khi thêm mới
  };

  const handleCancel = () => {
    setShowForm(false); // Ẩn form khi huỷ
  };

  return (
    <div className="manage-passengers passengers-container">
      {/* ======== DANH SÁCH HÀNH KHÁCH ======== */}
      <section className="passengers-section">
        <h2>Danh sách hành khách</h2>
        <table className="passenger-table">
          <thead>
            <tr>
              <th>Họ</th>
              <th>Tên</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>CMND/CCCD</th>
              <th>Chuyến bay</th>
              <th>Chi tiết</th>
              <th>Thanh toán</th>
              <th>Mã giảm giá</th>
            </tr>
          </thead>
          <tbody>
            {passengers.map((p) => (
              <React.Fragment key={p.id}>
                <tr>
                  <td>{p.last_name}</td>
                  <td>{p.first_name}</td>
                  <td>{p.gender}</td>
                  <td>{p.dob}</td>
                  <td>{p.id_number}</td>
                  <td>{p.flight_number}</td>
                  <td>
                    <button onClick={() => toggleRow(p.id)}>
                      {expandedRows.includes(p.id) ? 'Ẩn' : 'Chi tiết'}
                    </button>
                  </td>
                  <td>{p.payment_method_name}</td>
                  <td>{p.voucher_code}</td>
                </tr>
                {expandedRows.includes(p.id) && (
                  <tr className="contact-details-row">
                    <td colSpan="9">
                      <div>
                        <strong>Người liên hệ:</strong> {p.contact_name || 'N/A'} <br />
                        <strong>SĐT:</strong> {p.phone || 'N/A'} <br />
                        <strong>Email:</strong> {p.email || 'N/A'} <br />
                        <strong>Địa chỉ:</strong> {p.address || 'N/A'}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>

      {/* ======== QUẢN LÝ THÔNG TIN LIÊN HỆ ======== */}
      <section className="contact-info-section">
        <h2>Quản lý Thông tin Liên hệ</h2>

        <table className="contact-info-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Điện thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {contactList.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.address}</td>
                <td>
                  <div className="button-group">
                    <button className="add-new-button" onClick={handleAddNew} >Thêm</button>
                    <button className="edit-button" onClick={() => handleEdit(c)}>Sửa</button>
                    <button className="delete-button" onClick={() => handleDelete(c.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <div className="form-container">
            <h3>{editId ? 'Cập nhật thông tin liên hệ' : 'Thêm thông tin liên hệ'}</h3>
            <div className="form-group">
              <label htmlFor="name">Họ và tên:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Địa chỉ:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-buttons">
              <button className="save-button" onClick={handleSubmit}>
                {editId ? 'Cập nhật' : 'Thêm mới'}
              </button>
              <button className="cancel-button" onClick={handleCancel}>Hủy</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ManagePassengers;
