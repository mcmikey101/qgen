import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCurrentUser } from '../../entities/user/api/demoUser';
import type { User } from '../../entities/user/model/types';
import { email, hasErrors, maxLength, required, validate } from '../../shared/lib/validation';
import { useAsync } from '../../shared/lib/useAsync';
import { ErrorState, LoadingState } from '../../shared/ui/StateViews';

const ProfileView: React.FC<{ initialUser: User }> = ({ initialUser }) => {
  const [user, setUser] = useState(initialUser);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const errors = {
    name: validate(editName, required('Введите имя'), maxLength(50)),
    email: validate(editEmail, required('Введите email'), email),
  };
  const nameError = submitted ? errors.name : null;
  const emailError = submitted ? errors.email : null;

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setSubmitted(false);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const handleSaveEdit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors(errors)) return;
    setUser({ ...user, name: editName.trim(), email: editEmail.trim() });
    setIsEditOpen(false);
  };

  const handleLogout = () => {
    setIsLogoutOpen(false);
  };

  const handleDeleteAccount = () => {
    setIsDeleteOpen(false);
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 500, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, marginBottom: 3 }}>
        <Avatar sx={{ width: 80, height: 80, fontSize: 32 }}>
          {user.name.charAt(0)}
        </Avatar>
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Дата регистрации: {user.joinedAt}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Количество колод: {user.decksCount}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="contained" startIcon={<EditIcon />} onClick={handleOpenEdit}>
          Редактировать информацию
        </Button>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={() => setIsLogoutOpen(true)}
        >
          Выйти из профиля
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setIsDeleteOpen(true)}
        >
          Удалить профиль
        </Button>
      </Box>

      <Dialog open={isEditOpen} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <form onSubmit={handleSaveEdit} noValidate>
          <DialogTitle>Редактирование информации</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
              <TextField
                label="Имя"
                variant="outlined"
                fullWidth
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                error={Boolean(nameError)}
                helperText={nameError ?? ' '}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                error={Boolean(emailError)}
                helperText={emailError ?? ' '}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Отмена</Button>
            <Button type="submit" variant="contained">
              Сохранить
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={isLogoutOpen} onClose={() => setIsLogoutOpen(false)}>
        <DialogTitle>Выход из профиля</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите выйти из профиля?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLogoutOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleLogout}>
            Выйти
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle>Удаление профиля</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Это действие необратимо. Все ваши колоды и данные будут удалены безвозвратно. Продолжить?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteOpen(false)}>Отмена</Button>
          <Button variant="contained" color="error" onClick={handleDeleteAccount}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ProfilePage: React.FC = () => {
  const { state, retry } = useAsync(fetchCurrentUser);

  if (state.status === 'loading') return <LoadingState text="Загружаем профиль…" />;
  if (state.status === 'error') {
    return <Box sx={{ padding: 2 }}><ErrorState message={state.error} onRetry={retry} /></Box>;
  }
  return <ProfileView initialUser={state.data} />;
};

export default ProfilePage;
