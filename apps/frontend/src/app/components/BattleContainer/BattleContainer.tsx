import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Character, Monster } from '../../types/types';
import Battle from '../Battle/Battle';
import { Container, Message } from './BattleContainer.styled';

interface BattleContainerProps {
  hero: Character;
  updateHero: (hero: Character) => void;
}

const BattleContainer: React.FC<BattleContainerProps> = ({ hero, updateHero }) => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [isMonsterDefeated, setIsMonsterDefeated] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:3000/battle/monsters')
      .then((response) => {
        setMonsters(response.data);
        setCurrentMonsterIndex(0);
      })
      .catch((error) => {
        console.error('Error fetching monsters:', error);
      });
  }, []);

  const handleAttack = () => {
    const monster = monsters[currentMonsterIndex];
    axios
      .post('http://localhost:3000/battle/attack', {
        character: hero,
        monsterId: monster.id,
      })
      .then((response) => {
        const updatedMonster = response.data.monster;
        const updatedHero = response.data.hero;

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

        updateHero(updatedHero);
      })
      .catch((error) => {
        console.error('Error processing attack:', error);
      });
  };

  const monster = monsters && monsters.length > 0 ? monsters[currentMonsterIndex] : null;

  return (
    <Container>
      {monster ? (
        <>
          {isMonsterDefeated && <Message>You defeated the {monster.name}!</Message>}
          <Battle character={hero} monster={monster} onAttack={handleAttack} />
        </>
      ) : (
        <Message>Loading...</Message>
      )}
    </Container>
  );
};

export default BattleContainer;
