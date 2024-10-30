import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Form,
  Input,
} from '../RegistrationForm/RegistrationForm.styled';

const CreateSkillForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [skillType, setSkillType] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [damage, setDamage] = useState<number | undefined>(undefined);
  const [healing, setHealing] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!damage && !healing) {
      setError('Please provide either damage or healing.');
      return;
    }
    
    setError('');

    try {
      await axios.post('http://localhost:3000/skills', {
        name,
        description,
        skillType,
        cooldown,
        damage,
        healing,
      });

      setName('');
      setDescription('');
      setSkillType('');
      setCooldown(0);
      setDamage(undefined);
      setHealing(undefined);
    } catch (err) {
      console.error('Error creating skill:', err);
      setError('Failed to create skill. Please try again.');
    }
  };

  return (
    <Form onSubmit={handleCreate}>
      <h2>Create Skill</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <Input
        type="text"
        value={skillType}
        onChange={(e) => setSkillType(e.target.value)}
        placeholder="Skill Type"
        required
      />
      <Input
        type="number"
        value={cooldown}
        onChange={(e) => setCooldown(+e.target.value)}
        placeholder="Cooldown"
        required
      />
      <Input
        type="number"
        value={damage !== undefined ? damage : ''}
        onChange={(e) => setDamage(e.target.value ? +e.target.value : undefined)}
        placeholder="Damage"
      />
      <Input
        type="number"
        value={healing !== undefined ? healing : ''}
        onChange={(e) => setHealing(e.target.value ? +e.target.value : undefined)}
        placeholder="Healing"
      />
      <Button type="submit">Create</Button>
    </Form>
  );
};

export default CreateSkillForm;
