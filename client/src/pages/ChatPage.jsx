import { useState, useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages from API...');
        const res = await axios.get('http://localhost:5000/api/chat');
        console.log('Fetched messages:', res.data);
        setChat(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error.message);
        setError('Failed to load messages: ' + (error.response?.data?.error || error.message));
      }
    };
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) {
      console.log('Empty message detected');
      setError('Message is required');
      return;
    }
    try {
      console.log('Sending message to API:', message);
      const res = await axios.post('http://localhost:5000/api/chat', { message });
      console.log('API response:', res.data);
      const newChat = [...chat, { user: message, bot: res.data.reply }];
      console.log('Updating chat state:', newChat);
      setChat(newChat);
      setMessage('');
      setError(null);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('Error sending message:', errorMessage);
      setError(`Failed to send message: ${errorMessage}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat with Companion Bot</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="border p-4 h-64 overflow-y-auto mb-4 bg-white rounded">
        {chat.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          chat.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <p className="font-semibold text-blue-600">You:</p>
              <p>{msg.user}</p>
              <p className="font-semibold text-green-600">Bot:</p>
              <p>{msg.bot}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Type a message..."
          onKeyPress={(e) => {
            console.log('Key pressed:', e.key);
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button
          onClick={() => {
            console.log('Send button clicked');
            sendMessage();
          }}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;