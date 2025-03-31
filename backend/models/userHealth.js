import mongoose from 'mongoose';

const userHealthSchema = new mongoose.Schema(
{
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  target_weight: { type: Number, required: true },
  target_steps: { type: Number, required: true },
  target_sleep: { type: Number, required: true },
  target_calories: { type: Number, required: true },
  target_distance: { type: Number, required: true },
  bmi: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
},
{ collection: "user_health" }
);

const UserHealth = mongoose.model('UserHealth', userHealthSchema);

export default UserHealth;