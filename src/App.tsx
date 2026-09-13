import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PublicDecks from './pages/PublicDecks';
import AnkiConfig from './pages/AnkiConfig';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/public-decks" element={<PublicDecks />} />
        <Route path="/anki-config" element={<AnkiConfig />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;