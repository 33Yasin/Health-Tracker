import axios from 'axios';

// sending user health information to the server
export const createUserHealth = async (userHealthData) => {
  try {
    // Veri doğrulama
    const requiredFields = [
      'user_id', 'birthDate', 'gender', 'height', 'weight',
      'target_weight', 'target_steps', 'target_sleep',
      'target_calories', 'target_distance'
    ];

    const missingFields = requiredFields.filter(field => !userHealthData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // BMI hesaplama
    if (!userHealthData.bmi && userHealthData.weight && userHealthData.height) {
      const heightInMeters = userHealthData.height / 100;
      userHealthData.bmi = (userHealthData.weight / (heightInMeters * heightInMeters)).toFixed(2);
    }

    // Default hedef değerleri
    const defaultTargets = {
      target_steps: '10000',
      target_sleep: '8',
      target_calories: '2500',
      target_distance: '5'
    };

    // Eksik hedef değerleri için varsayılanları kullan
    Object.keys(defaultTargets).forEach(key => {
      if (!userHealthData[key]) {
        userHealthData[key] = defaultTargets[key];
      }
    });

    const response = await axios.post('http://localhost:5000/api/user-health', userHealthData);
    return response.data;
  } catch (error) {
    console.error('Create user health error details:', {
      message: error.message,
      response: error.response?.data,
      data: userHealthData // Debug için gönderilen veriyi logla
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
