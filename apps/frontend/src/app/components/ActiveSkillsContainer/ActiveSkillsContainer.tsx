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
} from './ActiveSkillsContainer.styled';
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ActiveSkillsContainerProps {
  hero: Character;
  onUse: (damage: number) => void;
}

const ActiveSkillsContainer: React.FC<ActiveSkillsContainerProps> = ({
  hero,
  onUse,
}) => {
  const [skills, setSkills] = useState<HeroSkill[]>([]);

  useEffect(() => {
    fetchYourSkills();
  }, [hero]);

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
    toastCustom(`🩸 You dealed ${damage}`);
    fetchYourSkills();
  };

  return (
    <Container>
      <Heading>Your Skills</Heading>
      <ScrollContainer>
        <CardContainer>
          {skills.map((skill) => (
            <SkillCard key={skill.id}>
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
                    {skill.cooldownTurnsLeft === 0 && (
                      <StyledButton
                        onClick={() =>
                          handleCastSkill(
                            skill.skill.damage !== undefined
                              ? skill.skill.damage * skill.level
                              : 0,
                            Number(skill.id)
                          )
                        }
                      >
                        Cast
                      </StyledButton>
                    )}
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

export default ActiveSkillsContainer;
