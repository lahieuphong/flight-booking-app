import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5001/api/login', { email, password });

      const user = response.data.user;
      localStorage.setItem('authToken', response.data.token || '');

      login(user);

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/booking');
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!'
      );
    }
  };

  return (
    <div className="login-container">
      {/* Image làm background */}
      <img 
        src="/images/plane_2.png" 
        alt="plane" 
        className="login-bg-image" 
      />
      {/* Nội dung form và tiêu đề */}
      <div className="login-content">
        <h2>Đăng nhập</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {loading && <div className="loading-spinner">Đang đăng nhập...</div>}
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              required
            />
          </div>
          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default Login;