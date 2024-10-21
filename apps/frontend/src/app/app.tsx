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
            <Routes>
              <Route
                path="/"
                element={<BattleContainer hero={hero} updateHero={updateHero} />}
              />
              <Route
                path="/shop"
                element={
                  <>
                    <BoxContainer hero={hero} updateHero={updateHero} />
                    <ItemByRarity hero={hero} updateHero={updateHero} />
                  </>
                }
              />
              <Route
                path="/inventory"
                element={<Inventory hero={hero} updateHero={updateHero} />}
              />
            </Routes>
          </>
        ) : (
          <>
            <RegistrationForm onLogin={handleLogin} />
            <LoginForm onLogin={handleLogin} />
          </>
        )}
      </StyledApp>
    </Router>
  );
}

export default App;

// test8@t.com
