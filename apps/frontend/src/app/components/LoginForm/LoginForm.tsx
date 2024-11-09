import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, FormContainer, Header, LinkText, Message } from './LoginForm.styled';
import { Link } from 'react-router-dom';

const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post('http://localhost:3000/auth/login', { email, password })
      .then((response) => {
        const token = response.data.access_token;
        localStorage.setItem('token', token);
        onLogin();
      })
      .catch((error) => {
        setErrorMessage('Login failed. Please check your credentials.');
        console.error('Login failed:', error.response?.data || error.message);
      });
  };

  return (
    <FormContainer>
      <Form onSubmit={handleLogin}>
        <Header>Login</Header>
        {errorMessage && <Message>{errorMessage}</Message>}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <Button type="submit">Login</Button>
        <LinkText>
          Don't have an account? <Link to="/register">Register</Link>
        </LinkText>
      </Form>
    </FormContainer>
  );
};

export default LoginForm;
