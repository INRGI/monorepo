import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Form,
  Input,
} from '../RegistrationForm/RegistrationForm.styled';

const CreateGuildBossForm: React.FC = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [attack, setAttack] = useState(0);
  const [health, setHealth] = useState(0);
  const [rewardCoins, setRewardCoins] = useState(0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:3000/guild-boss', {
      name,
      image,
      attack,
      health,
      rewardCoins,
    });
  };

  return (
    <Form>
      <h2>Create Boss</h2>
      <p>Name</p>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <p>image</p>
      <Input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="image"
      />
      <p>attack</p>
      <Input
        type="number"
        value={attack}
        onChange={(e) => setAttack(+e.target.value)}
        placeholder="attack"
      />
      <p>health</p>
      <Input
        type="number"
        value={health}
        onChange={(e) => setHealth(+e.target.value)}
        placeholder="health"
      />
      <p>Reward Coins</p>
      <Input
        type="number"
        value={rewardCoins}
        onChange={(e) => setRewardCoins(+e.target.value)}
        placeholder="Reward Coins"
      />
      <Button onClick={handleCreate}>Create</Button>
    </Form>
  );
};

export default CreateGuildBossForm;
