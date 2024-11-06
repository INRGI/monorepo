import React, { useState } from 'react';
import axios from 'axios';
import { Card, Character } from '../../types/types';
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CardItem,
  Container,
  GuessCardsContainer,
  ModalContainer,
  StyledButton,
  StyledInput,
} from './GuessCardContainer.styled';

interface GuessCardContainerProps {
  hero: Character;
  updateHero: (hero: Character) => void;
}

const GuessCardContainer: React.FC<GuessCardContainerProps> = ({
  hero,
  updateHero,
}) => {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [cards, setCards] = useState<Card[] | []>([]);
  const [gameResult, setGameResult] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const fetchCards = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/guess-card/start',
        {
          hero: hero,
          betAmount,
        }
      );

      if (response.data) setCards(response.data.cards);
      setModalIsOpen(true);
      toastCustom(`💸 You spent ${betAmount} coins`);
    } catch (error) {
      toastCustom(`😰 Error starting game`);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCards([]);
    setGameResult(null);
  };

  const fetchResult = async (id: number) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/guess-card/choose',
        {
          hero: hero,
          cards: cards,
          cardId: id,
        }
      );
      setCards([]);
      setGameResult(response.data.card);
      toastCustom(`🤑 You won ${gameResult?.rewardCoins}`);
    } catch (error) {
      toastCustom(`😰 Error fetching result`);
    }
  };

  return (
    <Container>
      <h3>Guess Card Game</h3>

      <p>Bet Amount:</p>
      <StyledInput
        type="text"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        disabled={isLoading}
      />

      <StyledButton onClick={fetchCards} disabled={isLoading}>
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
        {cards && (
          <>
            <h2>Choose One Card</h2>
            <GuessCardsContainer>
              {cards.map((card) => (
                <CardItem
                  onClick={() => fetchResult(card.id)}
                  id={String(card.id)}
                >
                  {/* Here will be card */}
                  <p>Card</p>
                </CardItem>
              ))}
            </GuessCardsContainer>
          </>
        )}
        {gameResult && (
          <>
            <GuessCardsContainer>
              {gameResult && (
                <CardItem>
                  <p>Your reward: {gameResult.rewardCoins}</p>
                </CardItem>
              )}
            </GuessCardsContainer>
            <button onClick={closeModal}>Close</button>
          </>
        )}
      </ModalContainer>
    </Container>
  );
};

export default GuessCardContainer;
