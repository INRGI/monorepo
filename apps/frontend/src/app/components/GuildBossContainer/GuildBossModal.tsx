import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Character, GuildBoss } from '../../types/types';
import {
  Heading,
  ModalContainer,
  StyledButton,
  SubHeading,
} from './GuildBossModal.styled';
import ActiveSkillsMiniContainer from '../ActiveSkillsMiniContainer/ActiveSkillsMiniContainer';
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSkipFirstRender from '../../helpers/useSkipFirstRender';

interface GuildBossModalProps {
  guildId: number;
  hero: Character;
  modalIsOpen: boolean;
  closeModal: () => void;
  boss: GuildBoss;
  fetchBoss: (id: number) => void;
  updateHero: (updatedHero: any) => void;
  handleFetchHero: () => void;
}

const GuildBossModal: React.FC<GuildBossModalProps> = ({
  guildId,
  hero,
  modalIsOpen,
  closeModal,
  boss,
  fetchBoss,
  updateHero,
  handleFetchHero,
}) => {
  const [isHit, setIsHit] = useState(false);
  const [isHeroHit, setIsHeroHit] = useState(false);

  useSkipFirstRender(() => {
    setIsHeroHit(true);
    setTimeout(() => setIsHeroHit(false), 300);
    toastCustom(
      `🩸 You received ${boss.attack} damage`
    );
  }, [hero.hp]);

  const attackBoss = async () => {
    const damage = hero.attack;
    if(hero.hp <= boss.attack) return toastCustom(`❤️‍🩹 Please heal your hero`);
    try {
      setIsHit(true);
      await axios.put(`http://localhost:3000/guild-boss/attack`, {
        guildBossId: boss?.id,
        damage,
        guildId,
        heroId: hero._id,
      });
      if (boss.health <= damage) toastCustom(`🛡️ Boss defeated ${boss.name}`);
      if (boss.health <= damage)
        toastCustom(`💰 Your guild received ${boss.rewardCoins} coins`);
      fetchBoss(guildId);
      toastCustom(`⚔️ Dealed ${damage} damage`);
      setTimeout(() => setIsHit(false), 300);
      handleFetchHero();
    } catch (error) {
      console.error('Error attacking boss:', error);
    } finally {
      setTimeout(() => setIsHit(false), 300);
    }
  };

  const handleCastSpell = async (damage: number) => {
    try {
      if(hero.hp <= boss.attack) return toastCustom(`❤️‍🩹 Please heal your hero`);
      setIsHit(true);
      await axios.put(`http://localhost:3000/guild-boss/attack`, {
        guildBossId: boss?.id,
        damage,
        guildId,
        heroId: hero._id,
      });
      if (boss.health <= damage) toastCustom(`🛡️ Boss defeated ${boss.name}`);
      if (boss.health <= damage)
        toastCustom(`💰 Your guild received ${boss.rewardCoins} coins`);

      fetchBoss(guildId);
      toastCustom(`⚔️ Dealed ${damage} damage`);
      setTimeout(() => setIsHit(false), 300);
      handleFetchHero();
    } catch (error) {
      console.error('Error attacking boss:', error);
    } finally {
      setTimeout(() => setIsHit(false), 300);
    }
  };

  return (
    <ModalContainer
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Boss"
    >
      <Heading>Guild Boss</Heading>

      {boss && (
        <>
          <img
            src={boss.image}
            alt="boss"
            className={isHit ? 'hit-animation' : ''}
          />
          <h2>{boss.name}</h2>
          <p className={isHit ? 'hit-animation' : ''}>Health: {boss.health}</p>
          <SubHeading className={isHeroHit ? 'hit-animation' : ''}>
            Health: {hero.hp}/{hero.health}
          </SubHeading>
          <StyledButton onClick={() => attackBoss()}>Attack Boss</StyledButton>
        </>
      )}
      <ActiveSkillsMiniContainer
        attacking={attackBoss}
        hero={hero}
        onUse={handleCastSpell}
      />
    </ModalContainer>
  );
};

export default GuildBossModal;
