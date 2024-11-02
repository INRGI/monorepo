import React from "react";
import { Card, Image, InfoTitle, InfoText } from "./Monster.styled";

interface MonsterProps {
  monster: {
    name: string;
    health: number;
    attack: number;
    imageUrl: string;
    xp: number;
  };
  isHit: boolean;
}

const Monster: React.FC<MonsterProps> = ({ monster, isHit }) => (
  <Card className={isHit ? 'hit-animation' : ''}>
    <Image className={isHit ? 'hit-animation' : ''} src={monster.imageUrl} alt={monster.name} />
    <InfoTitle>{monster.name}</InfoTitle>
    <InfoText className={isHit ? 'hit-animation' : ''}>Health: {monster.health}</InfoText>
    <InfoText>Attack: {monster.attack}</InfoText>
  </Card>
);

export default Monster;
