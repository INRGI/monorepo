import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Modal from 'react-modal';

const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
`;

export const AuctionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;
  padding: 0;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  background-color: #1e1e1e;
  border-radius: 12px;
  color: white;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  border: 1px solid #333;
`;


export const AuctionCard = styled.div`
  width: 260px;
  height: 220px;
  background-color: #2c2f35;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s, box-shadow 0.3s;
  animation: ${fadeIn} 0.4s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.7);
  }

  img {
    float: left;
    width: 100px;
    height: 100px;
    object-fit: cover;
  }

  h4 {
    margin: 10px 0;
  }

  button {
    width: 90%;
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
  }
`;

export const StyledButton = styled.button`
  width: 80%;
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
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 450px;
  height: 670px;
  text-align: center;
  font-size: 20px;

  img {
    float: left;
    width: 200px;
    height: 250px;
    object-fit: cover;
    padding-bottom: 20px;
  }

  button {
    background-color: #a60101;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #8c1919;
    }
  }
`;
