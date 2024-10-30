import React, { useState } from 'react';
import axios from 'axios';
import { Character, Item } from '../../types/types';

import { Container } from '../BattleContainer/BattleContainer.styled';
import { BoxCard, BoxesContainer } from './Shop.styled';

interface ShopProps {
  hero: Character;
  updateHero: (hero: Character) => void;
}

const Shop: React.FC<ShopProps> = ({ hero, updateHero }) => {
  const handleBuyReset = async (price: number) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/shop/buy-reset`,
        {
          heroId: hero._id,
          price,
        }
      );

      if (!response) {
        throw new Error('Not enough coins');
      }

      const updatedHero = { ...hero, coins: hero.coins - price };
      updateHero(updatedHero);
    } catch (error) {
      console.error('Error buying box:', error);
    }
  };

  return (
    <Container>
      <h3>Unique Offers</h3>
      <BoxesContainer>
        <BoxCard key={1}>
          <img
            src="https://thumbs.dreamstime.com/b/reset-button-8588065.jpg"
            alt="reset-button"
          />
          <h4>Reset your skills</h4>
          <p>Cost: 100000 coins</p>
          <button onClick={() => handleBuyReset(100000)}>Buy Reset</button>
        </BoxCard>
      </BoxesContainer>
    </Container>
  );
};

export default Shop;
