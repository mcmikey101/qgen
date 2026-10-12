import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import type { Deck, Flashcard } from './types';
import AnkiUploadDialog from './AnkiUploadDialog';

interface DeckDetailsProps {
  deck: Deck;
  onBack: () => void;
  onUpdate: (updates: Partial<Pick<Deck, 'name' | 'description' | 'isPublic'>>) => void;
  onDeleteDeck: () => void;
  onSaveCard: (card: Omit<Flashcard, 'id'>, id?: number) => void;
  onDeleteCard: (id: number) => void;
}

const DeckDetails: React.FC<DeckDetailsProps> = ({
  deck,
  onBack,
  onUpdate,
  onDeleteDeck,
  onSaveCard,
  onDeleteCard,
}) => {
  const [editDeckOpen, setEditDeckOpen] = useState(false);
  const [deleteDeckOpen, setDeleteDeckOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<Flashcard | null>(null);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [deckName, setDeckName] = useState(deck.name);
  const [description, setDescription] = useState(deck.description);
  const [isPublic, setIsPublic] = useState(deck.isPublic);
  const [fileName, setFileName] = useState('');
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [ankiDialogOpen, setAnkiDialogOpen] = useState(false);
  const [cardSearch, setCardSearch] = useState('');

  useEffect(() => {
    setDeckName(deck.name);
    setDescription(deck.description);
    setIsPublic(deck.isPublic);
  }, [deck]);

  const openNewCard = () => {
    setCardToEdit(null);
    setFront('');
    setBack('');
    setCardDialogOpen(true);
  };

  const openEditCard = (card: Flashcard) => {
    setCardToEdit(card);
    setFront(card.front);
    setBack(card.back);
    setCardDialogOpen(true);
  };

  const saveCard = () => {
    onSaveCard({ front: front.trim(), back: back.trim() }, cardToEdit?.id);
    setCardDialogOpen(false);
  };

  const filteredCards = deck.cards.filter((card) =>
    `${card.front}\n${card.back}`.toLocaleLowerCase().includes(cardSearch.trim().toLocaleLowerCase())
  );

  return (
    <Box className="deck-detail">
      <Box className="detail-toolbar">
        <Button startIcon={<ArrowBackIcon />} onClick={onBack}>Все колоды</Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={() => setAnkiDialogOpen(true)}>Загрузить в Anki</Button>
          <Button startIcon={<EditOutlinedIcon />} onClick={() => setEditDeckOpen(true)}>Изменить колоду</Button>
          <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setDeleteDeckOpen(true)}>Удалить</Button>
        </Box>
      </Box>

      <Box className="deck-detail-heading">
        <Box>
          <Typography variant="h4" component="h1">{deck.name}</Typography>
          <Typography color="text.secondary">{deck.description || 'Без описания'}</Typography>
        </Box>
        <Typography className="visibility-label">{deck.isPublic ? 'Публичная' : 'Личная'} · {deck.cards.length} карточек</Typography>
      </Box>

      <Card variant="outlined" className="file-import-panel">
        <CardContent className="file-import-content">
          <Box>
            <Typography variant="h6">Добавить карточки из файла</Typography>
            <Typography variant="body2" color="text.secondary">
              PDF, DOCX, Markdown или TXT. Файл будет обработан и карточки добавятся в эту колоду.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
              {fileName || 'Выбрать файл'}
              <input
                hidden
                type="file"
                accept=".pdf,.docx,.md,.txt"
                onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
              />
            </Button>
            <Button
              variant="contained"
              disabled={!fileName}
              onClick={() => setNoticeOpen(true)}
            >
              Сгенерировать карточки
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box className="cards-heading">
        <Typography variant="h5" component="h2">Карточки</Typography>
        <Button variant="contained" onClick={openNewCard}>Добавить вручную</Button>
      </Box>

      <TextField
        className="card-search"
        label="Поиск карточек"
        placeholder="Введите текст вопроса или ответа"
        value={cardSearch}
        onChange={(event) => setCardSearch(event.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      {deck.cards.length === 0 ? (
        <Box className="empty-cards">
          <Typography variant="h6">В этой колоде пока нет карточек</Typography>
          <Typography color="text.secondary">Добавьте первую карточку вручную или загрузите учебный материал.</Typography>
        </Box>
      ) : filteredCards.length === 0 ? (
        <Box className="empty-cards">
          <Typography variant="h6">Совпадений нет</Typography>
          <Typography color="text.secondary">Попробуйте изменить поисковый запрос.</Typography>
        </Box>
      ) : (
        <Box className="flashcard-list">
          {filteredCards.map((card, index) => (
            <Card key={card.id} variant="outlined">
              <CardContent className="flashcard-content">
                <Typography className="flashcard-number">{String(index + 1).padStart(2, '0')}</Typography>
                <Box className="flashcard-copy">
                  <Typography variant="subtitle2" color="text.secondary">Вопрос</Typography>
                  <Typography>{card.front}</Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1.5 }}>Ответ</Typography>
                  <Typography>{card.back}</Typography>
                </Box>
                <Box className="flashcard-actions">
                  <IconButton aria-label="Изменить карточку" onClick={() => openEditCard(card)}><EditOutlinedIcon /></IconButton>
                  <IconButton aria-label="Удалить карточку" color="error" onClick={() => onDeleteCard(card.id)}><DeleteOutlineIcon /></IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={editDeckOpen} onClose={() => setEditDeckOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Настройки колоды</DialogTitle>
        <DialogContent className="dialog-fields">
          <TextField label="Название" value={deckName} onChange={(event) => setDeckName(event.target.value)} fullWidth />
          <TextField label="Описание" value={description} onChange={(event) => setDescription(event.target.value)} multiline minRows={3} fullWidth />
          <FormControlLabel control={<Switch checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} />} label="Публичная колода" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDeckOpen(false)}>Отмена</Button>
          <Button
            variant="contained"
            disabled={!deckName.trim()}
            onClick={() => {
              onUpdate({ name: deckName.trim(), description: description.trim(), isPublic });
              setEditDeckOpen(false);
            }}
          >Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cardDialogOpen} onClose={() => setCardDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{cardToEdit ? 'Изменить карточку' : 'Новая карточка'}</DialogTitle>
        <DialogContent className="dialog-fields">
          <TextField label="Вопрос" value={front} onChange={(event) => setFront(event.target.value)} multiline minRows={2} fullWidth autoFocus />
          <TextField label="Ответ" value={back} onChange={(event) => setBack(event.target.value)} multiline minRows={3} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCardDialogOpen(false)}>Отмена</Button>
          <Button variant="contained" disabled={!front.trim() || !back.trim()} onClick={saveCard}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDeckOpen} onClose={() => setDeleteDeckOpen(false)}>
        <DialogTitle>Удалить колоду?</DialogTitle>
        <DialogContent>Колода «{deck.name}» и все её карточки будут удалены из этого прототипа.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDeckOpen(false)}>Отмена</Button>
          <Button color="error" variant="contained" onClick={onDeleteDeck}>Удалить</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={noticeOpen} autoHideDuration={5000} onClose={() => setNoticeOpen(false)}>
        <Alert severity="info" onClose={() => setNoticeOpen(false)}>
          Интерфейс пока работает без backend: файл выбран, генерация здесь не выполняется.
        </Alert>
      </Snackbar>
      <AnkiUploadDialog
        open={ankiDialogOpen}
        deckName={deck.name}
        cards={deck.cards}
        onClose={() => setAnkiDialogOpen(false)}
      />
    </Box>
  );
};

export default DeckDetails;
