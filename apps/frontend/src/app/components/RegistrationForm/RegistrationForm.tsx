import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, FormContainer, Header, LinkText, Message } from './RegistrationForm.styled';
import { Link } from 'react-router-dom';

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
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Header>Register</Header>
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
        {message && <Message>{message}</Message>}
        <LinkText>
          Already have an account? <Link to="/">Log in</Link>
        </LinkText>
      </Form>
    </FormContainer>
  );
};

export default RegistrationForm;
