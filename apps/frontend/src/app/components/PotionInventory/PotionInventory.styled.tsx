import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
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
  width: 83%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  border: 1px solid #333;
`;

export const CardContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;
  padding: 0;
`;

export const SkillCard = styled.li`
  width: 260px;
  height: 80px;
  background-color: #2c2f35;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s, box-shadow 0.3s;
  animation: ${fadeIn} 0.4s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.7);
  }
`;

export const SkillInfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  text-align: center;
`;

export const StyledButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #388e3c;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

export const ScrollContainer = styled.div`
  height: 140px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
`;

export const Heading = styled.h2`
  font-size: 30px;
  font-weight: 700;

  padding: 0;
  margin: 0;
`;

export const SubHeading = styled.h3`
  font-size: 20px;
  color: #ffd54f;
  padding: 0;
  margin: 0;
`;

