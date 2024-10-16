import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ChatProps, Message } from '../../types/types';

const socket = io('http://localhost:3000');

const Chat: React.FC<ChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [senderId, setSenderId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    socket.emit('joinRoom', { roomId });

    socket.on('messages', (receivedMessages: Message[]) => {
      setMessages(receivedMessages);
    });

    socket.on('newMessage', (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('newMessage');
      socket.off('messages');
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (!senderId || !message) return;

    const payload: Message = { roomId, senderId, message };
    socket.emit('sendMessage', payload);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat Room: {roomId}</h2>
      <div>
        <input
          type="text"
          placeholder="Sender ID"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <h3>Messages:</h3>
        <ul>
          {messages.length === 0 ? (
            <li>No messages yet</li>
          ) : (
            messages.map((msg, index) => (
              <li key={index}>
                {msg.senderId}: {msg.message}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
