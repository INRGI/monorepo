import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import styled from '@emotion/styled';
import BattleContainer from './components/BattleContainer/BattleContainer';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import LoginForm from './components/LoginForm/LoginForm';
import { Character } from './types/types';
import BoxContainer from './components/BoxContainer/BoxContainer';
import ItemByRarity from './components/ItemByRarity/ItemByRarity';
import Inventory from './components/Inventory/Inventory';
import Chat from './components/Chat/Chat';
import Modal from 'react-modal';
import Navbar from './components/Navbar/Navbar';
import DiceGame from './components/DiceGame/DiceGame';
import GuildContainer from './components/GuildContainer/GuildContainer';
import Auction from './components/Auction/Auction';
import QuestContainer from './components/QuestContainer/QuestContainer';
import CreateQuestForm from './components/CreateQuestForm/CreateQuestForm';
import EquipContainer from './components/Equip/Equip';
import { Container } from './app.styled';
import SkillsContainer from './components/SkillsContainer/SkillsContainer';
import CreateSkillForm from './components/CreateSkillForm/CreateSkillForm';
import ActiveSkillsContainer from './components/ActiveSkillsContainer/ActiveSkillsContainer';
import Shop from './components/Shop/Shop';
import CreateGuildBossForm from './components/CreateGuildBossForm/CreateGuildBossForm';
import { Slide, ToastContainer } from 'react-toastify';
import GuessCardContainer from './components/GuessCardContainer/GuessCardContainer';
import HOLGameContainer from './components/HOLGameContainer/HOLGameContainer';
// import Monday from './components/Monday/Monday';

Modal.setAppElement('#root');

const StyledApp = styled.div`
  background-color: #2e2e2e;
`;

const defaultHero: Character = {
  _id: 'test',
  name: '',
  imageUrl: '',
  level: 1,
  attack: 10,
  health: 100,
  hp: 100,
  experience: 0,
  coins: 0,
  user: null,
};

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hero, setHero] = useState<Character>(defaultHero);

  const updateHero = (updatedHero: Character) => {
    setHero(updatedHero);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setHero(response.data.hero);
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    }
  }, []);

  const handleFetchHero = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setHero(response.data.hero);
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);

    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setHero(response.data.hero);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setIsAuthenticated(false);
        });
    }
  };

  return (
    <Router>
      <StyledApp>
        {isAuthenticated && hero ? (
          <>
            <Chat roomId="1" senderId={hero.name} />
            <Navbar />
            <ToastContainer
              position="top-right"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover={false}
              theme="dark"
              transition={Slide}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Container>
                    {/* <CreateGuildBossForm /> */}
                    <BattleContainer hero={hero} updateHero={updateHero} />

                    <EquipContainer
                      hero={hero}
                      handleFetchHero={handleFetchHero}
                    />
                  </Container>
                }
              />
              <Route
                path="/quests"
                element={
                  <Container>
                    {/* <CreateQuestForm /> */}
                    <QuestContainer heroId={hero._id} />
                  </Container>
                }
              />
              <Route
                path="/skills"
                element={
                  <Container>
                    {/* <CreateSkillForm /> */}
                    <SkillsContainer hero={hero} />
                  </Container>
                }
              />
              <Route
                path="/minigames"
                element={
                  <Container>
                    <DiceGame hero={hero} updateHero={updateHero} />
                    <GuessCardContainer hero={hero} updateHero={updateHero} />
                    <HOLGameContainer hero={hero} updateHero={updateHero} />
                  </Container>
                }
              />
              <Route
                path="/shop"
                element={
                  <Container>
                    <Shop hero={hero} updateHero={updateHero} />
                    <ItemByRarity hero={hero} updateHero={updateHero} />
                    <BoxContainer hero={hero} updateHero={updateHero} />
                  </Container>
                }
              />
              <Route
                path="/inventory"
                element={
                  <Container>
                    <Inventory
                      hero={hero}
                      updateHero={updateHero}
                      handleFetchHero={handleFetchHero}
                    />
                  </Container>
                }
              />
              <Route
                path="/guild"
                element={
                  <Container>
                    <GuildContainer
                      hero={hero}
                      heroId={hero._id}
                      updateHero={updateHero}
                      handleFetchHero={handleFetchHero}
                    />
                  </Container>
                }
              />
              <Route
                path="/auction"
                element={
                  <Container>
                    <Auction heroId={hero._id} updateHero={updateHero} />
                  </Container>
                }
              />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
            <Route
              path="/register"
              element={<RegistrationForm onLogin={handleLogin} />}
            />
          </Routes>
        )}
      </StyledApp>
    </Router>
  );
}

export default App;

// test8@t.com
// RANKING? MORE GAMES
