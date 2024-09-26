import React from "react";
import { Card, Image, InfoTitle, InfoText } from "./Monster.styled";

interface MonsterProps {
  monster: {
    name: string;
    health: number;
    attack: number;
    imageUrl: string;
  };
}

const Monster: React.FC<MonsterProps> = ({ monster }) => (
  <Card>
    <Image src={monster.imageUrl} alt={monster.name} />
    <InfoTitle>{monster.name}</InfoTitle>
    <InfoText>Health: {monster.health}</InfoText>
    <InfoText>Attack: {monster.attack}</InfoText>
  </Card>
);

export default Monster;
