import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 20px;
  width: 95%;
  padding: 20px;
  background-color: #3e3e3e;
  border-radius: 8px;
  color: white;
  margin: 0 auto;
`;

export const GuildInfoContainer = styled.div`
  background-color: #2e2e2e;
  border-radius: 8px;
  padding: 20px;
  width: 29%;
  height: 400px;
`;

export const GuildListContainer = styled.div`
  background-color: #1f1f1f;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  width: 29%;
`;

export const HeroesListContainer = styled.div`
  background-color: #1f1f1f;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 29%;
`;

export const HeroesList = styled.ul`
display: flex;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  align-content: center;
  align-items: center;
`;

export const HeroesCard = styled.li`
  width: 80%;
  background-color: #1f1f1f;
  border: 2px solid #fff;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MyGuildContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const CardContainer = styled.ul`
  display: flex;
  width: 250px;
  flex-direction: column;
  gap: 20px;
  padding: 0;
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
  margin: px;
  border: none;
  border-radius: 4px;
  width: 75%;
  font-size: 16px;
`;

export const StyledButton = styled.button`
  width: 80%;
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

export const EditButton = styled.button`
  width: 157px;
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
