const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Reminder = require('./models/Reminder');

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); // Explicit CORS for frontend
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@'));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const reminders = await Reminder.find({
      time: { $lte: now },
    });
    reminders.forEach((reminder) => {
      console.log(`Reminder due: ${reminder.message} at ${new Date(reminder.time).toLocaleString()}`);
    });
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
});

app.get('/', (req, res) => res.send('Companion Bot API is running!'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/health', require('./routes/health'));
app.use('/api/reminders', require('./routes/reminders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));