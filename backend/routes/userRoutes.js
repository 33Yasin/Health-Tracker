import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// user registiration
router.post('/register', registerUser);

// user login
router.post('/login', loginUser);

export default router;