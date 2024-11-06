import React, { useState } from 'react';
import axios from 'axios';
import { Character, HOL, HolResult } from '../../types/types';
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  GuessButton,
  ModalContainer,
  RedButton,
  StyledButton,
  StyledInput,
} from './HOLGameContainer.styled';

interface HOLGameContainerProps {
  hero: Character;
  updateHero: (hero: Character) => void;
}

const HOLGameContainer: React.FC<HOLGameContainerProps> = ({
  hero,
  updateHero,
}) => {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HolResult | null>(null);
  const [gameData, setGameData] = useState<HOL | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const startGame = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await axios.post(
        'http://localhost:3000/hol-game/start',
        {
          heroId: hero._id,
          betAmount,
        }
      );
      setGameData(response.data);

      setModalIsOpen(true);
      toastCustom(`💸 You spent ${betAmount} coins`);
    } catch (error) {
      toastCustom(`😰 Error starting game`);
    } finally {
      setIsLoading(false);
    }
  };

  const choose = async (guessChoosed: 'higher' | 'lower') => {
    try {
      const response = await axios.post(
        'http://localhost:3000/hol-game/choose',
        { ...gameData, guessChoosed: guessChoosed }
      );

      if (response.data?.ifLoose) {
        setResult(response.data);
        setGameData(null);
        toastCustom(`😰 You lost`);
        return;
      }
      toastCustom(`😎 You were right`);
      setGameData(response.data);
    } catch (error) {
      toastCustom(`😰 Error choosing the game`);
    }
  };

  const stopGame = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/hol-game/stop',
        gameData
      );
      setResult(response.data);
      setGameData(null);
      toastCustom(`😎 You won ${response.data.rewardCoins} coins`);
    } catch (error) {
      toastCustom(`😰 Error stoping the game`);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Container>
      <h3>Higher or Lower Game</h3>

      <p>Bet Amount:</p>
      <StyledInput
        type="text"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        disabled={isLoading}
      />

      <StyledButton onClick={startGame} disabled={isLoading}>
        {isLoading ? 'Preparing...' : 'Play'}
      </StyledButton>

      <ModalContainer
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
          },
        }}
      >
        {gameData && (
          <>
            <p>Guess the next number</p>
            <GuessButton onClick={() => choose('higher')}>Higher</GuessButton>
            <h2>{gameData.prevNumber}</h2>
            <GuessButton onClick={() => choose('lower')}>Lower</GuessButton>
            <RedButton type="button" onClick={stopGame}>
              Save Coins
            </RedButton>
          </>
        )}
        {result && (
          <>
            <h2>Your Results:</h2>
            <p>Your reward: {result.rewardCoins} coins</p>
          </>
        )}
      </ModalContainer>
    </Container>
  );
};

export default HOLGameContainer;
