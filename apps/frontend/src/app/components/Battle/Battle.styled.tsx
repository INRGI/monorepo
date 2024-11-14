import styled from "@emotion/styled";

export const BattleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  width: 700px;
  margin: 0px auto;
`;

export const AttackButton = styled.button`
  background: linear-gradient(45deg, #ff4c4c, #ff1a1a);
  color: white;
  font-size: 18px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 15px rgba(255, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.9);
  }
`;

export const Stats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
