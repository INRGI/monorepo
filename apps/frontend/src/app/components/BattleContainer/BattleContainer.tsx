import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Battle from '../Battle/Battle';

const char = {
  name: 'YOU',
  level: 1,
  health: 100,
  attack: 10
}

const BattleContainer: React.FC = () => {
  const [monsters, setMonsters] = useState([]);
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [isMonsterDefeated, setIsMonsterDefeated] = useState(false);

  useEffect(() => {
    axios.get('/battle/monsters').then((response) => {
      setMonsters(response.data);
      setCurrentMonsterIndex(0);
    });
  }, []);

  const handleAttack = () => {
    const monster = monsters[currentMonsterIndex];
    axios
      .post('/battle/attack', {
        character: { attack: char.attack },
        monster,
      })
      .then((response) => {
        const updatedMonster = response.data.monster;
        if (updatedMonster.health <= 0) {
          setIsMonsterDefeated(true);
          setTimeout(() => {
            setCurrentMonsterIndex((prevIndex) => prevIndex + 1);
            setIsMonsterDefeated(false);
          }, 2000);
        } else {
          const updatedMonsters = [...monsters];
          updatedMonsters[currentMonsterIndex] = updatedMonster;
          setMonsters(updatedMonsters);
        }
      });
  };

  const monster = monsters[currentMonsterIndex];

  return monster ? (
    <div>
      {isMonsterDefeated && <h2>You defeated the {monster.name}!</h2>}
      <Battle character={char} monster={monster} onAttack={handleAttack} />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default BattleContainer;
