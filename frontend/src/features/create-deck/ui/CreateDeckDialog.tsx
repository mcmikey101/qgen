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
import { useCreateDeckForm, type NewDeckValues } from '../model/useCreateDeckForm';
import { DECK_DESCRIPTION_MAX, TAG_MAX } from '../../../entities/deck/model/validation';
import TagInput from '../../../shared/ui/TagInput';

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
  const { values, errors, setField, submitted, submit, reset } = useCreateDeckForm();
  const nameError = submitted ? errors.name : null;
  const descriptionError = submitted ? errors.description : null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!submit()) return;
    onCreate(values);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleCreate} noValidate>
        <DialogTitle>Создание колоды</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
            <TextField
              label="Название колоды"
              variant="outlined"
              fullWidth
              required
              autoFocus
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
              error={Boolean(nameError)}
              helperText={nameError ?? ' '}
            />

            <TextField
              label="Описание колоды"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
              error={Boolean(descriptionError)}
              helperText={descriptionError ?? `${values.description.trim().length}/${DECK_DESCRIPTION_MAX}`}
            />

            <TagInput tags={values.tags} onChange={(tags) => setField('tags', tags)} maxTagLength={TAG_MAX} />

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
          <Button type="submit" variant="contained">
            Создать
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateDeckDialog;
