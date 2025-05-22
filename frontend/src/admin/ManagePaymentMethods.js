import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/ManagePostpaidApplications.css';

const API_BASE = 'http://localhost:5001/api/admin/postpaid';
const BACKEND_BASE = 'http://localhost:5001';

function ManagePostpaid() {
  const [applications, setApplications] = useState([]);
  const [partners, setPartners] = useState([]);
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    description: '',
    logo_url: '',
    payment_method_code: 'postpaid',
    is_active: 1,
  });
  const [editingId, setEditingId] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchApplications();
    fetchPartners();
  }, []);

  // Lấy danh sách đơn đăng ký
  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/applications`);
      // Mặc định status sẽ là undefined hoặc lấy từ API
      setApplications(res.data.map(app => ({ ...app, status: app.status || null })));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn đăng ký:', error);
    }
  };

  // Lấy danh sách đối tác
  const fetchPartners = async () => {
    try {
      const res = await axios.get(`${API_BASE}/partners`);
      setPartners(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy đối tác:', error);
    }
  };

  // Cập nhật trạng thái đơn đăng ký
  const updateApplicationStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE}/applications/${id}/status`, { status });
      // Cập nhật trạng thái local để UI thay đổi ngay
      setApplications(applications.map(app => {
        if (app.id === id) return { ...app, status };
        return app;
      }));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPartnerForm({ ...partnerForm, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
    }
  };

  const savePartner = async () => {
    try {
      const formData = new FormData();
      formData.append('name', partnerForm.name);
      formData.append('description', partnerForm.description);
      formData.append('payment_method_code', partnerForm.payment_method_code);
      formData.append('is_active', partnerForm.is_active);
      if (logoFile) {
        formData.append('logo', logoFile);
      } else {
        formData.append('logo_url', partnerForm.logo_url);
      }

      if (editingId) {
        await axios.put(`${API_BASE}/partners/${editingId}`, formData);
      } else {
        await axios.post(`${API_BASE}/partners`, formData);
      }

      setPartnerForm({
        name: '',
        description: '',
        logo_url: '',
        payment_method_code: 'postpaid',
        is_active: 1,
      });
      setLogoFile(null);
      setPreviewUrl('');
      setEditingId(null);
      fetchPartners();
    } catch (error) {
      console.error('Lỗi khi lưu đối tác:', error);
    }
  };

  const editPartner = (partner) => {
    setPartnerForm(partner);
    setEditingId(partner.id);
    setLogoFile(null);
    setPreviewUrl('');
  };

  const deletePartner = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đối tác này không?')) {
      try {
        await axios.delete(`${API_BASE}/partners/${id}`);
        fetchPartners();
      } catch (error) {
        console.error('Lỗi khi xóa đối tác:', error);
      }
    }
  };

  const getLogoSrc = (logoUrl) => {
    if (!logoUrl) return '';
    if (logoUrl.startsWith('airline-') || logoUrl.startsWith('partner-') || logoUrl.startsWith('logo-')) {
      return `${BACKEND_BASE}/logos/${logoUrl}`;
    } else {
      return `/images/${logoUrl}`;
    }
  };

  return (
    <div className="postpaid-container">
      <h2>Đối tác trả sau</h2>
      <div className="partner-form">
        <input
          name="name"
          placeholder="Tên đối tác"
          value={partnerForm.name}
          onChange={handleFormChange}
        />
        <input
          name="description"
          placeholder="Mô tả"
          value={partnerForm.description}
          onChange={handleFormChange}
        />
        <input
          name="logo_url"
          placeholder="Logo URL (nếu không upload)"
          value={partnerForm.logo_url}
          onChange={handleFormChange}
        />
        <input type="file" accept="image/*" onChange={handleLogoChange} />
        {previewUrl && (
          <img src={previewUrl} alt="Preview" width="100" style={{ marginTop: '10px' }} />
        )}
        <select name="is_active" value={partnerForm.is_active} onChange={handleFormChange}>
          <option value={1}>Đang hoạt động</option>
          <option value={0}>Ngưng hoạt động</option>
        </select>
        <button onClick={savePartner}>{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
      </div>

      <table className="postpaid-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Logo</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.id}>
              <td>{partner.name}</td>
              <td>{partner.description}</td>
              <td>
                {partner.logo_url ? (
                  <img src={getLogoSrc(partner.logo_url)} alt="logo" width="50" />
                ) : (
                  'Không có'
                )}
              </td>
              <td>{partner.is_active ? 'Hoạt động' : 'Ngưng'}</td>
              <td>
                <button onClick={() => editPartner(partner)}>Sửa</button>
                <button onClick={() => deletePartner(partner.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Đơn đăng ký trả sau</h2>
      <table className="postpaid-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>CMND/CCCD</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Nghề nghiệp</th>
            <th>Thu nhập</th>
            <th>Đối tác</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} style={{ opacity: app.status === 'rejected' ? 0.5 : 1 }}>
              <td>{app.full_name}</td>
              <td>{app.national_id}</td>
              <td>{app.email}</td>
              <td>{app.phone}</td>
              <td>{app.address}</td>
              <td>{app.occupation}</td>
              <td>{app.monthly_income.toLocaleString()} đ</td>
              <td>{app.partner_name}</td>
              <td>
                {app.status === 'approved' ? (
                  <span style={{ color: 'green', fontWeight: 'bold' }}>✔ Đã phê duyệt</span>
                ) : app.status === 'rejected' ? (
                  <button disabled>Từ chối</button>
                ) : (
                  <>
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'approved')}
                      disabled={app.status === 'rejected'}
                    >
                      Phê duyệt
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                      disabled={app.status === 'rejected'}
                    >
                      Từ chối
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagePostpaid;