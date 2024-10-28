import styled from '@emotion/styled';
import Modal from 'react-modal';

export const Container = styled.div`
  padding: 20px;
  text-align: center;
  height: 400px;
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

export const EquipButton = styled.button`
  background-color: #00b900 !important;
`;

export const AuctionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const InventoryContainer = styled.div`
  display: flex;
  gap: 20px;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
`;

export const InventoryCard = styled.div`
  background-color: #1f1f1f;
  border: 2px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 15px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 0px;
  width: 200px;
  height: 320px;
  text-align: center;
  justify-content: center;
  align-items: center;

  img {
    float: left;
    width: 100px;
    height: 100px;
    object-fit: cover;
  }

  h4 {
    margin: 0px 0;
  }

  button {
    background-color: #a60101;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #ac2525;
    }
  }
`;
