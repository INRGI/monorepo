import styled from '@emotion/styled';
import Modal from 'react-modal';

export const Container = styled.div`
  padding: 20px;
  text-align: center;
  height: 400px;
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