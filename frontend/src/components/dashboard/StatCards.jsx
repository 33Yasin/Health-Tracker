import React, { useEffect, useState } from 'react';
import { FaBed, FaWalking, FaRuler, FaWeight, FaPlus, FaMinus, FaSave, FaGlassWhiskey } from 'react-icons/fa';
import { GiFireDash } from 'react-icons/gi';
import { MdMood } from 'react-icons/md';

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

const StatCard = ({ title, value, icon: Icon, onChange, unit, target, onSave, customRender }) => {
  const [inputValue, setInputValue] = useState('');
  const [localValue, setLocalValue] = useState(value);

  // Update localValue when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = async () => {
    if (!inputValue) return;
    
    const inputNum = parseFloat(inputValue);
    
    try {
      await onSave(inputNum);
      setLocalValue(inputNum); // Update local display and progress immediately
      setInputValue('');
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const getMoodProgress = (mood) => {
    const moodValues = {
      'terrible': 20,    
      'bad': 40,        
      'neutral': 60,     
      'good': 80,        
      'great': 100       
    };
    return moodValues[mood] || 60;
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      'terrible': 'bg-red-500',      
      'bad': 'bg-orange-500',        
      'neutral': 'bg-yellow-500',    
      'good': 'bg-blue-500',         
      'great': 'bg-green-500'       
    };
    return moodColors[mood] || 'bg-gray-400';
  };

  const getMoodColorHex = (mood) => {
    const moodColors = {
      'terrible': '#EF4444',      
      'bad': '#F97316',          
      'neutral': '#EAB308',      
      'good': '#3B82F6',         
      'great': '#22C55E'         
    };
    return moodColors[mood] || '#9CA3AF';
  };

  // Update progress calculation
  const getProgress = () => {
    if (title === 'Mood') {
      return getMoodProgress(localValue);
    }
    if (!localValue || !target) return 0;
    return Math.min((parseFloat(localValue) / parseFloat(target)) * 100, 100);
  };

  // Use localValue instead of value for display
  const progress = getProgress();

  const progressColor = title === 'Mood'
    ? getMoodColor(localValue)
    : progress >= 100 ? 'bg-green-500' : 'bg-indigo-600';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Icon 
            className="text-2xl" 
            style={{ 
              color: title === 'Mood' 
                ? getMoodColorHex(localValue)
                : progress >= 100 ? '#10B981' : '#4F46E5' 
            }} 
          />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {title === 'Mood' ? (localValue || 'neutral') : (localValue || '0')}
        </div>
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full mb-4">
        <div 
          className={`absolute h-2 ${
            title === 'Mood' ? getMoodColor(localValue) : progressColor
          } rounded-full transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {customRender ? (
        customRender(localValue, onSave)
      ) : (
        <div className="flex gap-2 mt-4">
          <div className="flex-1">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <FaSave />
            Save
          </button>
        </div>
      )}
    </div>
  );
};

const MoodSelector = ({ value, onChange }) => {
  const moods = [
    { value: 'terrible', emoji: '😫', label: 'Terrible' },
    { value: 'bad', emoji: '😞', label: 'Bad' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'good', emoji: '😊', label: 'Good' },
    { value: 'great', emoji: '😄', label: 'Great' }
  ];

  return (
    <div className="flex items-center justify-between w-full gap-1">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onChange(mood.value)}
          className={`flex flex-col items-center p-1 rounded-lg transition-all ${
            value === mood.value 
              ? 'bg-indigo-100 scale-105 shadow-sm' 
              : 'hover:bg-gray-100'
          }`}
          title={mood.label}
        >
          <span className="text-lg">{mood.emoji}</span>
          <span className="text-[10px] text-gray-600">{mood.label}</span>
        </button>
      ))}
    </div>
  );
};

const StatCards = ({ data, onUpdate }) => {
  const [localData, setLocalData] = useState(data);

  // Update local data when props change
  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
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
    
    try {
      await onUpdate(id, value, new Date());
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleSave = async (id, newValue) => {
    try {
      await onUpdate(id, newValue);
      // Update local state immediately after successful save
      setLocalData(prev => ({
        ...prev,
        [id]: newValue
      }));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const stats = [
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
      id: 'water_intake', 
      title: 'Water Intake', 
      icon: FaGlassWhiskey, 
      unit: 'ml', 
      target: data?.target_water || 2500 
    },
    { 
      id: 'sleep_hours', 
      title: 'Sleep', 
      icon: FaBed, 
      unit: 'hours', 
      target: data?.target_sleep || 0 
    },
    { 
      id: 'mood', 
      title: 'Mood', 
      icon: MdMood,
      customRender: (value, onSave) => (
        <MoodSelector
          value={value || 'neutral'}
          onChange={(newMood) => onSave(newMood)}
        />
      )
    }
  ];

  
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
          customRender={stat.customRender}
        />
      ))}
    </div>
  );
};

export default StatCards;
