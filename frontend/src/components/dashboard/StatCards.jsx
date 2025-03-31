import React, { useEffect, useState } from 'react';
import { FaBed, FaWalking, FaRuler, FaWeight, FaPlus, FaMinus, FaSave } from 'react-icons/fa';
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

const StatCard = ({ title, value, icon: Icon, onChange, unit, target, onSave }) => {
  const [inputValue, setInputValue] = useState('');
  const [isAddMode, setIsAddMode] = useState(true);

  const handleToggleMode = () => {
    setIsAddMode(!isAddMode);
    setInputValue('');
  };

  const handleSave = async () => {
    if (!inputValue) return;
    
    const inputNum = parseFloat(inputValue);
    const currentValue = parseFloat(value) || 0;
    
    // Hesapla ama direkt gönder
    const newValue = isAddMode ? 
      currentValue + inputNum : 
      Math.max(0, currentValue - inputNum);
    
    await onSave(newValue);
    setInputValue('');
  };

  const progress = (value / target) * 100;
  const progressColor = progress >= 100 ? 'bg-green-500' : 'bg-indigo-600';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Icon className="text-2xl" style={{ color: progress >= 100 ? '#10B981' : '#4F46E5' }} />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="text-2xl font-bold text-gray-900">{value || '0'}</div>
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full mb-4">
        <div 
          className={`absolute h-2 ${progressColor} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <span>{unit}</span>
        <span>Goal: {target} {unit}</span>
      </div>

      <div className="flex gap-2 mt-4">
        <div className="flex-1 relative">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`${isAddMode ? 'Add' : 'Subtract'} value`}
            className="w-full p-2 border rounded-lg pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleToggleMode}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
          >
            {isAddMode ? <FaPlus /> : <FaMinus />}
          </button>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaSave />
          Save
        </button>
      </div>
    </div>
  );
};

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

  // Update BMI whenever weight or height changes
  useEffect(() => {
    if (localData?.weight && localData?.height) {
      const newBmi = calculateBMI(localData.weight, localData.height);
      setLocalData(prev => ({
        ...prev,
        bmi: newBmi
      }));
    }
  }, [localData?.weight, localData?.height]);

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

  const handleSave = async (id, newValue) => {
    try {
      await onUpdate(id, newValue);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const stats = [
    { 
      id: 'sleep_hours', 
      title: 'Sleep', 
      icon: FaBed, 
      unit: 'hours', 
      target: data?.target_sleep || 0 
    },
    { 
      id: 'steps', 
      title: 'Steps', 
      icon: FaWalking, 
      unit: 'steps', 
      target: data?.target_steps || 0 
    },
    { 
      id: 'distance_km', 
      title: 'Distance', 
      icon: FaWalking, 
      unit: 'km', 
      target: data?.target_distance || 0 
    },
    { 
      id: 'calories_burned', 
      title: 'Calories', 
      icon: GiFireDash, 
      unit: 'kcal', 
      target: data?.target_calories || 0 
    },
    { 
      id: 'weight', 
      title: 'Weight', 
      icon: FaWeight, 
      unit: 'kg', 
      target: data?.target_weight || 0 
    },
    { 
      id: 'height', 
      title: 'Height', 
      icon: FaRuler, 
      unit: 'cm',
      target: data?.height || 0 // Height için hedef değeri mevcut boy olarak kullan
    }
  ];

  // Debug için verileri konsola yazdır
  useEffect(() => {
    console.log('StatCards data:', data);
    console.log('Local data:', localData);
  }, [data, localData]);

  const bmi = calculateBMI(localData?.weight, localData?.height);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map(stat => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={localData?.[stat.id] || ''}
          icon={stat.icon}
          unit={stat.unit}
          target={stat.target}
          onSave={(newValue) => handleSave(stat.id, newValue)}
        />
      ))}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <FaWeight className="text-indigo-600 text-xl" />
          <h3 className="text-lg font-medium text-gray-900">BMI</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{localData?.bmi || '0'}</p>
        <BMIIndicator bmi={parseFloat(localData?.bmi || 0)} />
      </div>
    </div>
  );
};

export default StatCards;
