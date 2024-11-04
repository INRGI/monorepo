import React from "react";
import Character from "../Character/Character";
import Monster from "../Monster/Monster";
import { BattleContainer, AttackButton, Stats } from "./Battle.styled";
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BattleProps {
  character: {
    name: string;
    level: number;
    health: number;
    attack: number;
    imageUrl: string;
    coins: number;
    experience: number;
    hp: number;
  };
  monster: {
    name: string;
    health: number;
    attack: number;
    imageUrl: string;
    xp: number;
  };
  onAttack: (newMonsterHealth: number) => void;
  isHit: boolean;
  isHeroHit: boolean;
}

const Battle: React.FC<BattleProps> = ({ character, monster, onAttack, isHit, isHeroHit }) => {
  const handleAttack = () => {
    const newMonsterHealth = monster.health - character.attack;
    onAttack(newMonsterHealth);
    toastCustom(`🩸 You dealed ${character.attack} damage`);
  };

  return (
    <BattleContainer>
      <Stats>
        <Character character={character} isHeroHit={isHeroHit}/>
      </Stats>
      <AttackButton onClick={handleAttack}>Attack</AttackButton>
      <Stats>
        <Monster isHit={isHit} monster={monster} />
      </Stats>
    </BattleContainer>
  );
};

export default Battle;
