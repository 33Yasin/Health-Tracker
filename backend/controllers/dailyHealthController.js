import DailyHealth from '../models/dailyHealth.js';

export const addDailyHealth = async (req, res) => {
  try {
    const { user_id, date, field, value } = req.body;

    // Enhanced validation
    if (!user_id || !field || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        received: req.body,
        required: ['user_id', 'field', 'value']
      });
    }

    // Ensure date is valid
    const validDate = date ? new Date(date) : new Date();
    if (isNaN(validDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
        received: date
      });
    }

    // Set day boundaries
    const dayStart = new Date(validDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(validDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Find existing record
    let dailyHealth = await DailyHealth.findOne({
      user_id,
      date: {
        $gte: dayStart,
        $lt: dayEnd
      }
    });

    if (dailyHealth) {
      // Direkt değer atama - artık birikimli toplama yok
      dailyHealth[field] = parseFloat(value);
    } else {
      // Yeni kayıt oluştur
      dailyHealth = new DailyHealth({
        user_id,
        date: validDate,
        [field]: parseFloat(value)
      });
    }

    // Ensure the field exists in the schema
    if (!dailyHealth[field] && dailyHealth[field] !== 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid field: ${field}`,
        allowedFields: Object.keys(DailyHealth.schema.paths)
      });
    }

    await dailyHealth.save();

    res.status(200).json({
      success: true,
      data: dailyHealth,
      message: 'Daily health data updated successfully'
    });
  } catch (error) {
    console.error('Daily health update error:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getDailyHealth = async (req, res) => {
  try {
    const { user_id } = req.params;
    const dailyHealth = await DailyHealth.find({ user_id })
      .sort({ date: -1 })
      .limit(30); // Last 30 days
    res.status(200).json({ success: true, data: dailyHealth });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
