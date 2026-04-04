const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// A simple utility to get today's date string
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// GET the QR code token for today (Admin generates this)
router.get('/qr', (req, res) => {
  const dateStr = getTodayDateString();
  const token = `apexcare-attendance-${dateStr}`;
  res.json({ token, date: dateStr });
});

// GET all attendance records (Admin views this)
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to scan the QR and mark attendance
router.post('/scan', async (req, res) => {
  try {
    const { token, userId, name, role } = req.body;
    const dateStr = getTodayDateString();
    const expectedToken = `apexcare-attendance-${dateStr}`;

    if (token !== expectedToken) {
      return res.status(400).json({ error: 'Invalid or expired QR code.' });
    }

    if (!userId || !name || !role) {
      return res.status(400).json({ error: 'Missing user details.' });
    }

    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    // Check if already marked for today
    const existing = await Attendance.findOne({ userId, date: dateStr });
    if (existing) {
      return res.status(400).json({ error: 'Attendance already marked for today.' });
    }

    const record = new Attendance({
      userId,
      name,
      role,
      date: dateStr,
      time: timeStr
    });
    
    await record.save();
    res.status(201).json({ message: 'Attendance marked successfully', record });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Attendance already marked for today.' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
