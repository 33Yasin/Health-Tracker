import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import userHealthRoutes from './routes/userHealthRoutes.js';

dotenv.config();

const app = express();

// MongoDB connection
connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Health Tracker API is running! 🚀');
});

// user routes
app.use('/api/users', userRoutes);
app.use('/api', userHealthRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));