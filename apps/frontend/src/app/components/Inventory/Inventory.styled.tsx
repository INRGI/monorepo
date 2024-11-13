import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Modal from 'react-modal';

const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
`;

export const Container = styled.div`
  padding: 20px;
  text-align: center;
  height: 100%;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border-radius: 20px;
  color: #f1f1f1;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

export const ModalContainer = styled(Modal)`
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 10px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  background-color: #222;
  border: 2px solid #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  color: #fff;
  width: 80%;
  max-width: 450px;
  height: 670px;
  font-size: 16px;
  text-align: center;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  img {
    max-width: 250px;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  }

  h2{
    padding: 0;
    margin: 0;
  }

  h4 {
    margin-bottom: 15px;
    font-size: 22px;
    font-weight: bold;
  }

  button {
    padding: 12px 24px;
    font-size: 16px;
    background-color: #45a3e0;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s ease;
    &:hover {
      background-color: #3b8cc1;
    }
  }
`;

export const EquipButton = styled.button`
  background-color: #34a853;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 18px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2c8f3a;
  }
`;

export const AuctionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  input {
    padding: 10px;
    width: 150px;
    font-size: 18px;
    border-radius: 8px;
    border: 2px solid #444;
    background-color: #333;
    color: white;
    text-align: center;
    transition: background-color 0.3s ease;

    &:focus {
      background-color: #222;
    }
  }

  button {
    background-color: #e67e22;
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #d45a0a;
    }
  }
`;

export const InventoryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export const InventoryCard = styled.div<{ rarity: string }>`
  padding: 20px;
  background-color: ${({ rarity }) =>
    rarity === 'legendary'
      ? '#e67e22'
      : rarity === 'epic'
      ? '#9b59b6'
      : rarity === 'rare' ?'#3498db' : '#ffffff6e'};
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  gap: 10px;
  animation: ${fadeIn} 0.4s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }

  button {
    background-color: #e62222;
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #d40a0a;
    }
  }
`;

export const ItemTitle = styled.h4`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin: 0;
  padding: 0;
`;

export const ItemDetails = styled.p`
  font-size: 14px;
  color: #ddd;
  margin: 0;
  padding: 0;
`;

