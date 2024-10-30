import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: center;
  padding: 20px;
  background-color: #3e3e3e;
  border-radius: 8px;
  color: white;
  width: 80%;
  margin: 0 auto;
`;

export const CardContainer = styled.ul`
  display: flex;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  width: 90%;
  gap: 20px;
  padding: 0;
`;

export const SkillCard = styled.li`
  width: 200px;
  height: 340px;
  background-color: #1f1f1f;
  border: 2px solid #fff;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SkillInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

export const ScrollContainer = styled.div`
  padding: 0;
  margin: 0;
  height: 520px;
  overflow-y: auto;
  width: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
`;

export const Heading = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
`;

export const SubHeading = styled.h3`
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 20px;
`;

export const CompletedStatus = styled.p`
  color: #08c908;
`;

export const NotCompletedStatus = styled.p`
  color: red;
`;
