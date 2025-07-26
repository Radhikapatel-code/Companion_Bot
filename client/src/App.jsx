import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import HealthDashboard from './pages/HealthDashboard';
import RemindersPage from './pages/RemindersPage';
import EmergencyPage from './pages/EmergencyPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white flex space-x-4">
          <a href="/" className="hover:underline">Chat</a>
          <a href="/health" className="hover:underline">Health</a>
          <a href="/reminders" className="hover:underline">Reminders</a>
          <a href="/emergency" className="hover:underline">Emergency</a>
        </nav>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/health" element={<HealthDashboard />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;