import styled from '@emotion/styled';
import Modal from 'react-modal';

export const Container = styled.div`
 padding: 10px;
  text-align: center;
  height: auto;
  background-color: #121212;
  color: #fff;

  h3 {
    font-size: 28px;
    margin-bottom: 20px;
    color: #e67e22;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  }
`;

export const BoxesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const BoxCard = styled.div`
  background: linear-gradient(145deg, #292929, #1f1f1f);
  border: 2px solid #444;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5), 0 -2px 6px rgba(0, 0, 0, 0.2) inset;
  color: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 200px;
  height: 280px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.7);
  }

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  }

  h4 {
    font-size: 20px;
    font-weight: bold;
    padding: 0;
    margin: 0;
    color: #e67e22;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  }

  p {
    font-size: 16px;
    color: #ddd;
    padding: 0;
    margin: 0;
  }

  button {
    background-color: #e67e22;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 18px;
    transition: background-color 0.3s ease, transform 0.3s ease;

    &:hover {
      background-color: #d35400;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(2px);
    }
  }
`;
export const ModalContainer = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(145deg, #292929, #1f1f1f);
  border: 2px solid #444;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 90%;
  max-width: 250px;
  text-align: center;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 15px;
    margin-bottom: 15px;
  }

  button {
    background-color: #c0392b;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #a93226;
    }
  }
`;
