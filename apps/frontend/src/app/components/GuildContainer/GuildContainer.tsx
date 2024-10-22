import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CardConteiner, Container, GuildCard, StyledButton, StyledInput } from './GuildContainer.styled';


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
  const [name, setName] = useState('');
  const [guildId, setGuildId] = useState<number | null>(null);

  useEffect(() => {
    fetchGuilds();
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

  const createGuild = async () => {
    if (!name) return;
    try {
      await axios.post('http://localhost:3000/guild', { name, guildMastersId: heroId });
      setName('');
      fetchGuilds();
    } catch (error) {
      console.error('Error creating guild:', error);
    }
  };

  const updateGuild = async () => {
    if (!guildId || !name) return;
    try {
      await axios.put(`http://localhost:3000/guild`, { id: guildId, name });
      setName('');
      setGuildId(null);
      fetchGuilds();
    } catch (error) {
      console.error('Error updating guild:', error);
    }
  };

  const deleteGuild = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/guild/${id}`);
      fetchGuilds();
    } catch (error) {
      console.error('Error deleting guild:', error);
    }
  };

  return (
    <Container>
      <h2>Guild Manager</h2>
      <StyledInput
        type="text"
        placeholder="Enter Guild Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <StyledButton onClick={createGuild}>Create Guild</StyledButton>

      <h3>Existing Guilds</h3>
      <CardConteiner>
      {guilds.map((guild) => (
        <GuildCard key={guild.id}>
          <h4>{guild.name}</h4>
          <StyledButton onClick={() => {
            setName(guild.name);
            setGuildId(guild.id);
          }}>
            Edit
          </StyledButton>
          <StyledButton onClick={() => deleteGuild(guild.id)}>Delete</StyledButton>
          <StyledButton onClick={updateGuild}>Update Guild</StyledButton>
        </GuildCard>
      ))}
      </CardConteiner>
    </Container>
  );
};

export default GuildContainer;
