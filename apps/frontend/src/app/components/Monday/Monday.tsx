import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input } from '../RegistrationForm/RegistrationForm.styled';

const Monday: React.FC = () => {
  const [product, setProduct] = useState('');

  const handleFetchProducts = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .get(`http://localhost:3000/monday/product/${product}`)
      .then((response) => {
      })
      .catch((error) => {
        console.error('Login failed:', error.response.data);
      });
  };

  const handleFetchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .get(`http://localhost:3000/monday/product-status/${product}`)
      .then((response) => {
      })
      .catch((error) => {
        console.error('Login failed:', error.response.data);
      });
  };

  const handleDomainSending = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .get(`http://localhost:3000/monday/product-sending/${product}`)
      .then((response) => {
      })
      .catch((error) => {
        console.error('Login failed:', error.response.data);
      });
  };
  

  return (
    <Form>
      <h2>Monday Data</h2>
      <Input
        type="text"
        value={product}
        onChange={e => setProduct(e.target.value)}
        placeholder="product"
      />
      <Button onClick={handleFetchProducts}>Fetch Data</Button>
      <Button onClick={handleFetchStatus}>Fetch Status</Button>
      <Button onClick={handleDomainSending}>Product Sending</Button>
    </Form>
  );
};

export default Monday;
