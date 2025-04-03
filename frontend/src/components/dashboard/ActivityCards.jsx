import React, { useRef, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export const ActivityCard = ({ title, current, goal, color, icon: Icon, unit }) => {
  const chartRef = useRef(null);
  const chartId = `chart-${title.toLowerCase().replace(/\s+/g, '-')}`;

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // For mood, map values to percentages
  let percentage;
  if (title === 'Mood') {
    const moodValues = {
      'terrible': 20,
      'bad': 40,
      'neutral': 60,
      'good': 80,
      'great': 100
    };
    percentage = moodValues[current] || 60;
  } else {
    percentage = Math.min((current / goal) * 100, 100);
  }
  
  const chartData = {
    datasets: [{
      data: [percentage, 100 - percentage],
      backgroundColor: [color, '#f3f4f6'],
      borderWidth: 0,
      circumference: 360,
      rotation: 0
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

  const displayValue = title === 'Mood' 
    ? current.charAt(0).toUpperCase() + current.slice(1)
    : current;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between md:flex-col md:items-start gap-4">
        <div className="flex items-center gap-2">
          <Icon className="text-2xl" style={{ color }} />
          <h3 className="text-lg font-medium">{title}</h3>
        </div>

        {/* Chart and Values Container */}
        <div className="flex items-center md:flex-col md:w-full gap-4">
          <div className="relative h-20 w-20 md:h-48 md:w-full">
            <Doughnut 
              ref={chartRef}
              data={chartData} 
              options={options}
              id={chartId}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl md:text-3xl font-bold">{current}</span>
              <span className="text-xs md:text-sm text-gray-500">{unit}</span>
            </div>
          </div>
          
          {/* Goal text - hidden on mobile */}
          <div className="hidden md:block md:mt-4 text-center">
            <span className="text-sm text-gray-500">Goal: {goal} {unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;