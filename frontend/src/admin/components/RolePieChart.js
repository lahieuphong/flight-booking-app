import React from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const RolePieChart = ({ roleData }) => {
  const data = {
    labels: Object.keys(roleData),
    datasets: [
      {
        data: Object.values(roleData),
        backgroundColor: ['#4caf50', '#2196f3'],
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="chart-container">
      <h4>User Roles Distribution</h4>
      <Pie data={data} />
    </div>
  );
};

RolePieChart.propTypes = {
  roleData: PropTypes.objectOf(PropTypes.number).isRequired
};

export default RolePieChart;