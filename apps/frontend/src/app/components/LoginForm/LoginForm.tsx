import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input } from '../RegistrationForm/RegistrationForm.styled';

const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios
      .post('http://localhost:3000/auth/login', { email, password })
      .then((response) => {
        const token = response.data.access_token;
        localStorage.setItem('token', token);
        onLogin();
      })
      .catch((error) => {
        console.error('Login failed:', error.response.data);
      });
  };
  

  return (
    <Form>
      <h2>Login</h2>
      <Input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <Input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Button onClick={handleLogin}>Login</Button>
    </Form>
  );
};

export default LoginForm;
