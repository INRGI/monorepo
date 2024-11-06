import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '../BattleContainer/BattleContainer.styled';
import { BoxCard, ModalContainer, BoxesContainer } from './BoxContainer.styled';
import { Box, Character, Item } from '../../types/types';
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      const response = await axios.post(
        `http://localhost:3000/shop/buy/${boxId}`,
        {
          hero: hero,
          price,
        }
      );

      if (!response) {
        return toastCustom(`😰 Not enough coins`);
      }

      setOpenedItem(response.data);
      setModalIsOpen(true);
      toastCustom(`🎁 You Won ${response.data.name}`);
      const updatedHero = { ...hero, coins: hero.coins - price };
      updateHero(updatedHero);
    } catch (error) {
      toastCustom(`😰 Error buying box`);
    }
  };

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/itemBox/top');
        setBoxes(response.data);
      } catch (error) {
        toastCustom(`😰 Failed to fetch boxes`);
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
            <button onClick={() => handleBuyBox(box.id, box.cost)}>
              Buy Box
            </button>
          </BoxCard>
        ))}
      </BoxesContainer>

      <ModalContainer
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Opened Item"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
          },
        }}
      >
        <h2>You've received a new item!</h2>
        {openedItem && (
          <div>
            <img width={300} src={openedItem.image} alt={openedItem.name} />
            <h4>{openedItem.name}</h4>
            <p>Type: {openedItem.type}</p>
            <p>Rarity: {openedItem.rarity}</p>
            <p>Enchanted: {openedItem.enchanted}</p>
            {(openedItem.stats.attack && (
              <p>Attack: {openedItem.stats.attack}</p>
            )) ||
              (openedItem.stats.health && (
                <p>Health: {openedItem.stats.health}</p>
              ))}
          </div>
        )}
        <button onClick={closeModal}>Close</button>
      </ModalContainer>
    </Container>
  );
};

export default BoxContainer;
