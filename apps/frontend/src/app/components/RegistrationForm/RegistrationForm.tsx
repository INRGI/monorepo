import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input } from './RegistrationForm.styled';

const RegistrationForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/auth/register', { email, password });
      setMessage('Registration successful!');

      try {
        const loginResponse = await axios.post('http://localhost:3000/auth/login', { email, password });
        localStorage.setItem('token', loginResponse.data.access_token);
        onLogin();
      } catch (error: any) {
        setMessage('Login failed after registration: ' + (error.response?.data?.message || error.message));
      }
    } catch (error: any) {
      setMessage('Registration failed: ' + (error.response?.data?.message || error.message));
    }

    setEmail('');
    setPassword('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Button type="submit">Register</Button>
      {message && <p>{message}</p>}
    </Form>
  );
};

export default RegistrationForm;
