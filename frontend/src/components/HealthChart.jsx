import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const HealthChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Sleep Hours',
        data: data.map(d => d.sleep_hours),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Steps (k)',
        data: data.map(d => d.steps / 1000),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Weight (kg)',
        data: data.map(d => d.weight),
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Health Trends</h2>
      <div className="h-96">
        <Line data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default HealthChart;
