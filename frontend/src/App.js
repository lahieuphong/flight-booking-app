import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import { AuthProvider } from './contexts/AuthContext'; // ✅ Thêm dòng này

function App() {
  return (
    <AuthProvider> {/* ✅ Bọc toàn bộ Router */}
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/*" element={<UserLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;