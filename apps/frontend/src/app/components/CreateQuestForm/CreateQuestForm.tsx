import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Form,
  Input,
} from '../RegistrationForm/RegistrationForm.styled';

const CreateQuestForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [rewardCoins, setRewardCoins] = useState(0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:3000/quests', {
      name,
      description,
      taskType,
      targetAmount,
      rewardCoins,
    });
  };

  return (
    <Form>
      <h2>Create Quest</h2>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <Input
        type="text"
        value={taskType}
        onChange={(e) => setTaskType(e.target.value)}
        placeholder="Task Type"
      />
      <Input
        type="number"
        value={targetAmount}
        onChange={(e) => setTargetAmount(+e.target.value)}
        placeholder="Target Amount"
      />
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

export default CreateQuestForm;
