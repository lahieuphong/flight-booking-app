import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Dashboard from '../admin/Dashboard';
import ManageUsers from '../admin/ManageUsers';
import ManageFlights from '../admin/ManageFlights';
import ManageAirlines from '../admin/ManageAirlines';
import ManageAircraftTypes from '../admin/ManageAircraftTypes';
import ManageAirports from '../admin/ManageAirports';
import ManageBaggage from '../admin/ManageBaggage';
import ManageMeals from '../admin/ManageMeals';
import ManagePaymentMethods from '../admin/ManagePaymentMethods';
import ManageVouchers from '../admin/ManageVouchers';
import ManagePassengers from '../admin/ManagePassengers';
import ManagePostpaidApplications from '../admin/ManagePostpaidApplications';

import '../App.css';
import './AdminLayout.css';

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUsername(storedUser.name || 'Admin');
    } else {
      // Nếu không có user, điều hướng về trang đăng nhập
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/airlines", label: "Airlines" },
    { to: "/admin/aircraft-types", label: "Aircraft Types" },
    { to: "/admin/airports", label: "Airports" },
    // { to: "/admin/flights", label: "Flights" },
    { to: "/admin/baggage", label: "Baggage" },
    { to: "/admin/meals", label: "Meals" },
    // { to: "/admin/payment-methods", label: "Payment Methods" },
    { to: "/admin/vouchers", label: "Vouchers" },
    { to: "/admin/passengers", label: "Passengers" },
    { to: "/admin/postpaid-applications", label: "Postpaid Applications" },
  ];

  const handleMouseEnter = () => setCollapsed(false);
  const handleMouseLeave = () => setCollapsed(true);
  const handleToggle = () => setCollapsed(!collapsed);

  return (
    <div className={`admin-app ${collapsed ? 'collapsed' : ''}`}>
      <aside
        className="admin-sidebar"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={handleToggle}
          className="toggle-btn"
          aria-label="Toggle sidebar"
          title={collapsed ? "Mở sidebar" : "Đóng sidebar"}
        >
          {collapsed ? '➤' : '◀'}
        </button>

        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={collapsed ? 'collapsed-item' : 'expanded'}
              title={item.label}
            >
              {collapsed ? item.label.charAt(0) : item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        {/* Navbar phía trên */}
        <header className="admin-navbar">
          {/* Logo */}
          <div className="navbar-logo">
            <img src="/images/logo-icon.png" alt="Logo" />
          </div>

          {/* Chào mừng và Đăng xuất */}
          <div className="navbar-right">
            <div className="welcome-text">Xin chào, {username}</div>
            <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
          </div>
        </header>

        {/* Nội dung */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="airlines" element={<ManageAirlines />} />
          <Route path="aircraft-types" element={<ManageAircraftTypes />} />
          <Route path="airports" element={<ManageAirports />} />
          <Route path="flights" element={<ManageFlights />} />
          <Route path="baggage" element={<ManageBaggage />} />
          <Route path="meals" element={<ManageMeals />} />
          <Route path="payment-methods" element={<ManagePaymentMethods />} />
          <Route path="vouchers" element={<ManageVouchers />} />
          <Route path="passengers" element={<ManagePassengers />} />
          <Route path="postpaid-applications" element={<ManagePostpaidApplications />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminLayout;