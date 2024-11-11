
import styled from '@emotion/styled';


export const Container = styled.div`
  width: 350px;
  margin: 50px auto;
  padding: 20px;
  background-color: #2e2e2e;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  text-align: center;
  color: white;
`;

export const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

export const BetSection = styled.div`
  margin-bottom: 20px;
`;

export const BetButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

export const Button = styled.button`
  background-color: #f0ad4e;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ec971f;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

export const SlotContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

export const Slot = styled.div<{ spinning: boolean }>`
  font-size: 40px;
  font-weight: bold;
  transition: transform 0.3s ease;
`;

export const PlayButton = styled.button`
  background-color: #28a745;
  border: none;
  padding: 15px 25px;
  font-size: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

export const Result = styled.div`
  margin-top: 20px;
  font-size: 18px;
`;

export const WinText = styled.p`
  color: #28a745;
  font-weight: bold;
`;

export const TryAgainText = styled.p`
  color: #dc3545;
  font-weight: bold;
`;