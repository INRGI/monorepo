import styled from '@emotion/styled';
import Modal from 'react-modal';

export const ModalContainer = styled(Modal)`
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  background-color: #1f1f1f;
  border: 2px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 15px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 450px;
  height: 670px;
  text-align: center;
  font-size: 20px;

  img {
    float: left;
    width: 200px;
    height: 250px;
    object-fit: cover;
    padding-bottom: 20px;
  }

  img.hit-animation {
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

  h3.hit-animation {
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

  button {
    background-color: #a60101;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #8c1919;
    }
  }
`;

export const UpdateModalContainer = styled(ModalContainer)`
  height: 200px;
  align-items: center;
  justify-content: center;
`;

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
  height: 600px;
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

export const ParticipantCard = styled.li`
  width: 80%;
  background-color: #1f1f1f;
  border: 2px solid #fff;
  border-radius: 8px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  p {
    padding: 0;
    margin: 0;
  }
`;

export const MyGuildContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  img {
    float: left;
    width: 100px;
    height: 150px;
    object-fit: cover;
    padding-bottom: 20px;
  }
`;
export const ScrollContainer = styled.div`
  padding: 0;
  margin: 0;
  height: 520px;
  overflow-y: auto;
  width: 90%;
`;

export const GuildMatesContainer = styled(ScrollContainer)`
  height: 240px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

export const CardContainer = styled.ul`
  display: flex;
  flex-direction: column;
  width: 90%;
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
  margin: 0px;
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
  padding: 0;
  margin: 0;
  font-size: 20px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;
