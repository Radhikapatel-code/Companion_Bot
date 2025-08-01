const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  bot: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);