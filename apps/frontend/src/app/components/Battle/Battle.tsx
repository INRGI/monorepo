import React from "react";
import Character from "../Character/Character";
import Monster from "../Monster/Monster";

const Battle: React.FC = ({ character, monster, onAttack }) => {
  const handleAttack = () => {
    const newMonsterHealth = monster.health - character.attack;
    onAttack(newMonsterHealth);
  };

  return (
    <div>
      <Character character={character} />
      <Monster monster={monster} />
      <button onClick={handleAttack}>Attack</button>
    </div>
  );
};

export default Battle;
