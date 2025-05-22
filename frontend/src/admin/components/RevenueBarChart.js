import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const RevenueBarChart = ({ revenueData }) => {
  const data = {
    labels: Object.keys(revenueData),
    datasets: [
      {
        label: 'Doanh thu theo hãng bay (VND)',
        data: Object.values(revenueData),
        backgroundColor: '#f57c00',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="chart-container">
      <h4>Revenue by Airline</h4>
      <Bar data={data} options={{
        scales: {
          y: {
            ticks: {
              callback: (value) => `${value.toLocaleString('vi-VN')} VND`
            }
          }
        }
      }} />
    </div>
  );
};

RevenueBarChart.propTypes = {
  revenueData: PropTypes.objectOf(PropTypes.number).isRequired
};

export default RevenueBarChart;