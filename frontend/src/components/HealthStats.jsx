import React from 'react';

const HealthStats = ({ data }) => {
  const latestData = data[0] || {};

  const stats = [
    { name: 'Sleep', value: `${latestData.sleep_hours || 0} hours`, color: 'bg-blue-100' },
    { name: 'Steps', value: `${latestData.steps || 0}`, color: 'bg-green-100' },
    { name: 'Distance', value: `${latestData.distance_km || 0} km`, color: 'bg-yellow-100' },
    { name: 'Calories', value: `${latestData.calories_burned || 0} kcal`, color: 'bg-red-100' },
    { name: 'Weight', value: `${latestData.weight || 0} kg`, color: 'bg-purple-100' },
    { name: 'BMI', value: `${latestData.bmi || 0}`, color: 'bg-indigo-100' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className={`${stat.color} p-6 rounded-lg shadow-sm`}>
          <h3 className="text-lg font-medium text-gray-900">{stat.name}</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-700">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default HealthStats;
