import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import BattleContainer from './components/BattleContainer/BattleContainer';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import LoginForm from './components/LoginForm/LoginForm';

const StyledApp = styled.div`
`;

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hero, setHero] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
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
  };

  return (
    <StyledApp>
      {isAuthenticated ? (
        hero ? (
          <BattleContainer hero={hero} />
        ) : (
          <p>Loading hero...</p>
        )
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
// test@t.com