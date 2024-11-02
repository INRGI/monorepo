import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ChatProps, Message } from '../../types/types';
import { ChatContainer, MessageList, InputContainer, InfoTitle, InfoText } from './Chat.styled';
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:3000');

const Chat: React.FC<ChatProps> = ({ roomId, senderId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    socket.emit('joinRoom', { roomId });

    socket.on('messages', (receivedMessages: Message[]) => {
      setMessages(receivedMessages);
      toastCustom(`💌 New message in a chat`);
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
    if (!message) return;

    const payload: Message = { roomId, senderId, message };
    socket.emit('sendMessage', payload);
    setMessage('');
  };

  return (
    <ChatContainer>
      <InfoTitle>Chat Room: {roomId}</InfoTitle>
      <MessageList>
        {messages.length === 0 ? (
          <li>No messages yet</li>
        ) : (
          messages.map((msg, index) => (
            <li key={index}>
              <InfoText>{msg.senderId}: {msg.message}</InfoText>
            </li>
          ))
        )}
      </MessageList>
      <InputContainer>
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;
