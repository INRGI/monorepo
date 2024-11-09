import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
  background: linear-gradient(145deg, #2e2e2e, #1c1c1c);
  border-radius: 16px;
  color: #e0e0e0;
  width: 90%;
  max-width: 1200px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease-in-out;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const CardContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 0;
  width: 100%;
  margin: 0;
`;

export const QuestCard = styled.li`
  width: 250px;
  height: 200px;
  background-color: #1a1a1a;
  border: 2px solid #444;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.7);
    background-color: #2c2c2c;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 220px;
    height: auto;
  }
`;

export const QuestInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

export const StyledButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:active {
    background-color: #388e3c;
  }
`;

export const ScrollContainer = styled.div`
  width: 100%;
  height: 520px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
`;

export const Heading = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 28px;
  text-align: center;
  color: #f0f0f0;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
`;

export const SubHeading = styled.h3`
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 20px;
  color: #ffd700;
  font-weight: 600;
  text-align: center;
`;

export const CompletedStatus = styled.p`
  color: #28a745;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 5px;
`;

export const NotCompletedStatus = styled.p`
  color: #d9534f;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 5px;
`;
