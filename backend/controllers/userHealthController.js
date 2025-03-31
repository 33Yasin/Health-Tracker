import UserHealth from '../models/userHealth.js';

export const createUserHealth = async (req, res) => {
  try {
    const { user_id, birthDate, gender, height, weight, target_weight, bmi } = req.body;

    // Veri doğrulama
    if (!user_id || !birthDate || !gender || !height || !weight || !target_weight || !bmi) {
      return res.status(400).json({ 
        message: "Missing required fields",
        received: { user_id, birthDate, gender, height, weight, target_weight, bmi }
      });
    }

    // Mevcut kayıt kontrolü
    const existingHealth = await UserHealth.findOne({ user_id });
    if (existingHealth) {
      // Güncelleme yap
      Object.assign(existingHealth, {
        birthDate: new Date(birthDate),
        gender,
        height,
        weight,
        target_weight,
        bmi
      });
      await existingHealth.save();
      return res.status(200).json({ 
        message: "Health information updated successfully", 
        data: existingHealth 
      });
    }

    // Yeni kayıt oluştur
    const userHealth = new UserHealth({
      user_id,
      birthDate: new Date(birthDate),
      gender,
      height,
      weight,
      target_weight,
      bmi
    });

    await userHealth.save();
    return res.status(201).json({ 
      message: "Health information saved successfully", 
      data: userHealth 
    });

  } catch (error) {
    console.error('Create user health error:', error);
    return res.status(500).json({ 
      message: "Error saving health information", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// get user health record by user_id
export const getUserHealth = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userHealth = await UserHealth.findOne({ user_id });

    if (!userHealth) {
      return res.status(404).json({ message: "Health information not found" });
    }

    return res.status(200).json({ data: userHealth });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving health information", error: error.message });
  }
};

export const checkUserHealthExists = async (req, res) => {
  try {
    const { user_id } = req.params;
    const userHealth = await UserHealth.findOne({ user_id });
    return res.status(200).json({ 
      exists: !!userHealth 
    });
  } catch (error) {
    return res.status(500).json({ message: "Error checking health information", error: error.message });
  }
};
