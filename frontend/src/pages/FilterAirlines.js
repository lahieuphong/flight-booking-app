import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function FilterAirlines({ onFilterChange }) {
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/airlines')
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((airline) => ({
          ...airline,
          is_checked: true,
        }));
        setAirlines(updatedData);

        // ✅ Trả về tất cả các hãng hàng không khi load trang lần đầu
        const initialSelected = updatedData.map((airline) => airline.name);
        onFilterChange(initialSelected);
      })
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
  }, [onFilterChange]);

  // ✅ Xử lý khi thay đổi checkbox của từng hãng hàng không
  const handleCheckboxChange = (id) => {
    setAirlines((prevAirlines) => {
      const updatedAirlines = prevAirlines.map((airline) =>
        airline.id === id
          ? { ...airline, is_checked: !airline.is_checked }
          : airline
      );

      const selectedAirlines = updatedAirlines
        .filter((airline) => airline.is_checked)
        .map((airline) => airline.name);

      if (typeof onFilterChange === 'function') {
        onFilterChange(selectedAirlines);
      }

      return updatedAirlines;
    });
  };

  return (
    <div className="filter-section">
      <h3 className="filter-title">Hãng chuyên chở</h3>
      <table className="filter-table">
        <thead>
          <tr>
            <th>Hiển thị</th>
            <th>Hãng hàng không</th>
          </tr>
        </thead>
        <tbody>
          {/* ✅ Danh sách các hãng hàng không */}
          {airlines.map((airline) => (
            // ✅ Thêm class 'selected' cho hàng được chọn
            <tr
                key={airline.id}
                className={airline.is_checked ? 'selected' : ''}
            >
                <td>
                    <input
                    type="checkbox"
                    checked={airline.is_checked}
                    onChange={() => handleCheckboxChange(airline.id)}
                    />
                </td>
                <td>{airline.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FilterAirlines.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterAirlines;