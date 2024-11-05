import React from 'react';
import axios from 'axios';
import { Character } from '../../types/types';

import { Container } from '../BattleContainer/BattleContainer.styled';
import { BoxCard, BoxesContainer } from './Shop.styled';

import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        return toastCustom(`💸 Not enough coins`);
      }

      const updatedHero = { ...hero, coins: hero.coins - price };
      toastCustom(`💸 You spent ${price} coins`);
      updateHero(updatedHero);
    } catch (error) {
      toastCustom('Error buying box');
    }
  };

  const handleBuyHealth = async (price: number, health: number) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/shop/buy-hp`,
        {
          heroId: hero._id,
          price,
          hp: health
        }
      );

      if (!response) {
        return toastCustom(`💸 Not enough coins`);
      }
      const newHealth = hero.hp + health > hero.health ? hero.health : hero.hp + health;
      const updatedHero = { ...hero, coins: hero.coins - price, hp: newHealth };
      toastCustom(`💸 You spent ${price} coins`);
      toastCustom(`❤️ You restored ${health} hp`);
      updateHero(updatedHero);
    } catch (error) {
      toastCustom('Error healing');
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
        <BoxCard key={2}>
          <img
            src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/54da47ad-cac9-4788-b49f-4bf4db57413d/dfwoqud-ab1b9b4d-3ece-42b8-98ec-482936f07fae.png/v1/fill/w_1280,h_1199,q_80,strp/healing_potion_by_anodiel_dfwoqud-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTE5OSIsInBhdGgiOiJcL2ZcLzU0ZGE0N2FkLWNhYzktNDc4OC1iNDlmLTRiZjRkYjU3NDEzZFwvZGZ3b3F1ZC1hYjFiOWI0ZC0zZWNlLTQyYjgtOThlYy00ODI5MzZmMDdmYWUucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.fMZSC3vC-AWcYyOmfDTv5HbM3XxgTEZDn2OpLchtp40"
            alt="buy hp"
          />
          <h4>Buy health(20hp)</h4>
          <p>Cost: 100 coins</p>
          <button onClick={() => handleBuyHealth(100, 20)}>Buy Health</button>
        </BoxCard>
        <BoxCard key={3}>
          <img
            src="https://cdn.gamedevmarket.net/wp-content/uploads/20220407133029/225612d43b4248431b3f49080031ea8d.jpg"
            alt="buy hp full"
          />
          <h4>Restore health</h4>
          <p>Cost: 2000 coins</p>
          <button onClick={() => handleBuyHealth(2000, hero.health - hero.hp)}>Restore Health</button>
        </BoxCard>
      </BoxesContainer>
    </Container>
  );
};

export default Shop;
