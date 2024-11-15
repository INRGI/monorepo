import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  align-content: center;
  padding: 5px;
  background-color: #3e3e3e;
  border-radius: 8px;
  color: white;
  width: 90%;
  margin: 0 auto;
  height: 80px;
    
  overflow-y: auto;
`;

export const Cooldown = styled.p`
  padding: 0;
  color: red;
  margin: 0;
  font-size: 20px;
`;

export const CardContainer = styled.ul`
height: 80px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 5px;
  padding: 0;
  margin: 0;
`;

export const SkillCard = styled.li`
  cursor: pointer;
  width: 100px;
  height: 50px;
  background-color: #1f1f1f;
  border: 2px solid #fff;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  :hover {
    border: 2px solid #ff9100;
    color: #ff9100;
  }
`;

export const SkillInfoContainer = styled.div`
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  p {
    font-size: 16px;
    padding: 0;
    margin: 0;
  }
`;

export const StyledButton = styled.button`
  background-color: #a3af4c;
  color: white;
  border: none;
  padding: 10px 27px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #a09e45;
  }
`;

export const ScrollContainer = styled.div`
  padding: 0;
  margin: 0;
  width: 100%;
  
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
`;

export const Heading = styled.h2`
  margin: 0;
  font-size: 15px;
`;

export const SubHeading = styled.h3`
  margin: 0;
  font-size: 15px;
`;
