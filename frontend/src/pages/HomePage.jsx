import React, { useState, useEffect } from 'react';
import { FaBed, FaWalking, FaFireAlt, FaWeight } from 'react-icons/fa';
import NavBar from '../components/NavBar';
import StatCards from '../components/dashboard/StatCards';
import ActivityCard from '../components/dashboard/ActivityCards';
import DatePicker from '../components/dashboard/DatePicker';
import { getDailyHealth, addDailyHealth } from '../services/dailyHealthService';
import { getUserHealth } from '../services/userHealthService';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [healthData, setHealthData] = useState([]);
  const [userHealthInfo, setUserHealthInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHealthData();
    loadUserHealthInfo();
  }, [selectedDate]);

  const loadUserHealthInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        const response = await getUserHealth(userId);
        setUserHealthInfo(response.data);
      }
    } catch (error) {
      console.error('Error loading user health info:', error);
    }
  };

  const loadHealthData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        const response = await getDailyHealth(userId);
        setHealthData(response.data);
      }
    } catch (error) {
      toast.error('Error loading health data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatUpdate = async (statId, value) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const userId = JSON.parse(atob(token.split('.')[1])).id;
      
      const updateData = {
        user_id: userId,
        date: selectedDate,
        field: statId, // Specific field being updated
        value: value, // New value
        height: userHealthInfo?.height // Include height for BMI calculation
      };

      await addDailyHealth(updateData);
      await loadHealthData(); // Reload data
      toast.success('Data updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Error updating data');
    }
  };

  const activityCards = [
    {
      title: 'Steps',
      current: healthData[0]?.steps || 0,
      goal: userHealthInfo?.target_steps || 10000,
      color: '#FF9500',
      icon: FaWalking,
      unit: 'steps'
    },
    {
      title: 'Sleep',
      current: healthData[0]?.sleep_hours || 0,
      goal: userHealthInfo?.target_sleep || 8,
      color: '#63B3ED',
      icon: FaBed,
      unit: 'hours'
    },
    {
      title: 'Calories',
      current: healthData[0]?.calories_burned || 0,
      goal: userHealthInfo?.target_calories || 2500,
      color: '#F56565',
      icon: FaFireAlt,
      unit: 'kcal'
    },
    {
      title: 'Weight',
      current: healthData[0]?.weight || userHealthInfo?.weight || 0,
      goal: userHealthInfo?.weight || 0,
      target: userHealthInfo?.target_weight || 0,
      color: '#9F7AEA',
      icon: FaWeight,
      unit: 'kg'
    }
  ];

  // Debug için verileri konsola yazdır
  useEffect(() => {
    console.log('UserHealthInfo:', userHealthInfo);
    console.log('HealthData:', healthData);
    console.log('ActivityCards:', activityCards);
  }, [userHealthInfo, healthData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Health Dashboard</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Activity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activityCards.map((card, index) => (
                <ActivityCard 
                  key={`${card.title}-${index}`}  // Unique key
                  {...card} 
                />
              ))}
            </div>

            {/* Stats and Date Picker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <StatCards
                  data={{
                    ...healthData[0],
                    ...userHealthInfo, // Hedef değerleri ekle
                  }}
                  onUpdate={handleStatUpdate}
                />
              </div>
              <div>
                <DatePicker
                  selectedDate={selectedDate}
                  onSelect={setSelectedDate}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;