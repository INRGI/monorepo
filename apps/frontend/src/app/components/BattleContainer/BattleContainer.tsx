import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Character, Monster } from '../../types/types';
import Battle from '../Battle/Battle';
import { Container, Message } from './BattleContainer.styled';

const char: Character = {
  name: 'YOU',
  level: 1,
  health: 100,
  attack: 10,
  imageUrl: 'https://img.freepik.com/premium-photo/pixel-art-archer-character-rpg-game-character-retro-style-8-bit-game-ai_985124-1823.jpg'
};

const BattleContainer: React.FC = () => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [isMonsterDefeated, setIsMonsterDefeated] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/battle/monsters').then((response) => {
      setMonsters(response.data);
      setCurrentMonsterIndex(0);
    }).catch((error) => {
      console.error("Error fetching monsters:", error);
    });
  }, []);

  const handleAttack = () => {
    const monster = monsters[currentMonsterIndex];
    axios
      .post('http://localhost:3000/battle/attack', {
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
      })
      .catch((error) => {
        console.error("Error processing attack:", error);
      });
  };

  const monster = monsters[currentMonsterIndex];

  return (
    <Container>
      {monster ? (
        <>
          {isMonsterDefeated && <Message>You defeated the {monster.name}!</Message>}
          <Battle character={char} monster={monster} onAttack={handleAttack} />
        </>
      ) : (
        <Message>Loading...</Message>
      )}
    </Container>
  );
};

export default BattleContainer;
