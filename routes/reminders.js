const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Get all reminders
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ time: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new reminder
router.post('/', async (req, res) => {
  const { message, time } = req.body;
  if (!message || !time) {
    return res.status(400).json({ error: 'Message and time are required' });
  }
  try {
    const newReminder = new Reminder({ message, time: new Date(time) });
    await newReminder.save();
    res.json(newReminder);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;