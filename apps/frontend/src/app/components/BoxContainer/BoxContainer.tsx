import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '../BattleContainer/BattleContainer.styled';
import { BoxCard, ModalContainer, BoxesContainer } from './BoxContainer.styled';
import { Box, Character, Item } from '../../types/types';

interface BoxContainerProps {
  hero: Character;
  updateHero: (hero: Character) => void;
}

const BoxContainer: React.FC<BoxContainerProps> = ({ hero, updateHero }) => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openedItem, setOpenedItem] = useState<Item | null>(null);

  const handleBuyBox = async (boxId: number, price: number) => {
    try {
      const response = await axios.post(`http://localhost:3000/shop/buy/${boxId}`, {
        hero: hero,
        price
      });

      if(!response){
        throw new Error('Not enough coins');
      }

      setOpenedItem(response.data);
      setModalIsOpen(true);
      const updatedHero ={...hero, 'coins': hero.coins - price};
      updateHero(updatedHero);
    } catch (error) {
      console.error('Error buying box:', error);
    }
  };

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/itemBox/top');
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
      <h3>TOP Boxes</h3>
      <BoxesContainer>
        {boxes.map((box) => (
          <BoxCard key={box.id}>
            <img src={box.image} alt={box.name} />
            <h4>{box.name}</h4>
            <p>Cost: {box.cost} coins</p>
            <button onClick={() => handleBuyBox(box.id, box.cost)}>Buy Box</button>
          </BoxCard>
        ))}
      </BoxesContainer>

      <ModalContainer isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Opened Item">
        <h2>You've received a new item!</h2>
        {openedItem && (
          <div>
            <img width={300} src={openedItem.image} alt={openedItem.name} />
            <h4>{openedItem.name}</h4>
            <p>Type: {openedItem.type}</p>
            <p>Rarity: {openedItem.rarity}</p>
            <p>Enchanted: {openedItem.enchanted}</p>
            {openedItem.stats.attack && <p>Attack: {openedItem.stats.attack}</p> || openedItem.stats.health && <p>Health: {openedItem.stats.health}</p>}
          </div>
        )}
        <button onClick={closeModal}>Close</button>
      </ModalContainer>
    </Container>
  );
};


export default BoxContainer;
