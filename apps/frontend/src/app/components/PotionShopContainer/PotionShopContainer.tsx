import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '../BattleContainer/BattleContainer.styled';
import { BoxCard, ModalContainer, BoxesContainer } from '../BoxContainer/BoxContainer.styled';
import { Box, Character, Item } from '../../types/types';
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PotionShopContainerProps {
  hero: Character;
  updateHero: (hero: Character) => void;
}

export interface Potion {
    id: number;
    name: string;
    description: string;
    effect: string;
    duration: number;
    multiplier: number;
  }
  
  export interface HeroPotion {
    id: number;
    potion: Potion;
    activatedAt: string | null;
  }

const PotionShopContainer: React.FC<PotionShopContainerProps> = ({ hero, updateHero }) => {
  const [potions, setPotions] = useState<Potion[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBuyPotion = async (potionId: number, price: number) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/shop/buy-potion`,
        {
          heroId: hero._id,
          price,
          potionId: potionId,
        }
      );

      if (!response) {
        return toastCustom(`😰 Not enough coins`);
      }

      toastCustom(`🍺 You Bought Potion`);
      const updatedHero = { ...hero, coins: hero.coins - price };
      updateHero(updatedHero);
    } catch (error) {
      toastCustom(`😰 Error buying potion`);
    }
  };

  useEffect(() => {
    const fetchPotions = async () => {
      try {
        const response = await axios.get<Potion[]>('http://localhost:3000/potion/all');
        setPotions(response.data);
      } catch (error) {
        toastCustom(`😰 Failed to fetch boxes`);
      } finally {
        setLoading(false);
      }
    };

    fetchPotions();
  }, []);

 

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <h3>Potions</h3>
      <BoxesContainer>
        {potions.map((box) => (
          <BoxCard key={box.id}>
            <img src='https://image.tensorartassets.com/cdn-cgi/image/w=2048/model_showcase/655760185459114162/a5c4eb4e-b8ea-667a-bd39-b2b97a103b34.jpeg' alt={box.name} />
            <h4>{box.name}</h4>
            <p>Cost: 3000 coins</p>
            <button onClick={() => handleBuyPotion(box.id, 3000)}>
              Buy Potion
            </button>
          </BoxCard>
        ))}
      </BoxesContainer>
    </Container>
  );
};

export default PotionShopContainer;
