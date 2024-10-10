import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import BattleContainer from './components/BattleContainer/BattleContainer';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import LoginForm from './components/LoginForm/LoginForm';
import { Character } from './types/types';
import BoxContainer from './components/BoxContainer/BoxContainer';
import Modal from 'react-modal';
import ItemByRarity from './components/ItemByRarity/ItemByRarity';

Modal.setAppElement('#root');

const StyledApp = styled.div``;

const defaultHero: Character = {
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
    <StyledApp>
      {isAuthenticated && hero ? (
        <>
          <BattleContainer hero={hero} updateHero={updateHero} />
          <BoxContainer hero={hero}  updateHero={updateHero}/>
          <ItemByRarity hero={hero}  updateHero={updateHero}/>
        </>
      ) : (
        <>
          <RegistrationForm onLogin={handleLogin} />
          <LoginForm onLogin={handleLogin} />
        </>
      )}
    </StyledApp>
  );
}

export default App;
// test8@t.com
