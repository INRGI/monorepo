import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

export const ChatContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  background-color: #1f1f1f;
  border: 2px solid #333;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  padding: 15px;
  width: 350px;
  height: ${({ isOpen }) => (isOpen ? '300px' : '40px')};
  transition: height 0.3s ease;
  color: #f1f1f1;
  z-index: 1000;
  overflow: hidden;
`;

export const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #444;
`;

export const InfoTitle = styled.h2`
  font-size: 18px;
  color: #fff;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

export const CollapseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.3s ease;
  &:hover {
    transform: rotate(180deg);
  }
`;

export const MessageList = styled.ul`
  list-style-type: none;
  padding: 10px 0;
  margin: 0;
  flex-grow: 1;
  max-height: 250px;
  overflow-y: auto;
  transition: all 0.3s ease;
`;

export const MessageItem = styled.li`
  background-color: #333;
  padding: 8px 12px;
  border-radius: 10px;
  margin: 5px 0;
  animation: ${fadeIn} 0.5s ease;
  word-wrap: break-word;
`;

export const InfoText = styled.p`
  font-size: 14px;
  color: #ddd;
  margin: 0;
`;

export const ChatFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding-top: 10px;
  border-top: 1px solid #444;
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  
  input {
    flex-grow: 1;
    padding: 10px;
    border-radius: 25px;
    border: 1px solid #444;
    background-color: #2e2e2e;
    color: white;
    font-size: 14px;
    &:focus {
      outline: none;
      border: 1px solid #00aaff;
    }
  }

  button {
    padding: 10px 15px;
    background-color: #00aaff;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #0088cc;
    }
  }
`;

