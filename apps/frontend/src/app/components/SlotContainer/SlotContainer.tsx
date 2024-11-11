import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { css } from '@emotion/react';
import {
  BetButtons,
  BetSection,
  Button,
  Container,
  Header,
  PlayButton,
  Result,
  Slot,
  SlotContainer,
  TryAgainText,
  WinText,
} from './SlotContainer.styled';
import { Character } from '../../types/types';
import { toastCustom } from '../../helpers/toastify';

const spin = css`
  animation: spin 1s infinite linear;
  @keyframes spin {
    0% {
      transform: rotateX(0deg);
    }
    100% {
      transform: rotateX(360deg);
    }
  }
`;

interface SlotMachineProps {
  hero: Character;
  updateHero: (hero: Character) => void;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ hero, updateHero }) => {
  const [bet, setBet] = useState<number>(100);
  const [result, setResult] = useState<string[]>(['⭐', '⭐', '⭐']);
  const [win, setWin] = useState<number | null>(null);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketConnection = io('http://localhost:3000');
    setSocket(socketConnection);

    socketConnection.on(
      'playResult',
      (data: { result: string[]; win: number }) => {
        const { result, win } = data;

        if (win > 0) {
          toastCustom(`🤑 You won ${win} coins`);
          const updatedHero = { ...hero, coins: hero.coins + win };
          updateHero(updatedHero);
        }
        if (win < 0) {
          toastCustom(`😿 You lost ${Math.abs(win)} coins`);
          const updatedHero = { ...hero, coins: hero.coins - win }; 
          updateHero(updatedHero);
        }

        setResult(result);
        setWin(win);
        setSpinning(false);
      }
    );

    return () => {
      socketConnection.disconnect();
    };
  }, [hero, updateHero]);

  const playSlots = () => {
    if (spinning || hero.coins < bet) return;

    setSpinning(true);
    setWin(null);

    if (socket) {
      socket.emit('play', { bet, heroId: hero._id });
    }
  };

  return (
    <Container>
      <Header>Slot Machine</Header>
      <BetSection>
        <p>Bet: {bet}</p>
        <BetButtons>
          <Button onClick={() => setBet(bet - 100)} disabled={spinning || bet <= 100}>
            -
          </Button>
          <Button onClick={() => setBet(bet + 100)} disabled={spinning}>
            +
          </Button>
        </BetButtons>
      </BetSection>

      <SlotContainer>
        {result.map((symbol, index) => (
          <Slot key={index} spinning={spinning} css={spinning && spin}>
            {symbol}
          </Slot>
        ))}
      </SlotContainer>

      <PlayButton onClick={playSlots} disabled={spinning || hero.coins < bet}>
        {spinning ? 'Spinning...' : 'Spin'}
      </PlayButton>
    </Container>
  );
};

export default SlotMachine;
