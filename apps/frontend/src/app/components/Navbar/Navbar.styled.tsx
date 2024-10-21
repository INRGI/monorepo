import styled from '@emotion/styled';

export const NavContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #2e2e2e;
  padding: 15px 20px;
  border-bottom: 2px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
`;

export const NavItem = styled.div`
  font-size: 20px;
  margin: 0 10px;

  a {
    color: white;
    text-decoration: none;
    border: 2px solid transparent;
    padding: 8px 12px;
    border-radius: 5px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #4e4e4e;
      border: 2px solid white;
    }

    &:active {
      background-color: #6e6e6e;
    }
  }
`;
