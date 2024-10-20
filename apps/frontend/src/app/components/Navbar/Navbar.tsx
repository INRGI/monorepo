import React from 'react';
import { Link } from 'react-router-dom';
import { NavContainer, NavItem } from './Navbar.styled';

const Navbar: React.FC = () => {
  return (
    <NavContainer>
      <NavItem>
        <Link to="/">Home</Link>
      </NavItem>
      <NavItem>
        <Link to="/shop">Shop</Link>
      </NavItem>
      <NavItem>
        <Link to="/inventory">Inventory</Link>
      </NavItem>
    </NavContainer>
  );
};

export default Navbar;
