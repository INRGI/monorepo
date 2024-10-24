import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  CardContainer,
  Container,
  GuildCard,
  StyledButton,
  StyledInput,
  Heading,
  SubHeading,
  ButtonGroup,
  GuildInfoContainer,
  GuildListContainer,
  MyGuildContainer,
  HeroesListContainer,
  HeroesList,
  HeroesCard,
  EditButton,
  ModalContainer,
  ParticipantCard,
} from './GuildContainer.styled';
import { Character } from '../../types/types';

interface Guild {
  id: number;
  name: string;
  guildMastersId: string;
  guildParticipants?: Participant[];
}

interface Participant {
  id: number;
  heroId: string;
  hero: Character;
}

interface GuildContainerProps {
  heroId: string;
}

const GuildContainer: React.FC<GuildContainerProps> = ({ heroId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [heroesWithoutGuild, setHeroesWithoutGuild] = useState<Character[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [myGuild, setMyGuild] = useState<Guild | null>(null);
  const [name, setName] = useState('');
  const [guildId, setGuildId] = useState<number | null>(null);
  const [currentGuildDetail, setCurrentGuildDetail] = useState<Guild | null>(null);

  useEffect(() => {
    fetchGuilds();
    fetchMyGuild();
  }, []);

  const fetchGuilds = async () => {
    try {
      const response = await axios.get<Guild[]>('http://localhost:3000/guild');
      setGuilds(response.data);
    } catch (error) {
      console.error('Error fetching guilds:', error);
      setGuilds([]);
    }
  };

  const fetchMyGuild = async () => {
    try {
      const response = await axios.get<Guild | { error: string }>(
        `http://localhost:3000/guild/my/${heroId}`
      );
      if ('error' in response.data) {
        setMyGuild(null);
      } else {
        setMyGuild(response.data);
        setGuildId(response.data.id);
      }
    } catch (error) {
      console.error('Error fetching my guild:', error);
      setMyGuild(null);
    }
  };

  const inviteHeroToGuild = async (heroId: string) => {
    try {
      await axios.post('http://localhost:3000/guild/invite', {
        heroId,
        guildId,
      });
      fetchAllHeroes();
    } catch (error) {
      console.error('Error inviting hero to guild:', error);
    }
  };

  const fetchAllHeroes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/guild/heroes');
      setHeroesWithoutGuild(response.data);
    } catch (error) {
      console.error('Error creating guild:', error);
      setHeroesWithoutGuild([]);
    }
  };

  useEffect(() => {
    fetchAllHeroes();
  }, []);

  const fetchGuildDetails = async (id: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/guild/${id}`);
      setCurrentGuildDetail(response.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error creating guild:', error);
      setCurrentGuildDetail(null);
    }
  }

  const createGuild = async () => {
    if (!name) return;
    try {
      await axios.post('http://localhost:3000/guild', {
        name,
        guildMastersId: heroId,
      });
      setName('');
      fetchGuilds();
      fetchMyGuild();
      fetchAllHeroes();
    } catch (error) {
      console.error('Error creating guild:', error);
    }
  };

  const updateGuild = async (name: string) => {
    console.log(name, guildId);
    if (!guildId || !name) return;
    try {
      await axios.put(`http://localhost:3000/guild`, { id: guildId, name });
      setName('');
      fetchGuilds();
      fetchMyGuild();
    } catch (error) {
      console.error('Error updating guild:', error);
    }
  };

  const deleteGuild = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/guild/${id}`);
      fetchGuilds();
      fetchMyGuild();
      fetchAllHeroes();
    } catch (error) {
      console.error('Error deleting guild:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentGuildDetail(null);
  };

  return (
    <Container>
      <GuildInfoContainer>
        {myGuild ? (
          <MyGuildContainer>
            <Heading>My Guild: {myGuild.name}</Heading>
            {myGuild.guildMastersId === heroId ? (
              <>
                <StyledInput
                  type="text"
                  placeholder="Edit Guild Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <ButtonGroup>
                  <EditButton onClick={() => updateGuild(name)}>
                    Update Guild
                  </EditButton>
                  <EditButton onClick={() => deleteGuild(myGuild.id)}>
                    Delete Guild
                  </EditButton>
                </ButtonGroup>
              </>
            ) : (
              <p>You are a member of the guild but not the master.</p>
            )}
          </MyGuildContainer>
        ) : (
          <MyGuildContainer>
            <Heading>Create Your Own Guild</Heading>
            <StyledInput
              type="text"
              placeholder="Enter Guild Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <StyledButton onClick={createGuild}>Create Guild</StyledButton>
          </MyGuildContainer>
        )}
      </GuildInfoContainer>

      <GuildListContainer>
        <SubHeading>Existing Guilds</SubHeading>
        <CardContainer>
          {guilds.map((guild) => (
            <GuildCard key={guild.id}>
              <h4>{guild.name}</h4>
              <StyledButton
                onClick={() => fetchGuildDetails(guild.id)}
              >
                View Guild
              </StyledButton>
            </GuildCard>
          ))}
          <ModalContainer
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Item Details"
            >
              <h2>Guild Details</h2>
              {currentGuildDetail && (
                <>
                  <h2>Name: {currentGuildDetail.name}</h2>
                  <p>Members:</p>
                  {currentGuildDetail.guildParticipants?.map((part, index) => (
                    <ParticipantCard key={index}>
                      <p>Name: {part.hero.name}</p>
                      <p>Level: {part.hero.level}</p>
                      <p>Attack: {part.hero.attack}</p>
                    </ParticipantCard>
                  ))}
                  <button onClick={closeModal}>Close</button>
                </>
              )}
            </ModalContainer>
        </CardContainer>
      </GuildListContainer>

      <HeroesListContainer>
        <h3>Heroes Without Guild</h3>
        <HeroesList>
        {heroesWithoutGuild.map((hero) => (
          <HeroesCard key={hero._id}>
            <p>{hero.name}</p>
            <p>Level: {hero.level}</p>
            <StyledButton onClick={() => inviteHeroToGuild(hero._id)}>
              Invite to Guild
            </StyledButton>
          </HeroesCard>
        ))}
        </HeroesList>
      </HeroesListContainer>
    </Container>
  );
};

export default GuildContainer;
