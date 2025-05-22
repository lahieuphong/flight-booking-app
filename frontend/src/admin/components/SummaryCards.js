import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  summaryCards: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  card: {
    flex: '1',
    minWidth: '200px',
    background: '#e3f2fd',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '16px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  }
};

const SummaryCards = ({ totalPassengers, totalRevenue, totalFlights, userRoles }) => {
  return (
    <div style={styles.summaryCards}>
      <div style={styles.card}>
        🧍‍♂️ Passengers: <strong>{totalPassengers}</strong>
      </div>
      <div style={styles.card}>
        🛫 Flights: <strong>{totalFlights}</strong>
      </div>
      <div style={styles.card}>
        💰 Revenue: <strong>{totalRevenue.toLocaleString('vi-VN')} VND</strong>
      </div>
      <div style={styles.card}>
        👤 Users: <strong>{userRoles.admin || 0} admin / {userRoles.user || 0} user</strong>
      </div>
    </div>
  );
};

SummaryCards.propTypes = {
  totalPassengers: PropTypes.number.isRequired,
  totalRevenue: PropTypes.number.isRequired,
  totalFlights: PropTypes.number.isRequired,
  userRoles: PropTypes.shape({
    admin: PropTypes.number,
    user: PropTypes.number
  }).isRequired
};

export default SummaryCards;