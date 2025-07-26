import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HealthDashboard = () => {
  const [formData, setFormData] = useState({ weight: '', date: '' });
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/health');
        setHealthData(res.data);
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.weight || !formData.date) return;
    try {
      const res = await axios.post('http://localhost:5000/api/health', {
        weight: Number(formData.weight),
        date: formData.date,
      });
      setHealthData([...healthData, res.data]);
      setFormData({ weight: '', date: '' });
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  };

  const chart = {
    type: 'line',
    data: {
      labels: healthData.map((d) => new Date(d.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Weight (kg)',
          data: healthData.map((d) => d.weight),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Weight Progress' },
      },
    },
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Health Dashboard</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            className="border p-2 rounded"
            placeholder="Weight (kg)"
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>
      {healthData.length > 0 && (
        <div className="border p-4 bg-white rounded">
          <Line {...chart} />
        </div>
      )}
    </div>
  );
};

export default HealthDashboard;