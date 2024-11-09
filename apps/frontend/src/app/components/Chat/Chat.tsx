import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ChatProps, Message } from '../../types/types';
import { ChatContainer, MessageList, InputContainer, InfoTitle, InfoText, CollapseButton, ChatHeader, ChatFooter, MessageItem } from './Chat.styled';
import { toastCustom } from '../../helpers/toastify';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:3000');

const Chat: React.FC<ChatProps> = ({ roomId, senderId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

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

  const toggleChat = () => setIsChatOpen((prev) => !prev);

  return (
    <ChatContainer isOpen={isChatOpen}>
      <ChatHeader>
        <InfoTitle>Chat Room: {roomId}</InfoTitle>
        <CollapseButton onClick={toggleChat}>
          {isChatOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
        </CollapseButton>
      </ChatHeader>
      {isChatOpen && (
        <>
          <MessageList>
            {messages.length === 0 ? (
              <li>No messages yet</li>
            ) : (
              messages.map((msg, index) => (
                <MessageItem key={index}>
                  <InfoText>{msg.senderId}: {msg.message}</InfoText>
                </MessageItem>
              ))
            )}
          </MessageList>
          <ChatFooter>
            <InputContainer>
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </InputContainer>
          </ChatFooter>
        </>
      )}
    </ChatContainer>
  );
};

export default Chat;
