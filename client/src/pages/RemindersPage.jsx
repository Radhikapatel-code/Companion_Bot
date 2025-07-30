import { useState, useEffect } from 'react';
import axios from 'axios';

const RemindersPage = () => {
  const [formData, setFormData] = useState({ message: '', time: '' });
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reminders');
        console.log('Fetched reminders:', res.data);
        setReminders(res.data);
      } catch (error) {
        console.error('Error fetching reminders:', error);
        setError('Failed to load reminders: ' + (error.response?.data?.error || error.message));
      }
    };
    fetchReminders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message || !formData.time) {
      setError('Message and time are required');
      return;
    }
    try {
      console.log('Sending reminder:', formData);
      const res = await axios.post('http://localhost:5000/api/reminders', formData);
      console.log('Response:', res.data);
      setReminders([...reminders, res.data]);
      setFormData({ message: '', time: '' });
      setError(null);
    } catch (error) {
      console.error('Error saving reminder:', error.response?.data || error.message);
      setError('Failed to save reminder: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reminders</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="border p-2 rounded"
            placeholder="Reminder message (e.g., Take medicine)"
          />
          <input
            type="datetime-local"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Reminder
          </button>
        </div>
      </form>
      <div className="border p-4 bg-white rounded">
        <h2 className="text-xl font-semibold mb-2">Your Reminders</h2>
        {reminders.length === 0 ? (
          <p>No reminders set.</p>
        ) : (
          reminders.map((reminder, idx) => (
            <div key={idx} className="mb-2">
              <p>
                {reminder.message} - {new Date(reminder.time).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RemindersPage;