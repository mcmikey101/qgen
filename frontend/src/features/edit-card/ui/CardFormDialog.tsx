import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import type { Flashcard, FlashcardDraft } from '../../../entities/deck/model/types';
import { validateCard } from '../../../entities/deck/model/validation';
import { hasErrors } from '../../../shared/lib/validation';

interface CardFormDialogProps {
  open: boolean;
  card: Flashcard | null;
  onClose: () => void;
  onSave: (card: FlashcardDraft, id?: number) => void;
}

const CardForm: React.FC<Omit<CardFormDialogProps, 'open'>> = ({ card, onClose, onSave }) => {
  const [values, setValues] = useState<FlashcardDraft>({ front: card?.front ?? '', back: card?.back ?? '' });
  const [submitted, setSubmitted] = useState(false);
  const errors = validateCard(values);
  const frontError = submitted ? errors.front : null;
  const backError = submitted ? errors.back : null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors(errors)) return;
    onSave({ front: values.front.trim(), back: values.back.trim() }, card?.id);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>{card ? 'Изменить карточку' : 'Новая карточка'}</DialogTitle>
      <DialogContent className="dialog-fields">
        <TextField
          label="Вопрос"
          required
          value={values.front}
          onChange={(event) => setValues({ ...values, front: event.target.value })}
          error={Boolean(frontError)}
          helperText={frontError ?? ' '}
          multiline
          minRows={2}
          fullWidth
          autoFocus
        />
        <TextField
          label="Ответ"
          required
          value={values.back}
          onChange={(event) => setValues({ ...values, back: event.target.value })}
          error={Boolean(backError)}
          helperText={backError ?? ' '}
          multiline
          minRows={3}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" variant="contained">Сохранить</Button>
      </DialogActions>
    </form>
  );
};

const CardFormDialog: React.FC<CardFormDialogProps> = ({ open, ...props }) => (
  <Dialog open={open} onClose={props.onClose} fullWidth maxWidth="sm">
    <CardForm {...props} />
  </Dialog>
);

export default CardFormDialog;
