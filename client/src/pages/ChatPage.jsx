import { useState, useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat');
        setChat(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message });
      setChat([...chat, { user: message, bot: res.data.reply }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat with Companion Bot</h1>
      <div className="border p-4 h-64 overflow-y-auto mb-4 bg-white rounded">
        {chat.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <p className="font-semibold text-blue-600">You:</p>
            <p>{msg.user}</p>
            <p className="font-semibold text-green-600">Bot:</p>
            <p>{msg.bot}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;