import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import type { Flashcard } from './types';

const ANKI_URL = 'http://127.0.0.1:8765';

type AnkiResponse<T> = { result: T; error: string | null };
type ImportMode = 'create' | 'existing';
type AnkiField = { value: string };
type AnkiNoteInfo = { fields: Record<string, AnkiField> };

interface AnkiUploadDialogProps {
  open: boolean;
  deckName: string;
  cards: Flashcard[];
  onClose: () => void;
}

async function invoke<T>(action: string, params: Record<string, unknown> = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(ANKI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, version: 6, params }),
    });
  } catch {
    throw new Error('Не удалось подключиться к Anki. Запустите Anki Desktop с установленным AnkiConnect.');
  }
  if (!response.ok) throw new Error(`Ошибка AnkiConnect: HTTP ${response.status}`);
  const data = (await response.json()) as AnkiResponse<T>;
  if (data.error) throw new Error(data.error);
  return data.result;
}

function toAnkiHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replace(/\r?\n/g, '<br>');
}

function normalizeField(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase();
}

const AnkiUploadDialog: React.FC<AnkiUploadDialogProps> = ({ open, deckName, cards, onClose }) => {
  const [mode, setMode] = useState<ImportMode>('create');
  const [newDeckName, setNewDeckName] = useState(deckName);
  const [availableDecks, setAvailableDecks] = useState<string[]>([]);
  const [selectedDeck, setSelectedDeck] = useState('');
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  const canUpload = useMemo(() => {
    if (uploading || loadingDecks || cards.length === 0) return false;
    return mode === 'create' ? Boolean(newDeckName.trim()) : Boolean(selectedDeck);
  }, [cards.length, loadingDecks, mode, newDeckName, selectedDeck, uploading]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setMode('create');
    setNewDeckName(deckName);
    setError('');
    setResultMessage('');
    setLoadingDecks(true);
    void invoke<number>('version')
      .then(() => invoke<string[]>('deckNames'))
      .then((names) => {
        if (!active) return;
        setAvailableDecks(names);
        setSelectedDeck(names.includes(deckName) ? deckName : names[0] ?? '');
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Не удалось получить список колод Anki.');
      })
      .finally(() => {
        if (active) setLoadingDecks(false);
      });
    return () => { active = false; };
  }, [deckName, open]);

  const upload = async () => {
    setUploading(true);
    setError('');
    setResultMessage('');
    try {
      let targetDeck = selectedDeck;
      if (mode === 'create') {
        targetDeck = newDeckName.trim();
        await invoke<number>('createDeck', { deck: targetDeck });
      }

      const modelNames = await invoke<string[]>('modelNames');
      if (!modelNames.includes('Basic')) {
        throw new Error('В Anki не найден тип заметки Basic, необходимый для карточек «Вопрос — Ответ».');
      }

      const noteIds = await invoke<number[]>('findNotes', { query: `deck:"${targetDeck.replaceAll('"', '\\"')}"` });
      const existingNotes = noteIds.length
        ? await invoke<AnkiNoteInfo[]>('notesInfo', { notes: noteIds })
        : [];
      const existingPairs = new Set(existingNotes.map((note) => {
        const front = note.fields.Front?.value ?? '';
        const back = note.fields.Back?.value ?? '';
        return `${normalizeField(front)}\u0000${normalizeField(back)}`;
      }));

      const pending = cards.filter((card) => {
        const key = `${normalizeField(card.front)}\u0000${normalizeField(card.back)}`;
        if (existingPairs.has(key)) return false;
        existingPairs.add(key);
        return true;
      });

      if (!pending.length) {
        setResultMessage(`В колоде «${targetDeck}» уже есть все ${cards.length} карточек.`);
        return;
      }

      const addedIds = await invoke<Array<number | null>>('addNotes', {
        notes: pending.map((card) => ({
          deckName: targetDeck,
          modelName: 'Basic',
          fields: { Front: toAnkiHtml(card.front), Back: toAnkiHtml(card.back) },
          options: { allowDuplicate: false },
        })),
      });
      const addedCount = addedIds.filter((id) => id !== null).length;
      setResultMessage(`Добавлено карточек: ${addedCount}. Уже существовало: ${cards.length - addedCount}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось загрузить карточки в Anki.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={uploading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Загрузить в Anki</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
        <RadioGroup value={mode} onChange={(event) => setMode(event.target.value as ImportMode)}>
          <FormControlLabel value="create" control={<Radio />} label="Создать новую колоду в Anki" />
          <FormControlLabel value="existing" control={<Radio />} label="Добавить в существующую колоду" />
        </RadioGroup>

        {mode === 'create' ? (
          <TextField
            label="Название новой колоды"
            value={newDeckName}
            onChange={(event) => setNewDeckName(event.target.value)}
            fullWidth
          />
        ) : (
          <FormControl fullWidth disabled={loadingDecks || availableDecks.length === 0}>
            <InputLabel id="anki-existing-deck-label">Колода Anki</InputLabel>
            <Select
              labelId="anki-existing-deck-label"
              label="Колода Anki"
              value={selectedDeck}
              onChange={(event) => setSelectedDeck(event.target.value)}
            >
              {availableDecks.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
            </Select>
            <FormHelperText>
              {loadingDecks ? 'Загружаю список колод…' : availableDecks.length ? 'Будут добавлены только отсутствующие карточки.' : 'В Anki пока нет колод.'}
            </FormHelperText>
          </FormControl>
        )}

        <Alert severity="info">
          Сравниваются и вопрос, и ответ. Совпадающие карточки повторно добавлены не будут.
        </Alert>
        {error && <Alert severity="error">{error}</Alert>}
        {resultMessage && <Alert severity="success">{resultMessage}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>Закрыть</Button>
        <Button variant="contained" onClick={() => void upload()} disabled={!canUpload}>
          {loadingDecks ? 'Подключение…' : uploading ? 'Загрузка…' : 'Загрузить карточки'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnkiUploadDialog;
