import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import Select from '../ui/Select';

const WeeklyChart = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState('steps');
  const chartRef = useRef(null);

  const metrics = [
    { value: 'steps', label: 'Steps' },
    { value: 'calories_burned', label: 'Calories' },
    { value: 'sleep_hours', label: 'Sleep' },
    { value: 'distance_km', label: 'Distance' }
  ];

  // get last 7 days of data
  const last7DaysData = [...(data || [])]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7);

  const chartData = {
    labels: last7DaysData.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [{
      label: metrics.find(m => m.value === selectedMetric)?.label,
      data: last7DaysData.map(d => d[selectedMetric] || 0),
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.1,
      fill: true
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    animation: {
      duration: 750
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Weekly Progress</h3>
        <Select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          options={metrics}
        />
      </div>
      <div className="h-80">
        <Line
          ref={chartRef}
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default WeeklyChart;