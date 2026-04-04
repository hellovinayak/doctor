const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Nurse = require('../models/Nurse');
const Staff = require('../models/Staff');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

// REGISTER - also creates entry in role-specific collection
router.post('/register', async (req, res) => {
  const { name, email, password, role, specialization, phone } = req.body;
  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'An account with this email already exists' });

    const assignedRole = role || 'staff';

    const user = new User({ name, email, password, role: assignedRole });
    await user.save();

    // Auto-create profile in the role-specific collection
    try {
      if (assignedRole === 'doctor') {
        const exists = await Doctor.findOne({ email });
        if (!exists) await Doctor.create({ name, email, phone: phone || '', specialization: specialization || 'General', availability: true });
      } else if (assignedRole === 'nurse') {
        const exists = await Nurse.findOne({ email });
        if (!exists) await Nurse.create({ name, email, phone: phone || '', shift: 'Morning', availability: true });
      } else if (assignedRole === 'staff') {
        const exists = await Staff.findOne({ email });
        if (!exists) await Staff.create({ name, email, phone: phone || '', position: 'Assistant', availability: true });
      }
    } catch (roleErr) {
      console.warn('Could not create role-specific profile:', roleErr.message);
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    if (password !== user.password) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL USERS (admin overview)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
