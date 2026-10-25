import React from 'react';
import './Navbar.css';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Главная' },
  { to: '/public-decks', label: 'Публичные колоды' },
  { to: '/anki-config', label: 'Конфигурация Anki' },
  { to: '/profile', label: 'Профиль' },
];

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Typography className="navbar-title">QGen</Typography>
        <Box className="navbar-links">
          {links.map((link) => (
            <NavLink key={link.to} className="navbar-link" to={link.to} end>
              {link.label}
            </NavLink>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
