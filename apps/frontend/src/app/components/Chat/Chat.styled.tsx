import styled from '@emotion/styled';

export const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2e2e2e;
  border: 2px solid #fff;
  border-radius: 10px;
  padding: 10px;
  width: 300px;
  max-height: 400px;
  height: 350px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
  z-index: 1000;
`;

export const InfoTitle = styled.h2`
  margin: 10px 0;
  font-size: 20px;
  text-align: center;
`;

export const InfoText = styled.p`
  margin: 5px 0;
  font-size: 16px;
`;

export const MessageList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
  overflow-y: auto;
  flex-grow: 1;
  max-height: 250px;
  margin: 10px 0;
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  
  input {
    flex-grow: 1;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  button {
    padding: 8px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;
