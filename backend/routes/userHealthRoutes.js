import express from 'express';
import { createUserHealth, getUserHealth, checkUserHealthExists } from '../controllers/userHealthController.js';
import { addDailyHealth, getDailyHealth } from '../controllers/dailyHealthController.js';

const router = express.Router();

// creating user health info
router.post('/user-health', createUserHealth);

// getting user health info by user_id
router.get('/user-health/:user_id', getUserHealth);

// checking if user health info exists by user_id
router.get('/user-health/check/:user_id', checkUserHealthExists);

// Daily health routes
router.post('/daily-health', addDailyHealth);
router.get('/daily-health/:user_id', getDailyHealth);

export default router;
