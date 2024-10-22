import styled from '@emotion/styled';

export const Container = styled.div`
  padding: 20px;
  text-align: center;
  background-color: #3e3e3e;
  border-radius: 8px;
  color: white;

  align-content: center;
  justify-content: center;
`;

export const CardConteiner = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

export const GuildCard = styled.li`
width: 400px;
  background-color: #1f1f1f;
  border: 2px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 10px;
  margin: 10px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 10px;
`;

export const StyledInput = styled.input`
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  width: 150px;
`;

export const StyledButton = styled.button`
width: 150px;
  padding: 10px 15px;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;