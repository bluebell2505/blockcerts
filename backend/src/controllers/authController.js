import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { userId, password, walletId, department, yearOfPassing } = req.body;

    const existingUser = await User.findOne({ userId });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId,
      password: hashedPassword,
      walletId,
      department,
      yearOfPassing,
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.userId });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
