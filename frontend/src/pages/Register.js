import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';  // css riêng

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const role = 'user';

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (password !== confirmPassword) {
      setLoading(false);
      setErrorMessage('Mật khẩu nhập lại không khớp.');
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/register', {
        username,
        email,
        password,
        role,
      });

      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Đã có lỗi xảy ra. Vui lòng thử lại!');
      }
    }
  };

  return (
    <div className="register-container">
      <img
        src="/images/plane_3.png"
        alt="plane"
        className="register-bg-image"
      />
      <div className="register-content">
        <h2>Đăng ký</h2>

        {errorMessage && <p className="register-error-message">{errorMessage}</p>}
        {loading && <div className="register-loading-spinner">Đang đăng ký...</div>}

        <form onSubmit={handleRegister}>
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên người dùng"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>
          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;