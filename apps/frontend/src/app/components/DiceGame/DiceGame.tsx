import React, { useState } from 'react';
import axios from 'axios';
import { ModalContainer, Container, StyledInput, StyledButton } from './DiceGame.styled';
import { Character } from '../../types/types';

interface DiceGameProps {
  hero: Character;
  updateHero: (hero: Character) => void;
}

const DiceGame: React.FC<DiceGameProps> = ({ hero, updateHero }) => {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const playGame = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/dice/bet', {
        character: hero,
        betAmount,
      });
      const updatedHero = response.data.hero;

      setGameResult(response.data);

      setModalIsOpen(true);
      updateHero(updatedHero);
    } catch (error) {
      console.error('Error playing dice game:', error);
    } finally {

      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Container>
      <h3>Dice Game</h3>
      
        <p>Bet Amount:</p>
        <StyledInput
          type="text"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          disabled={isLoading}
        />
      
      <StyledButton onClick={playGame} disabled={isLoading}>
        {isLoading ? 'Rolling...' : 'Roll Dice'}
      </StyledButton>


      <ModalContainer isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Game Result</h2>
        {gameResult && (
          <>
          <p>Your Dice: {gameResult.heroRoll}</p>
          <p>Bot Dice: {gameResult.botRoll}</p>
            <p>
              {gameResult.winnings > 0 &&
                `You won: ${gameResult.winnings}`}
              {gameResult.winnings < 0 &&
                `You lost: ${gameResult.winnings}`}
              {gameResult.winnings === 0 && `Tie`}
            </p>
          </>
        )}
        <button onClick={closeModal}>Close</button>
      </ModalContainer>
    </Container>
  );
};

export default DiceGame;
