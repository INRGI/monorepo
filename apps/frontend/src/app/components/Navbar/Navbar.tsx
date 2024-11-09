import React from 'react';
import { Link } from 'react-router-dom';
import { NavContainer, NavItem, NavMenu, NavLogo } from './Navbar.styled';
import { FaCog, FaGamepad, FaGavel, FaHome, FaInbox, FaRegListAlt, FaShoppingCart, FaUsers } from 'react-icons/fa';

const Navbar: React.FC = () => {
  return (
    <NavContainer>
      <NavMenu>
        <NavItem>
          <Link to="/">
            <FaHome />
            Home
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/quests">
            <FaRegListAlt />
            Quests
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/skills">
            <FaCog />
            Skills
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/shop">
            <FaShoppingCart />
            Shop
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/inventory">
            <FaInbox />
            Inventory
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/guild">
            <FaUsers />
            Guild
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/auction">
            <FaGavel />
            Auction
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/minigames">
            <FaGamepad />
            Mini Games
          </Link>
        </NavItem>
      </NavMenu>
    </NavContainer>
  );
};

export default Navbar;
