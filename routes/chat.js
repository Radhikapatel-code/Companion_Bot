const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

router.get('/', async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const newMessage = new ChatMessage({
      user: message,
      bot: `You said: ${message}`, // Placeholder; replace with AI logic later
    });
    await newMessage.save();
    res.json({ reply: newMessage.bot });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;