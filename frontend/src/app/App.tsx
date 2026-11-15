import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import HomePage from '../pages/home/HomePage';
import PublicDecksPage from '../pages/public-decks/PublicDecksPage';
import AnkiConfigPage from '../pages/anki-config/AnkiConfigPage';
import ProfilePage from '../pages/profile/ProfilePage';
import Navbar from '../shared/ui/Navbar';

type SessionUser = { id: number; username: string; created_at: string };
type AuthContextValue = { user: SessionUser | null; setUser: (user: SessionUser | null) => void; logout: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
export const useAuth = () => useContext(AuthContext)!;

const AuthPage: React.FC = () => {
  const { setUser } = useAuth();
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API}/auth/${register ? 'register' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? 'Ошибка авторизации');
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      const profile = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${data.access_token}` } });
      setUser(await profile.json());
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Ошибка сервера'); }
  };
  return <Box component="form" onSubmit={submit} sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}><Typography variant="h4">{register ? 'Регистрация' : 'Вход'}</Typography><TextField label="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} required /><TextField label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} required inputProps={{ minLength: 8 }} />{error && <Typography color="error">{error}</Typography>}<Button type="submit" variant="contained">{register ? 'Создать аккаунт' : 'Войти'}</Button><Button onClick={() => setRegister(!register)}>{register ? 'Уже есть аккаунт? Войти' : 'Зарегистрироваться'}</Button></Box>;
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/public-decks" element={<PublicDecksPage />} />
        <Route path="/anki-config" element={<PrivateRoute><AnkiConfigPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => useAuth().user ? <>{children}</> : <Navigate to="/auth" replace />;

const App: React.FC = () => {
  const [user, setUser] = useState<SessionUser | null>(null);
  useEffect(() => {
    const access = localStorage.getItem('access_token');
    if (!access) return;
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${access}` } }).then(async response => {
      if (!response.ok) throw new Error();
      setUser(await response.json());
    }).catch(async () => {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) return;
      try {
        const response = await fetch(`${API}/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: refresh }) });
        if (!response.ok) throw new Error();
        const tokens = await response.json();
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        const profile = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${tokens.access_token}` } });
        setUser(await profile.json());
      } catch { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); }
    });
  }, []);
  const logout = async () => {
    const access = localStorage.getItem('access_token'); const refresh = localStorage.getItem('refresh_token');
    try {
      if (access && refresh) await fetch(`${API}/auth/logout`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` }, body: JSON.stringify({ refresh_token: refresh }) });
    } finally {
      localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); setUser(null);
    }
  };
  return <AuthContext.Provider value={{ user, setUser, logout }}><Router><Navbar /><AnimatedRoutes /></Router></AuthContext.Provider>;
};

export default App;
