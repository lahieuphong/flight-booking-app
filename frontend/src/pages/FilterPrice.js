import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/FilterPrice.css';

function FilterPrice({ onFilterChange }) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(() => {
    return Number(localStorage.getItem('selectedPrice')) || 0;
  });

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/price-range/min-max');
        const data = await response.json();
        if (data && data.length > 0) {
          const { min_price, max_price } = data[0];
          setMinPrice(Number(min_price));
          setMaxPrice(Number(max_price));

          if (!selectedPrice) {
            setSelectedPrice(Number(max_price));
            localStorage.setItem('selectedPrice', Number(max_price));
            // ✅ Tự động gọi khi fetch xong
            if (typeof onFilterChange === 'function') {
              onFilterChange(Number(max_price));
            }
          } else {
            if (typeof onFilterChange === 'function') {
              onFilterChange(selectedPrice);
            }
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy giá vé:', error);
      }
    };

    fetchPriceRange();

    // ✅ Bỏ qua eslint warning vì không cần thiết ở đây
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handlePriceChange = (e) => {
    const price = Number(e.target.value);
    setSelectedPrice(price);
    localStorage.setItem('selectedPrice', price);

    if (typeof onFilterChange === 'function') {
      onFilterChange(price);
    }
  };

  return (
    <div className="filter-section">
      <h3 className="filter-title">Giá vé</h3>
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        step="1000"
        value={selectedPrice}
        onChange={handlePriceChange}
      />
      <div className="price-range">
        {minPrice.toLocaleString()} VND ➔ {selectedPrice.toLocaleString()} VND
      </div>
    </div>
  );
}

FilterPrice.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterPrice;