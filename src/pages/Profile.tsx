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

const fakeUser = {
  name: 'Иван Иванов',
  email: 'ivan.ivanov@example.com',
  joinedAt: '12 марта 2024',
  decksCount: 8,
};

const Profile: React.FC = () => {
  const [user, setUser] = useState(fakeUser);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const handleSaveEdit = () => {
    setUser({ ...user, name: editName, email: editEmail });
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
        <DialogTitle>Редактирование информации</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
            <TextField
              label="Имя"
              variant="outlined"
              fullWidth
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Отмена</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Сохранить
          </Button>
        </DialogActions>
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

export default Profile;