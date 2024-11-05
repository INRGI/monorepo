import styled from '@emotion/styled';
import Modal from 'react-modal';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: center;
  align-items: center;
  gap: 20px;
  width: 500px;
  padding: 20px;
  background-color: #3e3e3e;
  border-radius: 8px;
  color: white;
  margin: 0 auto;
  p {
    padding: 0;
    margin: 0;
  }
  h3 {
    padding: 0;
    margin: 0;
  }
  h2 {
    padding: 0;
    margin: 0;
  }
`;

export const StyledInput = styled.input`
  padding: 10px;
  margin: 0px;
  border: none;
  border-radius: 4px;
  width: 70px;
  font-size: 16px;
  height: 30px;
`;

export const StyledButton = styled.button`
  width: 100px;
  height: 50px;
  padding: 10px 15px;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

export const ModalContainer = styled(Modal)`
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  background-color: #1f1f1f;
  border: 2px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 15px;
  width: 100%;
  max-width: 450px;
  height: 400px;
  text-align: center;
  font-size: 20px;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  button {
    background-color: #a60101;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #8c1919;
    }
  }

  h2{
    padding: 0;
    margin: 0;
  }
`;

export const GuessCardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  padding-top: 10px;
`;

export const CardItem = styled.div`
  width: 100px;
  height: 150px;
  background-color: #2a2a2a;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #3a3a3a;
    transform: scale(1.05);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;
