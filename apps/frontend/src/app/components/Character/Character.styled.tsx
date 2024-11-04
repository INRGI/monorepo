import styled from '@emotion/styled';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2e2e2e;
  border: 2px solid #fff;
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  width: 250px;
  height: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
  text-align: center;
  div.hit-animation {border: 2px solid #da0505;}

  &.hit-animation {
    animation: shake 0.3s ease-in-out;
    filter: brightness(0.6) saturate(1.5);
    scale: 0.95;
  }

  p.hit-animation {
    animation: shake 0.3s ease-in-out;
    color: #da0505;
    filter: brightness(0.6) saturate(1.5);
    scale: 0.95;
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
  }
`;

export const Image = styled.img`
  width: 100%;
  max-width: 200px;
  overflow: hidden;
  border-radius: 10px;
`;

export const InfoTitle = styled.h2`
  margin: 10px 0;
  font-size: 24px;
`;

export const InfoText = styled.p`
  margin: 5px 0;
  font-size: 18px;
`;