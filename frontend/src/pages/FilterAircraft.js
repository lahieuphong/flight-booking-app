import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function FilterAircraft({ onFilterChange }) {
  const [aircrafts, setAircrafts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/aircraft/types')
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((aircraft) => ({
          ...aircraft,
          is_checked: true,
        }));
        setAircrafts(updatedData);

        console.log('🔄 Initial state:', updatedData);

        // ✅ Đảm bảo trả về [] khi load xong mà không có gì được chọn
        onFilterChange([]);
      })
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
  }, [onFilterChange]);

  // ✅ Dùng useEffect để theo dõi sự thay đổi của state và cập nhật dữ liệu
  useEffect(() => {
    const selectedAircrafts = aircrafts
      .filter((aircraft) => aircraft.is_checked)
      .map((aircraft) => aircraft.type_name);

    console.log('🚀 Selected aircrafts:', selectedAircrafts);

    // ✅ Trả về [] nếu không có mục nào được chọn
    onFilterChange(selectedAircrafts);
  }, [aircrafts, onFilterChange]);

  // ✅ Xử lý khi thay đổi checkbox của từng loại máy bay
  const handleCheckboxChange = (id) => {
    setAircrafts((prevAircrafts) =>
      prevAircrafts.map((aircraft) =>
        aircraft.id === id
          ? { ...aircraft, is_checked: !aircraft.is_checked }
          : aircraft
      )
    );
  };

  return (
    <div className="filter-wrapper">
      <div className="filter-section">
        <h3 className="filter-title">Loại máy bay</h3>
        <table className="filter-table">
          <thead>
            <tr>
              <th>Hiển thị</th>
              <th>Loại máy bay</th>
            </tr>
          </thead>
          <tbody>
            {/* ✅ Danh sách loại máy bay */}
            {aircrafts.map((aircraft) => (
              <tr key={aircraft.id}
                  className={aircraft.is_checked ? 'selected' : ''}
              > 
                <td>
                  <input
                    type="checkbox"
                    checked={aircraft.is_checked}
                    onChange={() => handleCheckboxChange(aircraft.id)}
                  />
                </td>
                <td>{aircraft.type_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
  );
}

FilterAircraft.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterAircraft;
