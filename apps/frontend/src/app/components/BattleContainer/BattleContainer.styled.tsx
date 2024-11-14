import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1e1e1e;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 80%;
  margin: 0 auto;
`;

export const BattleCont = styled.div`
  display: flex;
  align-items: center;
  background-color: #1e1e1e;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

export const SkillsSection = styled.div`
  width: 15%;
  transition: transform 0.3s ease;
`;

export const BattleSection = styled.div`
  width: 65%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EquipSection = styled.div`
  width: 20%;
  transition: transform 0.3s ease;
`;

export const Message = styled.h2`
  color: #ffcc00;
  margin-bottom: 20px;
`;

