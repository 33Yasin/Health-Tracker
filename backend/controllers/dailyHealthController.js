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
      // Special handling for mood field
      if (field === 'mood') {
        dailyHealth[field] = value;
      } else {
        // For numeric fields like water_intake and others
        dailyHealth[field] = parseFloat(value);
      }
    } else {
      dailyHealth = new DailyHealth({
        user_id,
        date: validDate,
        [field]: field === 'mood' ? value : parseFloat(value)
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
    const { startDate, endDate } = req.query;

    const query = { user_id };
    
    // Eğer tarih parametreleri varsa, tarihe göre filtrele
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const dailyHealth = await DailyHealth.find(query)
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: dailyHealth });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};