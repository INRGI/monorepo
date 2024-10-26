import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  CardContainer,
  Container,
  StyledButton,
  Heading,
  SubHeading,
  ScrollContainer,
  QuestCard,
  QuestInfoContainer,
} from './QuestContainer.styled';
import { HeroQuest } from '../../types/types';

interface QuestContainerProps {
  heroId: string;
}

const QuestContainer: React.FC<QuestContainerProps> = ({ heroId }) => {
  const [quests, setQuests] = useState<HeroQuest[]>([]);
  
  useEffect(() => {
    fetchQuests();
  }, [heroId]);

  const fetchQuests = async () => {
    try {
      const response = await axios.get<HeroQuest[]>(`http://localhost:3000/quests/${heroId}`);
      setQuests(response.data);
    } catch (error) {
      console.error('Error fetching quests:', error);
      setQuests([]);
    }
  };

  return (
    <Container>
      <Heading>Available Quests</Heading>
      <ScrollContainer>
        <CardContainer>
          {quests.map((quest) => (
            <QuestCard key={quest.id}>
              <QuestInfoContainer>
                <SubHeading>{quest.name}</SubHeading>
                <p>{quest.description}</p>
                <StyledButton onClick={() => console.log(`Starting quest: ${quest.name}`)}>
                  Start Quest
                </StyledButton>
              </QuestInfoContainer>
            </QuestCard>
          ))}
        </CardContainer>
      </ScrollContainer>
    </Container>
  );
};

export default QuestContainer;
