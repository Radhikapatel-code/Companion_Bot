const express = require('express');
const router = express.Router();
const { PythonShell } = require('python-shell');
const ChatMessage = require('../models/ChatMessage');

router.get('/', async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    console.log('GET /api/chat - Fetched messages:', messages);
    res.json(messages);
  } catch (error) {
    console.error('GET /api/chat - Error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { message } = req.body;
  console.log('POST /api/chat - Received:', req.body);
  if (!message) {
    console.log('POST /api/chat - Invalid message');
    return res.status(400).json({ error: 'Invalid message' });
  }
  try {
    console.log('POST /api/chat - Calling Python script with message:', message);
    const options = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: 'D:/companion-bot',
      args: [message],
    };
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      PythonShell.run('chatbot.py', options, (err, results) => {
        if (err) {
          console.error('POST /api/chat - PythonShell error:', err);
          reject(err);
        }
        console.log('POST /api/chat - Python script output:', results);
        console.log('POST /api/chat - Python stderr:', stderr);
        resolve({ stdout: results ? results[0] : '', stderr });
      });
    });
    let reply;
    try {
      const parsed = JSON.parse(stdout);
      if (parsed.error) {
        console.error('POST /api/chat - Python script error:', parsed.error);
        return res.status(500).json({ error: parsed.error });
      }
      reply = parsed.reply;
      console.log('POST /api/chat - Parsed reply:', reply);
    } catch (jsonError) {
      console.error('POST /api/chat - JSON parse error:', jsonError.message);
      return res.status(500).json({ error: 'Invalid Python script response' });
    }

    const newMessage = new ChatMessage({
      user: message,
      bot: reply,
    });
    await newMessage.save();
    console.log('POST /api/chat - Saved message:', newMessage);

    res.json({ reply });
  } catch (error) {
    console.error('POST /api/chat - Error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;