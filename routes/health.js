const express = require('express');
const router = express.Router();
const HealthData = require('../models/HealthData');

router.get('/', async (req, res) => {
  try {
    const data = await HealthData.find().sort({ date: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { weight, date } = req.body;
  if (!weight || !date) {
    return res.status(400).json({ error: 'Weight and date are required' });
  }
  try {
    const newData = new HealthData({ weight, date: new Date(date) });
    await newData.save();
    res.json(newData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;