import React from 'react';
import { Card, InfoTitle, InfoText, Image } from './Character.styled';
import Hero3D from '../Hero3D/Hero3D';

interface CharacterProps {
  character: {
    name: string;
    level: number;
    health: number;
    hp: number;
    attack: number;
    imageUrl: string;
    coins: number;
    experience: number;
  };
  isHeroHit: boolean;
}

const Character: React.FC<CharacterProps> = ({ character, isHeroHit }) => (
  <Card className={isHeroHit ? 'hit-animation' : ''}>
    {/* <Image className={isHeroHit ? 'hit-animation' : ''} src={character.imageUrl} alt={character.name} />
     */}
     <Hero3D />
    {/* <InfoTitle>{character.name}</InfoTitle> */}
    <InfoText>Level: {character.level}</InfoText>
    <InfoText className={isHeroHit ? 'hit-animation' : ''}>Health: {character.hp}/{character.health}</InfoText>
    <InfoText>Attack: {character.attack}</InfoText>
    <InfoText>Coins: {character.coins}</InfoText>
    <InfoText>Xp: {character.experience}</InfoText>
  </Card>
);

export default Character;
