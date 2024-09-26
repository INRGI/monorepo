import styled from "@emotion/styled";

export const BattleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #1f1f1f;
  border: 2px solid #fff;
  border-radius: 15px;
  width: 800px;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

export const AttackButton = styled.button`
  background-color: #ff4c4c;
  color: white;
  font-size: 18px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #ff1a1a;
  }

  &:active {
    background-color: #ff0000;
  }
`;

export const Stats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
