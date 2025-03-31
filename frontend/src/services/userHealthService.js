import axios from 'axios';

// sending user health information to the server
export const createUserHealth = async (userHealthData) => {
  try {
    // Veri doğrulama
    if (!userHealthData.user_id || !userHealthData.birthDate || 
        !userHealthData.gender || !userHealthData.height || 
        !userHealthData.weight || !userHealthData.target_weight) {
      throw new Error('Missing required fields');
    }

    // Calculate BMI if not provided
    if (!userHealthData.bmi && userHealthData.weight && userHealthData.height) {
      const heightInMeters = userHealthData.height / 100;
      userHealthData.bmi = (userHealthData.weight / (heightInMeters * heightInMeters)).toFixed(2);
    }

    // Request gönderme
    console.log('Sending health data:', userHealthData); // Debug için
    const response = await axios.post('http://localhost:5000/api/user-health', userHealthData);
    return response.data;
  } catch (error) {
    console.error('Create user health error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
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
