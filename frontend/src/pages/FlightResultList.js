import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/FlightResultList.css';

const FlightResultList = ({
    flights,
    setFlights,
    adults,
    childCount,
    infants,
    onContinue,
    excludedFlight, // 🆕 Thêm prop này
}) => {
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [seatTypes, setSeatTypes] = useState([]);

    useEffect(() => {
        const fetchSeatTypes = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/seats');
                const data = await res.json();
                setSeatTypes(data);
            } catch (err) {
                console.error('Lỗi khi lấy loại ghế:', err);
            }
        };
        fetchSeatTypes();
    }, []);

    const handleSelectFlight = async (flightNumber) => {
        if (selectedFlight?.flight_number === flightNumber) {
            setSelectedFlight(null);
            return;
        }

        try {
            const res = await fetch(`http://localhost:5001/api/prices/${flightNumber}`);
            const data = await res.json();
            setSelectedFlight(data);
        } catch (err) {
            console.error('Lỗi khi gọi API:', err);
            alert('Không tìm thấy chuyến bay hoặc lỗi kết nối');
        }
    };

    const handleSeatTypeChange = async (flight, newSeatTypeId) => {
        try {
            const res = await fetch('http://localhost:5001/api/update-seat-type', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    flight_number: flight.flight_number,
                    seat_type_id: newSeatTypeId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Cập nhật không thành công');
            }

            // ✅ Cập nhật trực tiếp flight tại chỗ để tránh mất dữ liệu
            const updatedFlight = { ...flight, seat_type_id: newSeatTypeId };
            setFlights((prevFlights) =>
                prevFlights.map((f) =>
                    f.flight_number === flight.flight_number ? updatedFlight : f
                )
            );

            // ✅ Nếu đang là selectedFlight thì cập nhật luôn selected
            if (selectedFlight?.flight_number === flight.flight_number) {
                const selectedSeat = seatTypes.find(type => type.id === newSeatTypeId);
            
                setSelectedFlight({
                    ...selectedFlight,
                    seat_type_id: newSeatTypeId,
                    additional_price: selectedSeat?.additional_price || 0,
                });
            }            
        } catch (err) {
            console.error('Lỗi khi cập nhật seat_type_id:', err);
            alert('Lỗi khi cập nhật ghế: ' + err.message);
        }
    };


    return (
        <div className="flight-list-container">
            {flights.length > 0 ? (
                flights
                .filter((flight) => flight.flight_number !== excludedFlight?.flight_number) // 🧠 Lọc ra
                .map((flight) => (
                    <div
                        key={flight.flight_number}
                        className={`flight-item ${selectedFlight?.flight_number === flight.flight_number ? 'selected' : ''}`} // Thêm lớp 'selected' nếu chuyến bay này được chọn
                    >
                        <div className="flight-list">
                            <div className="airline-logo-wrapper">
                                <img
                                    src={`/images/${flight.airline_logo}`}
                                    alt={flight.airline_name}
                                    className="airline-logo"
                                    onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                                />
                            </div>

                            <div className="flight-info">
                                <div className="flight-data">
                                    <span className="airline-name">{flight.airline_name}</span>
                                    <span>{flight.flight_number} | {flight.aircraft_type}</span>
                                </div>
                                <div className="flight-time">
                                    <span className="departure-time">{flight.departure_time || 'N/A'}</span>
                                    <span className="duration">{flight.duration || 'N/A'}</span>
                                    <span className="arrival-time">{flight.arrival_time || 'N/A'}</span>
                                </div>
                                <div className="flight-route">
                                    {flight.departure_airport_code} → {flight.arrival_airport_code}
                                </div>
                            </div>

                            <div className="flight-price-wrapper">
                                <div className="seat-type-wrapper">
                                    Chọn loại ghế:
                                    <select
                                        className="custom-seat-select"
                                        value={Number(flight.seat_type_id) || ''}
                                        onChange={(e) => handleSeatTypeChange(flight, Number(e.target.value))}
                                    >
                                        {seatTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.remaining_seats} (+{Number(type.additional_price).toLocaleString()} VND)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <span className="price">
                                    {flight.price ? `${Number(flight.price).toLocaleString()} VND` : 'N/A'}
                                </span>
                                <button
                                    className="choose-btn"
                                    onClick={() => handleSelectFlight(flight.flight_number)}
                                >
                                    {selectedFlight?.flight_number === flight.flight_number ? 'Bỏ chọn' : 'Chọn'}
                                </button>
                            </div>
                        </div>

                        {selectedFlight?.flight_number === flight.flight_number && (
                        <div className="selected-flight">
                            <table className="flight-detail-table">
                                <thead>
                                    <tr>
                                        <th><span role="img" aria-label="Người dùng">👤</span> Loại hành khách</th>
                                        <th><span role="img" aria-label="Vé">🎟️</span> Số lượng vé</th>
                                        <th><span role="img" aria-label="Giá">💰</span> Giá mỗi vé</th>
                                        <th><span role="img" aria-label="Ghế">💺</span> Phụ phí ghế</th>
                                        <th><span role="img" aria-label="Thuế">🧾</span> Thuế</th>
                                        <th><span role="img" aria-label="Tổng tiền">💵</span> Tổng giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Người lớn</td>
                                        <td>{adults}</td>
                                        <td>
                                            {(adults * Number(selectedFlight.price_adult)).toLocaleString('vi-VN')} VND
                                        </td>
                                        <td>
                                            {seatTypes.find((type) => type.id === selectedFlight.seat_type_id)?.additional_price
                                            ? `${Number(seatTypes.find((type) => type.id === selectedFlight.seat_type_id).additional_price).toLocaleString()} VND`
                                            : `ID: ${selectedFlight.seat_type_id}`}
                                        </td>
                                        <td>
                                            {(adults * (Number(selectedFlight.price_adult) + Number(selectedFlight.additional_price)) * Number(selectedFlight.tax)).toLocaleString('vi-VN')} VND (
                                            {(adults * Number(selectedFlight.tax) * 100).toFixed(0)}%)
                                        </td>
                                        <td>{(
                                            (Number(selectedFlight.price_adult) + Number(selectedFlight.additional_price)) * adults * (1 + Number(selectedFlight.tax))
                                        ).toLocaleString('vi-VN')} VND</td>
                                    </tr>
                                    <tr>
                                        <td>Trẻ em</td>
                                        <td>{childCount}</td>
                                        <td>
                                            {(childCount * Number(selectedFlight.price_adult)).toLocaleString('vi-VN')} VND
                                        </td>
                                        <td>
                                            {(() => {
                                                const seat = seatTypes.find((type) => type.id === selectedFlight.seat_type_id);
                                                const fee = seat?.additional_price ?? 0;
                                                return (childCount * fee).toLocaleString('vi-VN') + ' VND';
                                            })()}
                                        </td>
                                        <td>
                                            {(childCount * (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) * Number(selectedFlight.tax)).toLocaleString('vi-VN')} VND (
                                            {(childCount * Number(selectedFlight.tax) * 100).toFixed(0)}%)
                                        </td>
                                        <td>{(
                                            (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) * childCount * (1 + Number(selectedFlight.tax))
                                        ).toLocaleString('vi-VN')} VND</td>
                                    </tr>

                                    <tr>
                                        <td>Em bé</td>
                                        <td>{infants}</td>
                                        <td>
                                            {(infants * Number(selectedFlight.price_adult)).toLocaleString('vi-VN')} VND
                                        </td>
                                        <td>
                                            {(() => {
                                                const seat = seatTypes.find((type) => type.id === selectedFlight.seat_type_id);
                                                const fee = seat?.additional_price ?? 0;
                                                return (infants * fee).toLocaleString('vi-VN') + ' VND';
                                            })()}
                                        </td>
                                        <td>
                                            {(infants * (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) * Number(selectedFlight.tax)).toLocaleString('vi-VN')} VND (
                                            {(infants * Number(selectedFlight.tax) * 100).toFixed(0)}%)
                                        </td>
                                        <td>{(
                                            (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) * infants * (1 + Number(selectedFlight.tax))
                                        ).toLocaleString('vi-VN')} VND</td>
                                    </tr>

                                    <tr>
                                        <td><span role="img" aria-label="Tổng cộng">💵</span> Tổng cộng</td>
                                        <td colSpan="5" className='total-price'><strong>{(
                                            (Number(selectedFlight.price_adult) + Number(selectedFlight.additional_price)) * adults * (1 + Number(selectedFlight.tax)) +
                                            (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) * childCount * (1 + Number(selectedFlight.tax)) +
                                            (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) * infants * (1 + Number(selectedFlight.tax))
                                        ).toLocaleString('vi-VN')} VND</strong></td>
                                    </tr>

                                </tbody>
                            </table>

                            <button className="continue-btn" onClick={() => onContinue?.(selectedFlight)}>
                                <span className="btn-text">Tiếp tục</span>
                                <span className="btn-arrow">→</span>
                            </button>

                        </div>
                    
                        )}
                    </div>
                ))
            ) : (
                <p>Không tìm thấy chuyến bay nào!</p>
            )}
        </div>
    );
}

FlightResultList.propTypes = {
    flights: PropTypes.array.isRequired,
    setFlights: PropTypes.func.isRequired,
    adults: PropTypes.number.isRequired,
    childCount: PropTypes.number.isRequired,
    infants: PropTypes.number.isRequired,
    departureDate: PropTypes.string.isRequired,
    returnDate: PropTypes.string,
    tripType: PropTypes.string.isRequired,
    onContinue: PropTypes.func,
    excludedFlight: PropTypes.string,
};

export default FlightResultList;