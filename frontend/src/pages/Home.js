import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <div
      className="home-hero"
      style={{ backgroundImage: 'url(/images/plane.png)' }}
    >
      <div className="content-wrapper">
        <div className="overlay">
          <h1>Chào mừng bạn đến với Flight Booking App</h1>
          <p>Đặt vé máy bay dễ dàng, nhanh chóng và tiện lợi khắp mọi nơi.</p>
          <a href="/booking" className="home-button">Đặt vé ngay</a>
        </div>
      </div>
    </div>
  );
}

export default Home;