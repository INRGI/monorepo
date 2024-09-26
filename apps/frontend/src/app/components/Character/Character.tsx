import React from 'react';
import { Card, InfoTitle, InfoText, Image } from './Character.styled';

interface CharacterProps {
  character: {
    name: string;
    level: number;
    health: number;
    attack: number;
    imageUrl: string;
  };
}

const Character: React.FC<CharacterProps> = ({ character }) => (
  <Card>
    <Image src={character.imageUrl} alt={character.name} />
    <InfoTitle>{character.name}</InfoTitle>
    <InfoText>Level: {character.level}</InfoText>
    <InfoText>Health: {character.health}</InfoText>
    <InfoText>Attack: {character.attack}</InfoText>
  </Card>
);

export default Character;
