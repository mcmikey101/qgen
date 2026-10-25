import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import PublicDecksPage from '../pages/public-decks/PublicDecksPage';
import AnkiConfigPage from '../pages/anki-config/AnkiConfigPage';
import ProfilePage from '../pages/profile/ProfilePage';
import Navbar from '../shared/ui/Navbar';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/public-decks" element={<PublicDecksPage />} />
        <Route path="/anki-config" element={<AnkiConfigPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
};

export default App;
