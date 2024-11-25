import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Character } from '../../types/types';
import {
  CardContainer,
  Container,
  Heading,
  ScrollContainer,
  SkillCard,
  SkillInfoContainer,
  StyledButton,
  SubHeading,
} from './PotionInventory.styled';
import { toastCustom, updateToast } from '../../helpers/toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HeroPotion } from '../PotionShopContainer/PotionShopContainer';
import { set } from 'mongoose';

interface PotionInventoryProps {
  hero: Character;
}

const PotionInventory: React.FC<PotionInventoryProps> = ({ hero }) => {
  const [potions, setPotions] = useState<HeroPotion[]>([]);
  const [activeTimers, setActiveTimers] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchPotions();
  }, [hero]);

  const fetchPotions = async () => {
    try {
      const response = await axios.get<HeroPotion[]>(
        `http://localhost:3000/potion/${hero._id}`
      );
      setPotions(response.data);
    } catch (error) {
      toastCustom('Error fetching potions');
    }
  };

  const activatePotion = async (potionId: number) => {
    if (potionId) {
      try {
        await axios.put('http://localhost:3000/potion/activate', {
          heroId: hero._id,
          potionId,
        });

        startTimerWithToast(potionId);
        fetchPotions();
      } catch (error) {
        toastCustom('Error activating potion');
      }
    }
  };

  const startTimerWithToast = (potionId: number) => {
    const endTime = Date.now() + 60000;
    setActiveTimers((prev) => ({ ...prev, [potionId]: endTime }));

    const toastId = toast.info(`Activated: ${getPotionName(potionId)} (60s left)`, {
      autoClose: false,
      closeButton: false,
    });

    const interval = setInterval(async () => {
      const remainingTime = endTime - Date.now();
      if (remainingTime <= 0) {
        clearInterval(interval);
        setActiveTimers((prev) => {
          const updatedTimers = { ...prev };
          delete updatedTimers[potionId];
          return updatedTimers;
        });

        toast.update(toastId, {
          render: `Potion expired: ${getPotionName(potionId)}`,
          autoClose: 5000,
        });
        setTimeout(async () => {
            await fetchPotions();
        }, 1200);
      } else {
        const secondsLeft = Math.floor(remainingTime / 1000);
        updateToast(toastId, `Activated: ${getPotionName(potionId)} (${secondsLeft}s left)`);
      }
    }, 1000);
  };

  const getPotionName = (potionId: number) => {
    const potion = potions.find((p) => p.id === potionId);
    return potion ? potion.potion.name : 'Unknown Potion';
  };

  return (
    <Container>
      <Heading>Your potions</Heading>
      <ScrollContainer>
        <CardContainer>
          {potions.map((potion) => (
            <SkillCard key={potion.id}>
              <SkillInfoContainer>
                <SubHeading>{potion.potion.name}</SubHeading>
                <StyledButton
                  onClick={() => activatePotion(Number(potion.id))}
                  disabled={!!activeTimers[potion.id]}
                >
                  Activate Potion
                </StyledButton>
              </SkillInfoContainer>
            </SkillCard>
          ))}
        </CardContainer>
      </ScrollContainer>
    </Container>
  );
};

export default PotionInventory;
