import React from "react";
import Character from "../Character/Character";
import Monster from "../Monster/Monster";
import { BattleContainer, AttackButton, Stats } from "./Battle.styled";

interface BattleProps {
  character: {
    name: string;
    level: number;
    health: number;
    attack: number;
  };
  monster: {
    name: string;
    health: number;
    attack: number;
    imageUrl: string;
  };
  onAttack: (newMonsterHealth: number) => void;
}

const Battle: React.FC<BattleProps> = ({ character, monster, onAttack }) => {
  const handleAttack = () => {
    const newMonsterHealth = monster.health - character.attack;
    onAttack(newMonsterHealth);
  };

  return (
    <BattleContainer>
      <Stats>
        <Character character={character} />
      </Stats>
      <AttackButton onClick={handleAttack}>Attack</AttackButton>
      <Stats>
        <Monster monster={monster} />
      </Stats>
    </BattleContainer>
  );
};

export default Battle;
