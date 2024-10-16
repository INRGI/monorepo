import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ChatProps, Message } from '../../types/types';

const socket = io('http://localhost:3000');

const Chat: React.FC<ChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [senderId, setSenderId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('joinRoom', { roomId });
      console.log(`Joined room ${roomId}`);
      socket.emit('getMessage', { roomId });
    });
  
    socket.on('messages', (receivedMessages: Message[]) => {
      console.log('Messages event triggered');
      console.log('Received messages:', receivedMessages);
      if (receivedMessages.length === 0) {
        console.log('No messages in the room');
      }
      setMessages(receivedMessages);
    });
  
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  
    return () => {
      socket.off('message');
      socket.off('messages');
      socket.off('error');
      socket.off('disconnect');
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
