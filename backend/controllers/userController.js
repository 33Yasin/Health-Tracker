import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// user registiration
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// user login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token,
      userName: user.name // Kullanıcı adını response'a ekle
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
