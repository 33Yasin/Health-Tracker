import React, { useEffect, useState } from 'react';
import { FaBed, FaWalking, FaRuler, FaWeight } from 'react-icons/fa';
import { GiFireDash } from 'react-icons/gi';

const BMIIndicator = ({ bmi }) => {
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'bg-blue-500', width: '25%' };
    if (bmi < 25) return { text: 'Normal', color: 'bg-green-500', width: '50%' };
    if (bmi < 30) return { text: 'Overweight', color: 'bg-yellow-500', width: '75%' };
    return { text: 'Obese', color: 'bg-red-500', width: '100%' };
  };

  const category = getBMICategory(bmi);

  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${category.color} transition-all duration-500`}
          style={{ width: category.width }}
        ></div>
      </div>
      <p className="text-sm mt-1">{category.text}</p>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, onChange, unit }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <Icon className="text-indigo-600 text-xl" />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 p-2 border rounded-md text-right"
        step="0.01"
      />
    </div>
    <p className="text-sm text-gray-500">{unit}</p>
  </div>
);

const StatCards = ({ data, onUpdate }) => {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const handleChange = async (id, value) => {
    const newData = { ...localData, [id]: value };
    if (id === 'weight' || id === 'height') {
      const bmi = calculateBMI(
        id === 'weight' ? value : localData.weight,
        id === 'height' ? value : localData.height
      );
      newData.bmi = bmi;
    }
    setLocalData(newData);
    
    // Her değişiklikte veritabanına kaydet
    try {
      await onUpdate(id, value, new Date());
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const stats = [
    { id: 'sleep_hours', title: 'Sleep', icon: FaBed, unit: 'hours' },
    { id: 'steps', title: 'Steps', icon: FaWalking, unit: 'steps' },
    { id: 'distance_km', title: 'Distance', icon: FaWalking, unit: 'km' },
    { id: 'calories_burned', title: 'Calories', icon: GiFireDash, unit: 'kcal' },
    { id: 'weight', title: 'Weight', icon: FaWeight, unit: 'kg' },
    { id: 'height', title: 'Height', icon: FaRuler, unit: 'cm' },
  ];

  const bmi = calculateBMI(localData?.weight, localData?.height);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map(stat => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={localData?.[stat.id] || ''}
          icon={stat.icon}
          unit={stat.unit}
          onChange={(value) => handleChange(stat.id, value)}
        />
      ))}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <FaWeight className="text-indigo-600 text-xl" />
          <h3 className="text-lg font-medium text-gray-900">BMI</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{localData?.bmi || '0'}</p>
        <BMIIndicator bmi={parseFloat(localData?.bmi) || 0} />
      </div>
    </div>
  );
};

export default StatCards;
