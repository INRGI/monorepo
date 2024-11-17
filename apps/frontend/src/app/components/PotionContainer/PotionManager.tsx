import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  font-family: Arial, sans-serif;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

interface Potion {
  id: number;
  name: string;
  description: string;
  effect: string;
  duration: number;
  multiplier: number;
}

interface HeroPotion {
  id: number;
  potion: Potion;
  activatedAt: string | null;
}

interface Props {
  heroId: string;
}

const PotionManager: React.FC<Props> = ({ heroId }) => {
  const [potions, setPotions] = useState<Potion[]>([]);
  const [heroPotions, setHeroPotions] = useState<HeroPotion[]>([]);
  const [newPotion, setNewPotion] = useState({
    name: '',
    description: '',
    effect: '',
    duration: 0,
    multiplier: 0,
  });
  const [potionId, setPotionId] = useState<number | null>(null);

  const fetchAllPotions = async () => {
    const response = await axios.get<Potion[]>('http://localhost:3000/potion/all');
    setPotions(response.data);
  };

  const fetchHeroPotions = async () => {
    const response = await axios.get<HeroPotion[]>(`http://localhost:3000/potion/${heroId}`);
    setHeroPotions(response.data);
  };

  const createPotion = async () => {
    await axios.post('http://localhost:3000/potion/create', newPotion);
    fetchAllPotions();
    setNewPotion({ name: '', description: '', effect: '', duration: 0, multiplier: 0 });
  };

  const activatePotion = async () => {
    if (potionId) {
      await axios.put('http://localhost:3000/potion/activate', { heroId, potionId });
      fetchHeroPotions();
      setPotionId(null);
    }
  };

  useEffect(() => {
    fetchAllPotions();
    fetchHeroPotions();
  }, []);

  return (
    <Container>
      <h1>Potion Manager</h1>

      <h2>Create New Potion</h2>
      <Input
        placeholder="Name"
        value={newPotion.name}
        onChange={(e) => setNewPotion({ ...newPotion, name: e.target.value })}
      />
      <Input
        placeholder="Description"
        value={newPotion.description}
        onChange={(e) => setNewPotion({ ...newPotion, description: e.target.value })}
      />
      <Input
        placeholder="Effect"
        value={newPotion.effect}
        onChange={(e) => setNewPotion({ ...newPotion, effect: e.target.value })}
      />
      <Input
        placeholder="Duration"
        type="number"
        value={newPotion.duration}
        onChange={(e) => setNewPotion({ ...newPotion, duration: Number(e.target.value) })}
      />
      <Input
        placeholder="Multiplier"
        type="number"
        value={newPotion.multiplier}
        onChange={(e) => setNewPotion({ ...newPotion, multiplier: Number(e.target.value) })}
      />
      <Button onClick={createPotion}>Create Potion</Button>

      <h2>All Potions</h2>
      <ul>
        {potions.map((potion) => (
          <li key={potion.id}>{potion.name}</li>
        ))}
      </ul>

      <h2>Hero's Potions</h2>
      <ul>
        {heroPotions.map((heroPotion) => (
          <li key={heroPotion.id}>
            {heroPotion.potion.name} - Activated At: {heroPotion.activatedAt || 'Not activated'}
          </li>
        ))}
      </ul>

      <h2>Activate Potion</h2>
      <Input
        placeholder="Potion ID"
        type="number"
        value={potionId || ''}
        onChange={(e) => setPotionId(Number(e.target.value))}
      />
      <Button onClick={activatePotion}>Activate Potion</Button>
    </Container>
  );
};

export default PotionManager;
