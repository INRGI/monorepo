import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: center;
  padding: 10px;
  background-color: #3e3e3e;
  border-radius: 8px;
  color: white;
  width: 70%;
  margin: 0 auto;
`;

export const Cooldown = styled.p`
  padding: 0;
  color: red;
  margin: 0;
  font-size: 42px;
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
  width: 120px;
  height: 100px;
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
  gap: 10px;
  p {
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
  height: 180px;
  width: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
`;

export const Heading = styled.h2`
  margin: 0;
  font-size: 24px;
`;

export const SubHeading = styled.h3`
  margin: 0;
  font-size: 20px;
`;
