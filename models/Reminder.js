const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  message: { type: String, required: true },
  time: { type: Date, required: true },
});

module.exports = mongoose.model('Reminder', reminderSchema);