import axios from 'axios';

// sending user health information to the server
export const createUserHealth = async (userHealthData) => {
  try {
    // Data validation and preparation
    const requiredFields = [
      'user_id', 'birthDate', 'gender', 'height', 'weight',
      'target_weight', 'target_steps', 'target_sleep',
      'target_calories', 'target_distance'
    ];

    const missingFields = requiredFields.filter(field => !userHealthData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // BMI calculation
    if (!userHealthData.bmi && userHealthData.weight && userHealthData.height) {
      const heightInMeters = userHealthData.height / 100;
      userHealthData.bmi = (userHealthData.weight / (heightInMeters * heightInMeters)).toFixed(2);
    }

    // Remove default values section and directly send user input
    const formattedData = {
      ...userHealthData,
      target_water: parseFloat(userHealthData.target_water), // Ensure target_water is included
      // Calculate BMI
      bmi: userHealthData.bmi || ((userHealthData.weight / Math.pow(userHealthData.height / 100, 2)).toFixed(2))
    };

    const response = await axios.post('http://localhost:5000/api/user-health', formattedData);
    return response.data;
  } catch (error) {
    console.error('Create user health error details:', {
      message: error.message,
      response: error.response?.data,
      data: userHealthData 
    });
    throw new Error(error.response?.data?.message || 'Error creating user health information');
  }
};

// getting user health information from the server
export const getUserHealth = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/user-health/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching user health information: ' + error.message);
  }
};

export const checkUserHealthExists = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/user-health/check/${userId}`);
    return response.data.exists;
  } catch (error) {
    throw new Error('Error checking user health information: ' + error.message);
  }
};