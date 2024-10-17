import styled from '@emotion/styled';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2e2e2e;
  border: 2px solid #fff;
  border-radius: 10px;
  padding: 20px;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
  text-align: center;
`;

export const InfoTitle = styled.h2`
  margin: 10px 0;
  font-size: 24px;
`;

export const InfoText = styled.p`
  margin: 5px 0;
  font-size: 18px;
`;
