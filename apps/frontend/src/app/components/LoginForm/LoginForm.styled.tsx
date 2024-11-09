import styled from '@emotion/styled';

export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7fc;
  background-image: linear-gradient(to bottom right, #007bff, #6a5acd);
  font-family: 'Arial', sans-serif;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 350px;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const Header = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

export const Input = styled.input`
  padding: 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

export const Button = styled.button`
  padding: 15px;
  margin: 15px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export const LinkText = styled.p`
  font-size: 14px;
  color: #666;
  
  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Message = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
`;
