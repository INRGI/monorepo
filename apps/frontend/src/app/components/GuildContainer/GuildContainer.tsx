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
  ScrollContainer,
  GuildMatesContainer,
  UpdateModalContainer,
  StartEventModalContainer,
  BossesContainer,
  BossCard,
} from './GuildContainer.styled';
import { Character, GuildBoss } from '../../types/types';
import GuildBossModal from '../GuildBossContainer/GuildBossModal';
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Guild {
  id: number;
  name: string;
  logo: string;
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
  hero: Character
}

const GuildContainer: React.FC<GuildContainerProps> = ({ heroId, hero }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bossModalIsOpen, setBossModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
  const [heroesWithoutGuild, setHeroesWithoutGuild] = useState<Character[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [myGuild, setMyGuild] = useState<Guild | null>(null);
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [guildId, setGuildId] = useState<number | null>(null);
  const [currentGuildDetail, setCurrentGuildDetail] = useState<Guild | null>(
    null
  );
  const [myGuildDetails, setMyGuildDetails] = useState<Guild | null>(null);
  const [bosses, setBosses] = useState<GuildBoss[] | null>(null);
  const [guildBoss, setGuildBoss] = useState<GuildBoss | null>(null);

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
        if (response.data.id) fetchMyGuildDetails(response.data.id);
      }
    } catch (error) {
      console.error('Error fetching my guild:', error);
      setMyGuild(null);
    }
  };

  const inviteHeroToGuild = async (heroId: string) => {
    try {
      await axios.post('http://localhost:3000/guild/invite', {
        heroId: heroId,
        id: guildId,
      });
      toastCustom(`✅ Hero invited to guild`);
    } catch (error) {
      console.error('Error inviting hero to guild:', error);
    } finally {
      fetchMyGuild();
      fetchAllHeroes();
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
    } catch (error) {
      console.error('Error creating guild:', error);
      setCurrentGuildDetail(null);
    }
  };

  const fetchMyGuildDetails = async (id: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/guild/${id}`);
      setMyGuildDetails(response.data);
      fetchBoss(id);
    } catch (error) {
      console.error('Error creating guild:', error);
      setMyGuildDetails(null);
    }
  };

  const fetchBosses = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/guild-boss`);
      setBosses(response.data);
    } catch (error) {
      console.error('Error fetching:', error);
      setBosses(null);
    }
  };

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
      toastCustom(`✅ Guild ${name} created`);
    } catch (error) {
      console.error('Error creating guild:', error);
    }
  };

  const updateGuild = async (name: string, logo: string) => {
    if (!guildId) return;
    try {
      const updateData: { id: number; name?: string; logo?: string } = {
        id: guildId,
      };

      if (name) {
        updateData.name = name;
      }
      if (logo) {
        updateData.logo = logo;
      }
      await axios.put(`http://localhost:3000/guild/update`, updateData);
      setName('');
      setLogo('');
      fetchGuilds();
      fetchMyGuild();
      toastCustom(`✅ Guild ${name} updated`);
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
      toastCustom(`✅ Guild ${name} deleted`);
    } catch (error) {
      console.error('Error deleting guild:', error);
    }
  };

  const kickFromGuild = async (heroId: string) => {
    try {
      await axios.post(`http://localhost:3000/guild/remove`, {
        id: guildId,
        heroId: heroId,
      });
      fetchMyGuild();
      fetchAllHeroes();
      toastCustom(`👞 Hero kicked`);
    } catch (error) {
      console.error('Error kicking users:', error);
    }
  };

  const startEvent = async (bossId: number) => {
    if(!guildId) return;
    try {
      const response = await axios.put(`http://localhost:3000/guild-boss/startIvent`, {
        guildBossId: bossId,
        guildId,
      });
      setGuildBoss(response.data.data?.boss);
      fetchBoss(guildId);
      toastCustom(`☠️ Boss event started`);
    } catch (error) {
      console.error('Error starting event:', error);
    }
  };

  const leaveEvent = async () => {
    if(!guildId) return;
    try {
      await axios.put(`http://localhost:3000/guild-boss/leaveIvent`, {
        guildId,
      });
      setGuildBoss(null);
      fetchBoss(guildId);
      toastCustom(`☠️ Boss event closed`);
    } catch (error) {
      console.error('Error leaving event:', error);
    }
  };

  const fetchBoss = async (id: number) => {
    try {
      const response = await axios.get<GuildBoss>(
        `http://localhost:3000/guild-boss/${id}`
      );
      setGuildBoss(response.data);
    } catch (error) {
      setGuildBoss(null);
      console.error('Error fetching boss:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Container>
      <GuildInfoContainer>
        {myGuild ? (
          <MyGuildContainer>
            <img src={myGuild.logo} alt={myGuild.name} />
            <Heading>My Guild: {myGuild.name}</Heading>
            {myGuild.guildMastersId === heroId ? (
              <>
                <ButtonGroup>
                  <EditButton onClick={() => setUpdateModalIsOpen(true)}>
                    Update Guild
                  </EditButton>
                  <UpdateModalContainer
                    isOpen={updateModalIsOpen}
                    onRequestClose={() => setUpdateModalIsOpen(false)}
                    contentLabel="Update Guild"
                  >
                    <StyledInput
                      type="text"
                      placeholder="Edit Guild Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <StyledInput
                      type="text"
                      placeholder="Edit Guild Logo"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                    />

                    <EditButton onClick={() => updateGuild(name, logo)}>
                      Save Updates
                    </EditButton>
                  </UpdateModalContainer>
                  <EditButton onClick={() => deleteGuild(myGuild.id)}>
                    Delete Guild
                  </EditButton>
                  {!guildBoss && (
                    <EditButton
                      onClick={() => {
                        setEventModalIsOpen(true);
                        fetchBosses();
                      }}
                    >
                      Start Event
                    </EditButton>
                  )}
                  <StartEventModalContainer
                    isOpen={eventModalIsOpen}
                    onRequestClose={() => setEventModalIsOpen(false)}
                    contentLabel="Events"
                  >
                    <BossesContainer>
                      {bosses &&
                        bosses.map((boss) => (
                          <BossCard key={boss.id}>
                            <p>Name: {boss.name}</p>
                            <p>Health: {boss.health}</p>
                            <p>Reward: {boss.rewardCoins}</p>
                            <EditButton
                              onClick={() => {
                                startEvent(boss.id);
                                setEventModalIsOpen(false);
                              }}
                            >
                              Start Fight
                            </EditButton>
                          </BossCard>
                        ))}
                    </BossesContainer>
                  </StartEventModalContainer>
                  {guildBoss && (
                    <><EditButton onClick={() => leaveEvent()}>
                      Leave Event
                    </EditButton>
                    <EditButton onClick={() => setBossModalIsOpen(true)}>
                    Start Fighting
                  </EditButton></>
                  )}
                </ButtonGroup>
                {guildId && guildBoss && <GuildBossModal fetchBoss={fetchBoss} boss={guildBoss} hero={hero} guildId={guildId}  modalIsOpen={bossModalIsOpen} closeModal={() => setBossModalIsOpen(false)}/>}
                <GuildMatesContainer>
                  {myGuildDetails &&
                    myGuildDetails.guildParticipants?.map((part, index) => (
                      <ParticipantCard key={index}>
                        <p>Name: {part.hero.name}</p>
                        <p>Level: {part.hero.level}</p>
                        <p>Attack: {part.hero.attack}</p>
                        {(myGuildDetails.guildMastersId === heroId &&
                          part.heroId !== heroId && (
                            <EditButton
                              onClick={() => kickFromGuild(part.heroId)}
                            >
                              KICK
                            </EditButton>
                          )) || <p>Role: Guild Master</p>}
                      </ParticipantCard>
                    ))}
                </GuildMatesContainer>
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
        <ScrollContainer>
          <CardContainer>
            {guilds.map((guild) => (
              <GuildCard key={guild.id}>
                <h4>{guild.name}</h4>
                <StyledButton
                  onClick={() => {
                    fetchGuildDetails(guild.id);
                    setModalIsOpen(true);
                  }}
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
        </ScrollContainer>
      </GuildListContainer>

      <HeroesListContainer>
        <h3>Heroes Without Guild</h3>
        <ScrollContainer>
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
        </ScrollContainer>
      </HeroesListContainer>
    </Container>
  );
};

export default GuildContainer;
