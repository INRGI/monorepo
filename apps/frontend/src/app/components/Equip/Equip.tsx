import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Character, Equip, HeroQuest } from '../../types/types';
import {
  CardContainer,
  Container,
  EquipCard,
  EquipInfoContainer,
  Heading,
  ScrollContainer,
  StyledButton,
  SubHeading,
} from './Equip.styled';

interface EquipContainerProps {
  hero: Character;
}

const EquipContainer: React.FC<EquipContainerProps> = ({ hero }) => {
  const [equip, setEquip] = useState<Equip>();

  useEffect(() => {
    fetchEquip();
  }, [hero]);

  const fetchEquip = async () => {
    try {
      const response = await axios.get<Equip>(
        `http://localhost:3000/inventory/equip/${ hero._id}`
      );
      setEquip(response.data);
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  };

  const handleUnequip = async (type: string) => {
    const response = await axios.post(`http://localhost:3000/inventory/unequip`, {
      heroId: hero._id,
      itemType: type
    })
    fetchEquip();
  }

  return (
    <Container>
      <Heading>Your Equip</Heading>
      <ScrollContainer>
        <CardContainer>
          {equip?.armor && (
            <EquipCard>
              <EquipInfoContainer>
                <img
                  width={300}
                  src={equip?.armor.image}
                  alt={equip?.armor.name}
                />
                <SubHeading>{equip.armor.name}</SubHeading>
                <p>Health: {equip.armor.stats.health}</p>
                <StyledButton onClick={() => handleUnequip('armor')}>Unequip</StyledButton>
              </EquipInfoContainer>
            </EquipCard>
          )}
          {equip?.weapon && (
            <EquipCard>
              <EquipInfoContainer>
                <img
                  width={300}
                  src={equip?.weapon.image}
                  alt={equip?.weapon.name}
                />
                <SubHeading> {equip.weapon.name}</SubHeading>
                <p>Attack: {equip.weapon.stats.attack}</p>
                <StyledButton onClick={() => handleUnequip('weapon')}>Unequip</StyledButton>
              </EquipInfoContainer>
            </EquipCard>
          )}
        </CardContainer>
      </ScrollContainer>
    </Container>
  );
};

export default EquipContainer;
