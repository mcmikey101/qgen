import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { NewDeckValues } from './types';
import { useCreateDeckForm } from './UseCreateDeckForm';
import TagInput from './TagInput';

interface CreateDeckDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (values: NewDeckValues) => void;
}

const CreateDeckDialog: React.FC<CreateDeckDialogProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const { values, setField, reset } = useCreateDeckForm();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCreate = () => {
    onCreate(values);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Создание колоды</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
          <TextField
            label="Название колоды"
            variant="outlined"
            fullWidth
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
          />

          <TextField
            label="Описание колоды"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={values.description}
            onChange={(e) => setField('description', e.target.value)}
          />

          <TagInput tags={values.tags} onChange={(tags) => setField('tags', tags)} />

          <FormControlLabel
            control={
              <Switch
                checked={values.isPublic}
                onChange={(e) => setField('isPublic', e.target.checked)}
              />
            }
            label="Публичная колода"
          />

          <FormControlLabel
            control={
              <Switch
                checked={values.createInAnki}
                onChange={(e) => setField('createInAnki', e.target.checked)}
              />
            }
            label="Создать колоду в Anki"
          />

          <Typography variant="caption" color="text.secondary">
            Карточки можно добавить позже вручную или загрузить файл внутри колоды.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!values.name.trim()}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDeckDialog;
