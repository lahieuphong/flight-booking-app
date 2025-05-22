// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // ✅ Thêm dòng này

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Thêm đoạn này để tránh cảnh báo ESLint
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};