import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Dashboard.css';
import SummaryCards from './components/SummaryCards';
import RolePieChart from './components/RolePieChart';
import RevenueBarChart from './components/RevenueBarChart';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [approvedRows, setApprovedRows] = useState(new Set());
  const [hiddenRows, setHiddenRows] = useState(new Set());

  useEffect(() => {
    axios.get('http://localhost:5001/api/admin/dashboard/with-flight-info')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredData = data.filter(item => {
    const passengerName = `${item.first_name} ${item.last_name}`.toLowerCase();
    const airline = item.airline_name.toLowerCase();
    const flightNum = item.flight_number.toLowerCase();
    const term = searchTerm.toLowerCase();

    return (
      passengerName.includes(term) ||
      airline.includes(term) ||
      flightNum.includes(term)
    );
  });

  const totalPassengers = filteredData.length;
  const totalRevenue = filteredData.reduce((sum, item) => sum + Number(item.total_price), 0);
  const totalFlights = new Set(filteredData.map(item => item.flight_number)).size;

  const userRoles = filteredData.reduce((acc, item) => {
    acc[item.role] = (acc[item.role] || 0) + 1;
    return acc;
  }, {});

  const revenueByAirline = filteredData.reduce((acc, item) => {
    acc[item.airline_name] = (acc[item.airline_name] || 0) + Number(item.total_price);
    return acc;
  }, {});

  const handleApprove = (idx) => {
    setApprovedRows(prev => new Set(prev).add(idx));
  };

  const handleReject = (idx) => {
    setHiddenRows(prev => new Set(prev).add(idx));
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Passenger Flight Dashboard</h2>

      <SummaryCards
        totalPassengers={totalPassengers}
        totalRevenue={totalRevenue}
        totalFlights={totalFlights}
        userRoles={userRoles}
      />

      <div className="chart-section">
        <RolePieChart roleData={userRoles} />
        <RevenueBarChart revenueData={revenueByAirline} />
      </div>

      <input
        type="text"
        placeholder="Search passenger, airline, or flight number..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="admin-search-input"
      />

      <h3 className="dashboard-subtitle">Flight Details</h3>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Passenger</th>
            <th>Username</th>
            <th>Role</th>
            <th>Airline</th>
            <th>Flight Number</th>
            <th>Aircraft Type</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, idx) => {
            if (hiddenRows.has(idx)) return null;

            return (
              <tr key={idx}>
                <td>{row.first_name} {row.last_name}</td>
                <td>{row.username}</td>
                <td>{row.role}</td>
                <td>{row.airline_name}</td>
                <td>{row.flight_number}</td>
                <td>{row.aircraft_type_name}</td>
                <td>{row.departure_airport_name} ({row.departure_airport_code}) - {row.departure_time}</td>
                <td>{row.arrival_airport_name} ({row.arrival_airport_code}) - {row.arrival_time}</td>
                <td>{Number(row.total_price).toLocaleString('vi-VN')} VND</td>
                <td>
                  {approvedRows.has(idx) ? (
                    <span className="approved-badge">✅ Đã phê duyệt</span>
                  ) : (
                    <>
                      <button className="approve-btn" onClick={() => handleApprove(idx)}>Phê duyệt</button>
                      <button className="reject-btn" onClick={() => handleReject(idx)}>Từ chối</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
