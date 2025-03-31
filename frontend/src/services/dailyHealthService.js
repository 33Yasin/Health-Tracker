import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const addDailyHealth = async (data) => {
  try {
    // Tarihi ISO formatına çevir
    if (data.date) {
      data.date = new Date(data.date).toISOString();
    }
    
    const response = await axios.post(`${BASE_URL}/daily-health`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error adding daily health data');
  }
};

export const getDailyHealth = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/daily-health/${userId}`);
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
