import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Character, HeroSkill } from '../../types/types';
import {
  CardContainer,
  Container,
  Cooldown,
  Heading,
  ScrollContainer,
  SkillCard,
  SkillInfoContainer,
  StyledButton,
  SubHeading,
} from './ActiveSkillsMiniContainer.styled';

interface ActiveSkillsMiniContainerProps {
  hero: Character;
  onUse: (damage: number) => void;
  attacking: () => void;
}

const ActiveSkillsMiniContainer: React.FC<ActiveSkillsMiniContainerProps> = ({
  hero,
  onUse,
  attacking
}) => {
  const [skills, setSkills] = useState<HeroSkill[]>([]);

  useEffect(() => {
    fetchYourSkills();
  }, [hero]);

  useEffect(() => {
    fetchYourSkills();
  }, [attacking]);

  const fetchYourSkills = async () => {
    try {
      const response = await axios.get<HeroSkill[]>(
        `http://localhost:3000/skills/my/${hero._id}`
      );
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching quests:', error);
      setSkills([]);
    }
  };

  const handleCastSkill = async (damage: number, skillId: number) => {
    await axios.put('http://localhost:3000/skills/cast', { skillId });
    await onUse(damage);
    fetchYourSkills();
  };

  return (
    <Container>
      <ScrollContainer>
        <CardContainer>
          {skills.map((skill) => (
            <SkillCard
              onClick={() => {
                handleCastSkill(
                  skill.skill.damage !== undefined
                    ? skill.skill.damage * skill.level
                    : 0,
                  Number(skill.id)
                );
                fetchYourSkills();
              }}
              key={skill.id}
            >
              <SkillInfoContainer>
                {(skill.cooldownTurnsLeft !== undefined &&
                  skill.cooldownTurnsLeft > 0 && (
                    <>
                      <Heading>Cooldown: </Heading>
                      <Cooldown>{skill.cooldownTurnsLeft}</Cooldown>
                    </>
                  )) || (
                  <>
                    <SubHeading>{skill.skill.name}</SubHeading>
                    {(skill.skill.damage && (
                      <p>Damage: {skill.skill.damage * skill.level}</p>
                    )) || <p>Healing: {skill.skill.healing}</p>}
                  </>
                )}
              </SkillInfoContainer>
            </SkillCard>
          ))}
        </CardContainer>
      </ScrollContainer>
    </Container>
  );
};

export default ActiveSkillsMiniContainer;
