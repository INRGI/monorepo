import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Character, HeroSkill } from '../../types/types';
import { CardContainer, Container, Heading, ScrollContainer, SkillCard, SkillInfoContainer, StyledButton, SubHeading } from './SkillsContainer.styled';
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SkillsContainerProps {
  hero: Character;
}

const SkillsContainer: React.FC<SkillsContainerProps> = ({ hero }) => {
  const [skills, setSkills] = useState<HeroSkill[]>([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    fetchSkills();
  }, [hero]);

  const fetchSkills = async () => {
    try {
      const response = await axios.get<HeroSkill[]>(
        `http://localhost:3000/skills/all/${hero._id}`
      );
      let totalLevels = response.data.reduce((sum, skill) => sum + skill.level, 0);
      setPoints(hero.level - totalLevels);
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching quests:', error);
      setSkills([]);
    }
  };

  const levelUpSkill = async (skillId: number) => {
    await axios.put(`http://localhost:3000/skills/levelUp`,{ heroId: hero._id, skillId: skillId})
    fetchSkills()
    toastCustom(`☝️ Your skill leveled up`);
  }

  return (
    <Container>
      <Heading>All Skills (Skill Points Left: {points})</Heading>
      <ScrollContainer>
        <CardContainer>
          {skills.map((skill) => (
            <SkillCard key={skill.id}>
              <SkillInfoContainer>
                <SubHeading>{skill.skill.name}</SubHeading>
                <p>Level: {skill.level}</p>
                <p>Cooldown: {skill.skill.cooldown}</p>
                {(skill.skill.damage && (
                  <p>Damage: {skill.skill.damage * skill.level || skill.skill.damage}</p>
                )) || <p>Healing: {skill.skill.healing}</p>}
                {skill.level === 0 && <StyledButton disabled={points === 0} onClick={() => levelUpSkill(Number(skill.id))}>Learn Skill</StyledButton>}
                {skill.level > 0 && <StyledButton disabled={points === 0} onClick={() => levelUpSkill(Number(skill.id))}>Level up Skill</StyledButton>}
              </SkillInfoContainer>
            </SkillCard>
          ))}
        </CardContainer>
      </ScrollContainer>
    </Container>
  );
};

export default SkillsContainer;
