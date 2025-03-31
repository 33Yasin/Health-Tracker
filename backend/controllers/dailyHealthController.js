import DailyHealth from '../models/dailyHealth.js';

export const addDailyHealth = async (req, res) => {
  try {
    const { user_id, date } = req.body;

    // Aynı gün için kayıt var mı kontrol et
    let dailyHealth = await DailyHealth.findOne({
      user_id,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      }
    });

    if (dailyHealth) {
      // Mevcut kaydı güncelle
      Object.assign(dailyHealth, req.body);
      await dailyHealth.save();
    } else {
      // Yeni kayıt oluştur
      dailyHealth = new DailyHealth(req.body);
      await dailyHealth.save();
    }

    res.status(201).json({ success: true, data: dailyHealth });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
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
