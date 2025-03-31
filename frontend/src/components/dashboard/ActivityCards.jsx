import React, { useRef, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export const ActivityCard = ({ title, current, goal, color, icon: Icon, unit, target }) => {
  const chartRef = useRef(null);
  const chartId = `chart-${title.toLowerCase().replace(/\s+/g, '-')}`;

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  let percentage;
  if (title === 'Weight' && target) {
    // For weight, calculate percentage based on progress to target
    const totalChange = Math.abs(target - goal);
    const currentChange = Math.abs(current - goal);
    percentage = Math.min(((totalChange - currentChange) / totalChange) * 100, 100);
  } else {
    percentage = Math.min((current / goal) * 100, 100);
  }
  
  const chartData = {
    datasets: [{
      data: [percentage, 100 - percentage],
      backgroundColor: [color, '#f3f4f6'],
      borderWidth: 0,
      circumference: 280,
      rotation: 140,
    }]
  };

  const options = {
    cutout: '80%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      id: chartId 
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="text-2xl" style={{ color }} />
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      </div>
      <div className="relative h-48">
        <Doughnut 
          ref={chartRef}
          data={chartData} 
          options={options}
          id={chartId}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{current}</span>
          <span className="text-gray-500">{unit}</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        {title === 'Weight' && target ? (
          <span className="text-gray-500">Target: {target} {unit}</span>
        ) : (
          <span className="text-gray-500">Goal: {goal} {unit}</span>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
