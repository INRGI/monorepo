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
} from './GuildContainer.styled';

interface Guild {
  id: number;
  name: string;
  guildMastersId: string;
}

interface GuildContainerProps {
  heroId: string;
}

const GuildContainer: React.FC<GuildContainerProps> = ({ heroId }) => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [myGuild, setMyGuild] = useState<Guild | null>(null);
  const [name, setName] = useState('');
  const [guildId, setGuildId] = useState<number | null>(null);

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
        setGuildId(response.data.id)
      }
    } catch (error) {
      console.error('Error fetching my guild:', error);
      setMyGuild(null);
    }
  };

  const createGuild = async () => {
    if (!name) return;
    try {
      await axios.post('http://localhost:3000/guild', { name, guildMastersId: heroId });
      setName('');
      fetchGuilds();
      fetchMyGuild();
    } catch (error) {
      console.error('Error creating guild:', error);
    }
  };

  const updateGuild = async (name: string) => {
    console.log(name, guildId)
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
    } catch (error) {
      console.error('Error deleting guild:', error);
    }
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
                  <StyledButton onClick={() => updateGuild(name)}>Update Guild</StyledButton>
                  <StyledButton onClick={() => deleteGuild(myGuild.id)}>
                    Delete Guild
                  </StyledButton>
                </ButtonGroup>
              </>
            ) : (
              <p>You are a member of the guild but not the master.</p>
            )}
          </MyGuildContainer>
        ) : (
          <>
            <Heading>Create Your Own Guild</Heading>
            <StyledInput
              type="text"
              placeholder="Enter Guild Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <StyledButton onClick={createGuild}>Create Guild</StyledButton>
          </>
        )}
      </GuildInfoContainer>

      <GuildListContainer>
        <SubHeading>Existing Guilds</SubHeading>
        <CardContainer>
          {guilds.map((guild) => (
            <GuildCard key={guild.id}>
              <h4>{guild.name}</h4>
              <StyledButton onClick={() => console.log(`Join guild ${guild.id}`)}>
                View Guild
              </StyledButton>
            </GuildCard>
          ))}
        </CardContainer>
      </GuildListContainer>
    </Container>
  );
};

export default GuildContainer;
