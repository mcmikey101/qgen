import React from 'react';
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';

export const LoadingState: React.FC<{ text?: string }> = ({ text = 'Загрузка…' }) => (
  <Box className="state-view fade-in" role="status">
    <CircularProgress size={32} />
    <Typography color="text.secondary">{text}</Typography>
  </Box>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <Alert
    className="fade-in"
    severity="error"
    action={onRetry && <Button color="inherit" size="small" onClick={onRetry}>Повторить</Button>}
  >
    {message}
  </Alert>
);

export const EmptyState: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <Box className="empty-state fade-in">
    <Typography variant="h6">{title}</Typography>
    {description && <Typography color="text.secondary">{description}</Typography>}
  </Box>
);
