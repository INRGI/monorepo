import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Character, Monster } from '../../types/types';
import Battle from '../Battle/Battle';
import {
  BattleCont,
  BattleSection,
  EquipSection,
  Message,
  SkillsSection,
} from './BattleContainer.styled';
import ActiveSkillsContainer from '../ActiveSkillsContainer/ActiveSkillsContainer';
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';
import EquipContainer from '../Equip/Equip';

interface BattleContainerProps {
  hero: Character;
  updateHero: (hero: Character) => void;
  handleFetchHero: () => void;
}

const BattleContainer: React.FC<BattleContainerProps> = ({
  hero,
  updateHero,
  handleFetchHero,
}) => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [isMonsterDefeated, setIsMonsterDefeated] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [isHeroHit, setIsHeroHit] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:3000/battle/monsters')
      .then((response) => {
        setMonsters(response.data);
        setCurrentMonsterIndex(0);
      })
      .catch((error) => {
        toastCustom(`😰 Error fetching monsters`);
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
        setIsHit(true);
        if (hero.hp < response.data.hero.hp) {
          toastCustom(
            `🩸 You received ${hero.hp - response.data.hero.hp} damage`
          );
          setIsHeroHit(true);
        }
        const updatedMonster = response.data.monster;
        const updatedHero = response.data.hero;

        if (updatedMonster.health <= 0) {
          setIsMonsterDefeated(true);
          toastCustom(
            `💰 You defeated the monster and find ${monster.xp} coins`
          );
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
        toastCustom(`😰 Error processing attack`);
      })
      .finally(() => {
        setTimeout(() => {
          setIsHit(false);
          setIsHeroHit(false);
        }, 300);
      });
  };

  const handleCastSkills = (damage: number) => {
    const monster = monsters[currentMonsterIndex];
    if (hero.hp <= monster.attack)
      return toastCustom(`❤️‍🩹 Please heal your hero`);
    const newHero = { ...hero, attack: damage };
    axios
      .post('http://localhost:3000/battle/attack', {
        character: newHero,
        monsterId: monster.id,
      })
      .then((response) => {
        setIsHit(true);
        if (hero.hp < response.data.hero.hp) {
          toastCustom(
            `🩸 You received ${hero.hp - response.data.hero.hp} damage`
          );
          setIsHeroHit(true);
        }
        const updatedMonster = response.data.monster;
        const updatedHero = response.data.hero;

        if (updatedMonster.health <= 0) {
          setIsMonsterDefeated(true);
          toastCustom(
            `💰 You defeated the monster and find ${monster.xp} coins`
          );
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
      })
      .finally(() => {
        setTimeout(() => {
          setIsHit(false);
          setIsHeroHit(false);
        }, 300);
      });
  };

  const monster =
    monsters && monsters.length > 0 ? monsters[currentMonsterIndex] : null;

  return (
    <BattleCont>
      <SkillsSection>
        <ActiveSkillsContainer hero={hero} onUse={handleCastSkills} />
      </SkillsSection>
      <BattleSection>
        {monster ? (
          <>
            {isMonsterDefeated && (
              <Message>You defeated the {monster.name}!</Message>
            )}
            <Battle
              isHit={isHit}
              isHeroHit={isHeroHit}
              character={hero}
              monster={monster}
              onAttack={handleAttack}
            />
          </>
        ) : (
          <Message>Loading...</Message>
        )}
      </BattleSection>
      <EquipSection>
        <EquipContainer hero={hero} handleFetchHero={handleFetchHero} />
      </EquipSection>
    </BattleCont>
  );
};

export default BattleContainer;
