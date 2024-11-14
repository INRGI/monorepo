import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  width: 90%;
  max-width: 200px;
  margin: 0 auto;
`;

export const CardContainer = styled.ul`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0;
  justify-content: center;
`;

export const EquipCard = styled.li`
  width: 160px;
  height: 200px;
  background-color: #1f1f1f;
  border: 1px solid #fff;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 0.3s ease-in-out;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 8px;
  }
`;

export const EquipInfoContainer = styled.div`
  text-align: center;
  font-size: 14px;
`;

export const StyledButton = styled.button`
  background-color: #af4c4c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #ff5c5c;
    transform: scale(1.1);
  }

  &:active {
    background-color: #d94444;
  }
`;

export const ScrollContainer = styled.div`
  height: 480px;
  overflow-y: auto;
  width: 100%;
`;

export const Heading = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
`;

export const SubHeading = styled.h3`
  font-size: 16px;
  margin: 8px 0;
`;
