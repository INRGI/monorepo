import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Character, GuildBoss } from '../../types/types';
import {
  Container,
  Heading,
  ModalContainer,
  StyledButton,
} from './GuildBossModal.styled';
import ActiveSkillsContainer from '../ActiveSkillsContainer/ActiveSkillsContainer';
import ActiveSkillsMiniContainer from '../ActiveSkillsMiniContainer/ActiveSkillsMiniContainer';

interface GuildBossModalProps {
  guildId: number;
  hero: Character;
  modalIsOpen: boolean;
  closeModal: () => void;
  boss: GuildBoss;
  fetchBoss: (id: number) => void;
}

const GuildBossModal: React.FC<GuildBossModalProps> = ({
  guildId,
  hero,
  modalIsOpen,
  closeModal,
  boss,
  fetchBoss
}) => {

  const attackBoss = async () => {
    const damage = hero.attack;
    try {
      await axios.put(`http://localhost:3000/guild-boss/attack`, {
        guildBossId: boss?.id,
        damage,
        guildId,
        heroId: hero._id
      });
      fetchBoss(guildId);
    } catch (error) {
      console.error('Error attacking boss:', error);
    }
  };

  const handleCastSpell = async(damage: number) => {
    try {
      await axios.put(`http://localhost:3000/guild-boss/attack`, {
        guildBossId: boss?.id,
        damage,
        guildId,
        heroId: hero._id
      });
      fetchBoss(guildId);
    } catch (error) {
      console.error('Error attacking boss:', error);
    }
  }

  return (
    <ModalContainer
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Boss"
    >
      <Heading>Guild Boss</Heading>

      {boss && (
        <>
        <img src={boss.image} alt='boss'/>
          <h2>{boss.name}</h2>
          <p>Health: {boss.health}</p>
          <StyledButton onClick={() => attackBoss()}>Attack Boss</StyledButton>
        </>
      )}
      <ActiveSkillsMiniContainer attacking={attackBoss} hero={hero} onUse={handleCastSpell}/>
    </ModalContainer>
  );
};

export default GuildBossModal;
