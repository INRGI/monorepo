import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  padding: 20px;
  background-color: #3e3e3e;
  border-radius: 8px;
  color: white;
`;

export const GuildInfoContainer = styled.div`
  flex: 1;
  background-color: #2e2e2e;
  border-radius: 8px;
  padding: 20px;
`;

export const GuildListContainer = styled.div`
  flex: 1;
  background-color: #1f1f1f;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MyGuildContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CardContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const GuildCard = styled.li`
  width: 100%;
  background-color: #1f1f1f;
  border: 2px solid #fff;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledInput = styled.input`
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  width: 200px;
  font-size: 16px;
`;

export const StyledButton = styled.button`
  width: 200px;
  padding: 10px 15px;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

export const Heading = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
`;

export const SubHeading = styled.h3`
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 20px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;
