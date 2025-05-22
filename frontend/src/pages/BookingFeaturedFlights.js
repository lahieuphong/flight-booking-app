import React, { useRef, useEffect } from 'react';
import '../styles/BookingFeaturedFlights.css';

const Booking_FeaturedFlights = () => {
  const listRef = useRef(null);

  const scrollAmount = 1000;  // Số pixel cuộn mỗi lần

  // Hàm cuộn tự động và khi nhấn nút
  const scroll = (direction) => {
    if (listRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = listRef.current;

      if (direction === 'left') {
        listRef.current.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth',
        });
      } else if (direction === 'right') {
        listRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });
      }

      // Nếu đã cuộn hết, quay lại từ đầu
      if (scrollLeft + clientWidth >= scrollWidth) {
        listRef.current.scrollLeft = 0;
      }
    }
  };

  // Cuộn tự động sau mỗi khoảng thời gian
  useEffect(() => {
    const interval = setInterval(() => {
      scroll('right'); // Cuộn tự động sang phải mỗi 2 giây
    }, 2000);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="booking-featured-flights">
      <h3>Chuyến bay nổi bật</h3>
      <div className="flight-list" ref={listRef}>
        {/* Card 1 */}
        <a
          href="https://www.etrip4u.com/du-lich/uu-dai-ngap-tran-san-sang-kham-pha-duong-bay-moi-cung-vietnam-airlines"
          target="_blank"
          rel="noopener noreferrer"
          className="flight-card"
        >
          <img src="/images/flight1.jpg" alt="Flight 1" />
          <p>ƯU ĐÃI NGẬP TRÀN - SẴN SÀNG KHÁM PHÁ ĐƯỜNG BAY MỚI CÙNG VIETNAM AIRLINES</p>
        </a>

        {/* Card 2 */}
        <a
          href="https://www.etrip4u.com/du-lich/bay-cung-nua-yeu-thuong-uu-dai-50-phi-hanh-ly-cung-bamboo-airways"
          target="_blank"
          rel="noopener noreferrer"
          className="flight-card"
        >
          <img src="/images/flight2.jpg" alt="Flight 2" />
          <p>BAY CÙNG NỮA YÊU THƯƠNG – Ưu đãi 50% Phí Hành Lý Cùng Bamboo Airways</p>
        </a>

        {/* Card 3 */}
        <a
          href="https://www.etrip4u.com/du-lich/chao-he-ruc-ro-cung-vietnam-airlines-san-ve-uu-dai-cuc-hot-bay-tha-ga-gia-sieu-hoi"
          target="_blank"
          rel="noopener noreferrer"
          className="flight-card"
        >
          <img src="/images/flight3.jpg" alt="Flight 3" />
          <p>Chào hè rực rỡ cùng Vietnam Airlines! Săn vé ưu đãi cực hot - Bay thả ga, giá siêu hời!</p>
        </a>

        {/* Card 4 */}
        <a
          href="https://www.etrip4u.com/du-lich/hai-phong-bay-thang-den-bangkok-cung-airasia-tien-loi-and-tiet-kiem"
          target="_blank"
          rel="noopener noreferrer"
          className="flight-card"
        >
          <img src="/images/flight4.jpg" alt="Flight 4" />
          <p>Hải Phòng Bay Thẳng Đến Bangkok Cùng AirAsia - Tiện Lợi & Tiết Kiệm!</p>
        </a>

        {/* Card 5 */}
        <a
          href="https://www.etrip4u.com/du-lich/nang-hang-mien-phi-and-giam-20-chuyen-bay-tiep-theo-cung-vietnam-airlines"
          target="_blank"
          rel="noopener noreferrer"
          className="flight-card"
        >
          <img src="/images/flight5.jpg" alt="Flight 5" />
          <p>Nâng Hạng Miễn Phí & Giảm 20% Chuyến Bay Tiếp Theo cùng Vietnam Airlines</p>
        </a>

        {/* Card 6 */}
        <a
          href="https://www.etrip4u.com/du-lich/san-ve-viet-nam-bac-kinh-gia-tot-cung-vietnam-airlines"
          target="_blank"
          rel="noopener noreferrer"
          className="flight-card"
        >
          <img src="/images/flight6.jpg" alt="Flight 6" />
          <p>Săn vé Việt Nam - Bắc Kinh giá tốt cùng Vietnam Airlines</p>
        </a>
      </div>
      
    </div>
  );
};

export default Booking_FeaturedFlights;