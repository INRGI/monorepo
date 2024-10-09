import styled from '@emotion/styled';
import Modal from 'react-modal';

export const Container = styled.div`
  padding: 20px;
  text-align: center;
`;
export const BoxCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  display: inline-block;
  width: 200px;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  h4 {
    margin: 10px 0;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;


export const ModalContainer = styled(Modal)`
  width: 100%;
  max-width: 450px;
  height: 650px;
  background-color: #8f8f8f;
  border: 1px solid;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 5px;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;
