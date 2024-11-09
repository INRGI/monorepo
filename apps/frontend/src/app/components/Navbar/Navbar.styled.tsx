import styled from '@emotion/styled';

export const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #0a0a0a, #3a0a45);
  padding: 10px 20px;
  border-bottom: 3px solid #fff;
  position: fixed;
  width: 100%;
  top: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  z-index: 2;
`;

export const NavLogo = styled.div`
  font-size: 26px;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const NavMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0 15px;

  a {
    display: flex;
    align-items: center;
    color: white;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 18px;
    text-transform: capitalize;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(194, 42, 60, 0.8);
      color: white;
      box-shadow: 0 0 10px rgba(194, 42, 60, 0.8);
    }

    &:active {
      background-color: rgba(194, 42, 60, 1);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
    }

    svg {
      margin-right: 10px;
      font-size: 20px;
    }
  }
`;
