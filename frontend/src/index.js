import React from 'react';
import ReactDOM from 'react-dom/client'; // Sử dụng từ react-dom/client thay vì react-dom
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);