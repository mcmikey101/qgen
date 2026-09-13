import React from 'react';
import './Navbar.css';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Typography className="navbar-title">QGen</Typography>
        <Box className="navbar-links">
          <Link className="navbar-link" to="/">
            Главная
          </Link>
          <Link className="navbar-link" to="/public-decks">
            Публичные колоды
          </Link>
          <Link className="navbar-link" to="/anki-config">
            Конфигурация Anki
          </Link>
          <Link className="navbar-link" to="/profile">
            Профиль
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;