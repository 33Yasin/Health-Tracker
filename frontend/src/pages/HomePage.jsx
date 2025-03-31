import React, { useState, useEffect } from 'react';
import { FaBed, FaWalking, FaFireAlt, FaGlassWhiskey } from 'react-icons/fa';
import { MdMood } from 'react-icons/md';
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
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const response = await getDailyHealth(userId, startOfDay, endOfDay);
        const dailyData = response.data?.[0] || {};
        
        const healthDataWithDefaults = {
          ...userHealthInfo, 
          ...dailyData, 
        };

        setHealthData([healthDataWithDefaults]);
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
        field: statId,
        value: value,
        height: healthData[0]?.height || userHealthInfo?.height
      };

      await addDailyHealth(updateData);
      await loadHealthData(); // Reload latest data
      toast.success('Data updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Error updating data');
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      title: 'Distance',
      current: healthData[0]?.distance_km || 0,
      goal: userHealthInfo?.target_distance || 5,
      color: '#10B981',
      icon: FaWalking,
      unit: 'km'
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
      title: 'Water',
      current: healthData[0]?.water_intake || 0,
      goal: userHealthInfo?.target_water || 2500,
      color: '#3B82F6',
      icon: FaGlassWhiskey,
      unit: 'ml'
    },
    {
      title: 'Sleep',
      current: healthData[0]?.sleep_hours || 0,
      goal: userHealthInfo?.target_sleep || 8,
      color: '#63B3ED',
      icon: FaBed,
      unit: 'hours'
    }
  ];

  
  useEffect(() => {
    console.log('UserHealthInfo:', userHealthInfo);
    console.log('HealthData:', healthData);
    console.log('ActivityCards:', activityCards);
  }, [userHealthInfo, healthData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-8">
          {/* Timeline Date Picker */}
          <DatePicker
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />

          {/* Dashboard Title and Current Date */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
            <span className="text-lg text-gray-600">{formatDate(selectedDate)}</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Activity Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {activityCards.map((card, index) => (
                  <ActivityCard 
                    key={`${card.title}-${index}`}
                    {...card} 
                  />
                ))}
              </div>

              {/* Stats */}
              <div>
                <StatCards
                  data={{
                    ...healthData[0],
                    ...userHealthInfo,
                  }}
                  onUpdate={handleStatUpdate}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;