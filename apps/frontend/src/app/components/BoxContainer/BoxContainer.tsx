import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, BoxCard, ModalContainer } from './BoxContainer.styled';

interface Box {
  id: number;
  name: string;
  image: string;
  cost: number;
}

interface Item {
  id: number;
  name: string;
  image: string;
  type: 'weapon' | 'armor';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats: {
    attack?: number;
    health?: number;
  };
}

const BoxContainer: React.FC = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openedItem, setOpenedItem] = useState<Item | null>(null);

  const handleOpenBox = async (boxId: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/itemBox/${boxId}`);
      setOpenedItem(response.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error opening box:', error);
    }
  };

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/itemBox');
        setBoxes(response.data);
      } catch (error) {
        console.error('Failed to fetch boxes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
    setOpenedItem(null);
  };

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <h3>Boxes</h3>
      <div>
        {boxes.map((box) => (
          <BoxCard key={box.id}>
            <img src={box.image} alt={box.name} />
            <h4>{box.name}</h4>
            <p>Cost: {box.cost} coins</p>
            <button onClick={() => handleOpenBox(box.id)}>Open Box</button>
          </BoxCard>
        ))}
      </div>

      <ModalContainer isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Opened Item">
        <h2>You've recieved a new item!</h2>
        {openedItem && (
          <div>
            <img width={300} src={openedItem.image} alt={openedItem.name} />
            <h4>{openedItem.name}</h4>
            <p>Type: {openedItem.type}</p>
            <p>Rarity: {openedItem.rarity}</p>
            {openedItem.stats.attack && <p>Attack: {openedItem.stats.attack}</p>}
            {openedItem.stats.health && <p>Health: {openedItem.stats.health}</p>}
          </div>
        )}
        <button onClick={closeModal}>Close</button>
      </ModalContainer>
    </Container>
  );
};

export default BoxContainer;
