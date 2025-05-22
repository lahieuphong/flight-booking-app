import React, { useContext, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Booking from '../pages/Booking';
import CheckinOnline from '../pages/CheckinOnline';
import FlightResult from '../pages/FlightResult';
import PassengerInfo from '../pages/PassengerInfo';
import PassengerForm from '../pages/PassengerForm';
import Payment from '../pages/Payment';
import PayLater from '../pages/PayLater';
import Success from '../pages/Success';

import '../App.css';
import './UserLayout.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { AuthContext } from '../contexts/AuthContext'; // ✅ Thêm dòng này

function UserLayout() {
  const { user, logout } = useContext(AuthContext); // ✅ Dùng AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // ✅ Gọi logout từ context
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        {/* Logo bên trái */}
        <div className="navbar-logo">
          <Link to="/"><img src="/images/logo-icon.png" alt="Logo" /></Link>
        </div>

        {/* Liên kết ở giữa */}
        <div className="navbar-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/booking">Đặt vé</Link>
           <Link to="/checkin-online">Checkin online</Link>
          {user && (
            <>
              <Link to="/payment">Thanh toán</Link>
              {/* <Link to="/pay-later">Trả sau</Link> */}
            </>
          )}
        </div>

        {/* User info bên phải */}
        <div className="navbar-user">
          {user ? (
            <>
              <span className="navbar-greeting">Xin chào, {user.username}</span>
              <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register">Đăng ký</Link>
            </>
          )}
        </div>
      </nav>


      {/* Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/checkin-online" element={<CheckinOnline />} />
        <Route path="/booking/flight-result" element={<FlightResult />} />
        <Route path="/booking/flight-result/passenger-info" element={<PassengerInfo />} />
        <Route path="/booking/flight-result/passenger-info/passenger-form" element={<PassengerForm />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
        <Route path="/pay-later" element={<PayLater />} />
      </Routes>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-info">
            <p><strong>Bản quyền thuộc:</strong> Công ty cổ phần du lịch Hiểu Phong</p>
            <p><strong>Giấy phép ĐKKD số:</strong> 0101546010 Sở KHĐT Tp. Hồ Chí Minh cấp ngày 01/10/2004.</p>
            <p><strong>Hotline:</strong> (+84) 32.652.68.98</p>
            <p><strong>Email:</strong> hieuphong144@gmail.com</p>
            <div className="footer-logos">
              <img src="/images/bo-cong-thuong.png" alt="Bộ Công Thương" />
              <img src="/images/dmca.png" alt="DMCA" />
              <img src="/images/protected.png" alt="Protected" />
            </div>
          </div>

          <div className="footer-contact">
            <p><strong>Trụ sở chính:</strong> Số 430/28/5 Lê Thị Riêng, Thới An, TPHCM.</p>
            <p><strong>VPGD:</strong> B1-R6-K1-K2 TTTM Vincom Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội.</p>
            <p><strong>Chi nhánh HCM:</strong> P9.6, Bến Thành Tower, 172-174 Ký Con, Quận 1, TP.Hồ Chí Minh & Số 9 Cao Bá Nhạ, Phường Nguyễn Cư Trinh, Quận 1, TP.Hồ Chí Minh.</p>
            <p>Copyright © 2025 Hieu Phong Travel. All rights reserved.</p>
          </div>

          <div className="footer-social">
            <p><strong>LIÊN HỆ VỚI CHÚNG TÔI</strong></p>
            <div className="social-icons">
              <a href="https://www.facebook.com/lahieuphong2111/" target="_blank" rel="noopener noreferrer">
                <img src="/images/facebook.jpg" alt="Facebook" className="social-icon" />
              </a>
              <a href="https://www.tiktok.com/@hphong2111" target="_blank" rel="noopener noreferrer">
                <img src="/images/tiktok.jpg" alt="Tiktok" className="social-icon" />
              </a>
              <a href="https://www.instagram.com/hieuphonggggg/" target="_blank" rel="noopener noreferrer">
                <img src="/images/instagram.jpg" alt="Instagram" className="social-icon" />
              </a>
              <a href="https://www.pinterest.com/lahieuphong/" target="_blank" rel="noopener noreferrer">
                <img src="/images/pinterest.jpg" alt="Pinterest" className="social-icon" />
              </a>
              <a href="https://www.youtube.com/@lahieuphong144" target="_blank" rel="noopener noreferrer">
                <img src="/images/youtube.jpg" alt="Youtube" className="social-icon" />
              </a>
              <a href="https://www.threads.net/@hieuphonggggg" target="_blank" rel="noopener noreferrer">
                <img src="/images/threads.jpg" alt="Threads" className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UserLayout;