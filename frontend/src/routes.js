import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function Home() {
  return <h2>Home Page</h2>;
}

function Booking() {
  return <h2>Booking Page</h2>;
}

function RoutesComponent() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Router>
  );
}

export default RoutesComponent;