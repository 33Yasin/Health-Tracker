import mongoose from 'mongoose';

const dailyHealthSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  sleep_hours: { type: Number, default: 0 },
  steps: { type: Number, default: 0 },
  distance_km: { type: Number, default: 0 },
  calories_burned: { type: Number, default: 0 },
  weight: { type: Number },
  height: { type: Number },
  bmi: { type: Number },
  water_intake: { type: Number, default: 0 }, // in ml
  mood: { type: String, enum: ['great', 'good', 'neutral', 'bad', 'terrible'], default: 'neutral' }
});

const DailyHealth = mongoose.model('DailyHealth', dailyHealthSchema);
export default DailyHealth;
