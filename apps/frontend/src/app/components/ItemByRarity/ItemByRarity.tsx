import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Character, Item } from '../../types/types';
import { BoxCard, BoxesContainer, ModalContainer } from './ItemByRarity.styled';
import { Container } from '../BattleContainer/BattleContainer.styled';

interface ItemByRarityProps {
  hero: Character;
  updateHero: (hero: Character) => void;
}

const ItemByRarity: React.FC<ItemByRarityProps> = ({ hero, updateHero }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openedItem, setOpenedItem] = useState<Item | null>(null);

  const handleBuyBox = async (rarity: string, price: number) => {
    try {
      const response = await axios.post(`http://localhost:3000/shop/buyByRarity/${rarity}`, {
        hero: hero,
        price
      });

      if(!response){
        throw new Error('Not enough coins');
      }

      setOpenedItem(response.data.item);
      setModalIsOpen(true);
      const updatedHero ={...hero, 'coins': hero.coins - price};
      updateHero(updatedHero);
    } catch (error) {
      console.error('Error buying box:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setOpenedItem(null);
  };

  return (
    <Container>
      <h3>Boxes with chosen rarity</h3>
      <BoxesContainer>
          <BoxCard key={1}>
            <img src='https://cdnb.artstation.com/p/assets/images/images/044/580/393/original/fouraugustx-cm-lootbox.gif?1640491778' alt="Box" />
            <h4>Common</h4>
            <p>Cost: 50 coins</p>
            <button onClick={() => handleBuyBox('common', 50)}>Buy Box</button>
          </BoxCard>
          <BoxCard key={2}>
            <img src='https://t3.ftcdn.net/jpg/05/89/06/24/360_F_589062467_dUdYOcF9DrYSfwstki995HRSEAgwo5Xw.jpg' alt="Box" />
            <h4>Rare</h4>
            <p>Cost: 300 coins</p>
            <button onClick={() => handleBuyBox('rare', 300)}>Buy Box</button>
          </BoxCard>
          <BoxCard key={3}>
            <img src='https://i.pinimg.com/originals/88/1a/98/881a988f92d5a2d602e881f8d4f699f7.gif' alt="Box" />
            <h4>Epic</h4>
            <p>Cost: 700 coins</p>
            <button onClick={() => handleBuyBox('epic', 700)}>Buy Box</button>
          </BoxCard>
          <BoxCard key={4}>
            <img src='https://i.imgur.com/2By8Ooy.gif' alt="Box" />
            <h4>Legendary</h4>
            <p>Cost: 50000 coins</p>
            <button onClick={() => handleBuyBox('legendary', 50000)}>Buy Box</button>
          </BoxCard>
          
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


export default ItemByRarity;
