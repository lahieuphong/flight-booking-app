import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import FlightResult from './pages/FlightResult';
import PassengerInfo from './pages/PassengerInfo';
import PassengerForm from './pages/PassengerForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/booking">Booking</Link>
          <Link to="/booking/flight-result">FlightResult</Link>
          <Link to="/booking/flight-result/passenger-info">PassengerInfo</Link>
          <Link to="/booking/flight-result/passenger-info/passenger-form">PassengerForm</Link>
        </nav>

        {/* Routing */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/flight-result" element={<FlightResult />} />
          <Route path="/booking/flight-result/passenger-info" element={<PassengerInfo />} />
          <Route path="/booking/flight-result/passenger-info/passenger-form" element={<PassengerForm />} />
        </Routes>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-info">
              <p>
                Bản quyền thuộc: <strong>Công ty cổ phần du lịch Hiểu Phong</strong>.
              </p>
              <p>
                <strong>Giấy phép ĐKKD số:</strong> 0101546010 Sở KHĐT Tp. Hồ Chí Minh cấp ngày 01/10/2004.
              </p>
              <p>
                <strong>Hotline:</strong> (+84) 32.652.68.98
              </p>
              <p>
                <strong>Email:</strong> hieuphong144@gmail.com
              </p>
              <div className="footer-logos">
                <img src="/images/bo-cong-thuong.png" alt="Bộ Công Thương" />
                <img src="/images/dmca.png" alt="DMCA" />
                <img src="/images/protected.png" alt="Protected" />
              </div>
            </div>

            <div className="footer-contact">
              <p>
                <strong>Trụ sở chính:</strong> Số 430 Lê Thị Riêng, Thới An, TPHCM.
              </p>
              <p>
                <strong>VPGD:</strong> B1-R6-K1-K2 TTTM Vincom Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội.
              </p>
              <p>
                <strong>Chi nhánh HCM:</strong> P9.6, Bến Thành Tower, 172-174 Ký Con, Quận 1, TP.Hồ Chí Minh & Số 9 Cao Bá Nhạ, Phường Nguyễn Cư Trinh, Quận 1, TP.Hồ Chí Minh.
              </p>
              <p>Copyright © 2025 Hieu Phong Travel. All rights reserved.</p>
            </div>

            <div className="footer-social">
              <p><strong>LIÊN HỆ VỚI CHÚNG TÔI</strong></p>
              <div className="social-icons">
                {/* Facebook */}
                <a href="https://www.facebook.com/lahieuphong2111/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/facebook.jpg" alt="Facebook" className="social-icon" />
                </a>
                {/* Tiktok */}
                <a href="https://www.tiktok.com/@hphong2111" target="_blank" rel="noopener noreferrer">
                  <img src="/images/tiktok.jpg" alt="Tiktok" className="social-icon" />
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/hieuphonggggg/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/instagram.jpg" alt="Instagram" className="social-icon" />
                </a>
                {/* Pinterest */}
                <a href="https://www.pinterest.com/lahieuphong/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/pinterest.jpg" alt="Pinterest" className="social-icon" />
                </a>
                {/* Youtube */}
                <a href="https://www.youtube.com/@lahieuphong144" target="_blank" rel="noopener noreferrer">
                  <img src="/images/youtube.jpg" alt="Youtube" className="social-icon" />
                </a>
                {/* Threads */}
                <a href="https://www.threads.net/@hieuphonggggg" target="_blank" rel="noopener noreferrer">
                  <img src="/images/threads.jpg" alt="Threads" className="social-icon" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
