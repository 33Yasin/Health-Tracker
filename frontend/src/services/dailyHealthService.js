import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const addDailyHealth = async (data) => {
  try {
    // Data validation and preparation
    const healthData = {
      user_id: data.user_id,
      date: new Date(data.date).toISOString(),
      field: data.field,
      value: data.field === 'mood' ? data.value : parseFloat(data.value) || 0,
      height: parseFloat(data.height) || 0 
    };

    // Add BMI calculation if weight is being updated
    if (data.field === 'weight' && healthData.height) {
      const heightInMeters = healthData.height / 100;
      healthData.bmi = (healthData.value / (heightInMeters * heightInMeters)).toFixed(2);
    }

    const response = await axios.post(`${BASE_URL}/daily-health`, healthData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update health data');
    }
    
    return response.data;
  } catch (error) {
    console.error('Daily health update error details:', {
      sent: data,
      error: error.response?.data || error.message
    });
    throw error;
  }
};

export const getDailyHealth = async (userId, startDate, endDate) => {
  try {
    const response = await axios.get(`${BASE_URL}/daily-health/${userId}`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    return {
      ...response.data,
      data: response.data.data.map(item => ({
        ...item,
        date: new Date(item.date)
      }))
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching daily health data');
  }
};