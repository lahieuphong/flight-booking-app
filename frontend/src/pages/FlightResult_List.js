import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/FlightResult_List.css';

const FlightResult_List = ({
    flights,
    setFlights,
    adults,
    childCount,
    infants,
    departureDate,
    returnDate,
    tripType,
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

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString('vi-VN') : '';

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
                setSelectedFlight({
                    ...selectedFlight,
                    seat_type_id: newSeatTypeId,
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
                                <div className="flight-details">
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
                                <h2>Chi tiết chuyến bay</h2>
                                <div className="flight-card">
                                    <img
                                        src={`/images/${selectedFlight.airline_logo}`}
                                        alt={selectedFlight.airline_name}
                                        className="airline-logo"
                                        onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                                    />
                                    <h3>{selectedFlight.airline_name} ({selectedFlight.flight_number})</h3>
                                    <p>✈️ {selectedFlight.departure_airport_name || 'Chưa có thông tin'} ({selectedFlight.departure_airport_code || 'XX'}) → {selectedFlight.arrival_airport_name || 'Chưa có thông tin'} ({selectedFlight.arrival_airport_code || 'XX'})</p>
                                    <p>🕒 {selectedFlight.departure_time} → {selectedFlight.arrival_time} ({selectedFlight.duration})</p>
                                    <p>💺 Loại ghế: {
                                        seatTypes.find((type) => type.id === selectedFlight.seat_type_id)?.remaining_seats || `ID: ${selectedFlight.seat_type_id}`
                                    }</p>

                                    <p>💵 Phụ phí: {
                                        seatTypes.find((type) => type.id === selectedFlight.seat_type_id)?.additional_price
                                            ? `${Number(seatTypes.find((type) => type.id === selectedFlight.seat_type_id).additional_price).toLocaleString()} VND`
                                            : `ID: ${selectedFlight.seat_type_id}`
                                    }</p>

                                    <p>💰 Giá người lớn: {Number(selectedFlight.price_adult).toLocaleString()} VND</p>
                                    <p>👶 Giá trẻ em: {Number(selectedFlight.price_child).toLocaleString()} VND</p>
                                    <p>🍼 Giá em bé: {Number(selectedFlight.price_infant).toLocaleString()} VND</p>
                                    <p>🧾 Thuế: {(Number(selectedFlight.tax) * 100).toFixed(0)}%</p>
                                    <p>👤 Người lớn: {adults} | 🧒 Trẻ em: {childCount} | 👶 Em bé: {infants}</p>

                                    <p>📅 Ngày đi: {formatDate(departureDate)}</p>
                                    {tripType === 'round-trip' && <p>📅 Ngày về: {formatDate(returnDate)}</p>}

                                    {selectedFlight.price_adult && (
                                        <p>🧑 Tổng tiền người lớn: {(
                                            (Number(selectedFlight.price_adult) + Number(selectedFlight.additional_price)) * adults +
                                            (Number(selectedFlight.price_adult) + Number(selectedFlight.additional_price)) * adults * Number(selectedFlight.tax)
                                        ).toLocaleString('vi-VN')} VND</p>
                                    )}

                                    {selectedFlight.price_child && (
                                        <p>🧒 Tổng tiền trẻ em: {(
                                            (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) * childCount +
                                            (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) * childCount * Number(selectedFlight.tax)
                                        ).toLocaleString('vi-VN')} VND</p>
                                    )}

                                    {selectedFlight.price_infant && (
                                        <p>🍼 Tổng tiền em bé: {(
                                            (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) * infants +
                                            (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) * infants * Number(selectedFlight.tax)
                                        ).toLocaleString('vi-VN')} VND</p>
                                    )}

                                    <p>💵 <strong>Tổng cộng:</strong> {(
                                        (Number(selectedFlight.price_adult) + Number(selectedFlight.additional_price)) * adults * (1 + Number(selectedFlight.tax)) +
                                        (Number(selectedFlight.price_child) + Number(selectedFlight.additional_price)) * childCount * (1 + Number(selectedFlight.tax)) +
                                        (Number(selectedFlight.price_infant) + Number(selectedFlight.additional_price)) * infants * (1 + Number(selectedFlight.tax))
                                    ).toLocaleString('vi-VN')} VND</p>

                                    <button
                                        className="continue-btn"
                                        onClick={() => onContinue?.(selectedFlight)}
                                    >
                                        Tiếp tục
                                    </button>
                                </div>
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

FlightResult_List.propTypes = {
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

export default FlightResult_List;