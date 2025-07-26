const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('HealthData', healthDataSchema);