import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import type { DeckSettings } from '../../../entities/deck/model/types';
import { validateDeckFields } from '../../../entities/deck/model/validation';
import { hasErrors } from '../../../shared/lib/validation';

interface EditDeckDialogProps {
  open: boolean;
  deck: DeckSettings;
  onClose: () => void;
  onSave: (settings: DeckSettings) => void;
}

const EditDeckForm: React.FC<Omit<EditDeckDialogProps, 'open'>> = ({ deck, onClose, onSave }) => {
  const [values, setValues] = useState<DeckSettings>(deck);
  const errors = validateDeckFields(values);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (hasErrors(errors)) return;
    onSave({ name: values.name.trim(), description: values.description.trim(), isPublic: values.isPublic });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>Настройки колоды</DialogTitle>
      <DialogContent className="dialog-fields">
        <TextField
          label="Название"
          required
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          fullWidth
        />
        <TextField
          label="Описание"
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
          multiline
          minRows={3}
          fullWidth
        />
        <FormControlLabel
          control={<Switch checked={values.isPublic} onChange={(event) => setValues({ ...values, isPublic: event.target.checked })} />}
          label="Публичная колода"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" variant="contained">Сохранить</Button>
      </DialogActions>
    </form>
  );
};

const EditDeckDialog: React.FC<EditDeckDialogProps> = ({ open, ...props }) => (
  <Dialog open={open} onClose={props.onClose} fullWidth maxWidth="sm">
    <EditDeckForm {...props} />
  </Dialog>
);

export default EditDeckDialog;
