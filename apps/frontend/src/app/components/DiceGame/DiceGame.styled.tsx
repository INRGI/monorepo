import styled from '@emotion/styled';
import Modal from 'react-modal';

export const Container = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: #1e1e1e;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 80%;
  margin: 0 auto;
`;

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
  width: 100%;
  max-width: 450px;
  text-align: center;
  font-size: 20px;

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

export const DiceContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

`;
