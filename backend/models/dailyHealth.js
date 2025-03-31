import mongoose from 'mongoose';

const dailyHealthSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  sleep_hours: { type: Number, required: true },
  steps: { type: Number, required: true },
  distance_km: { type: Number, required: true },
  calories_burned: { type: Number, required: true },
  weight: { type: Number, required: true },
  bmi: { type: Number, required: true },
});

const DailyHealth = mongoose.model('DailyHealth', dailyHealthSchema);
export default DailyHealth;
