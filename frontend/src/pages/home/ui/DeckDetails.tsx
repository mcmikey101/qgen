import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { Deck, DeckSettings, Flashcard, FlashcardDraft } from '../../../entities/deck/model/types';
import AnkiUploadDialog from '../../../features/upload-to-anki/ui/AnkiUploadDialog';
import EditDeckDialog from '../../../features/edit-deck/ui/EditDeckDialog';
import CardFormDialog from '../../../features/edit-card/ui/CardFormDialog';
import FileImportPanel from '../../../features/generate-cards/ui/FileImportPanel';
import { EmptyState } from '../../../shared/ui/StateViews';

interface DeckDetailsProps {
  deck: Deck;
  onBack: () => void;
  onUpdate: (updates: DeckSettings) => void;
  onDeleteDeck: () => void;
  onSaveCard: (card: FlashcardDraft, id?: number) => void;
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
  const [ankiDialogOpen, setAnkiDialogOpen] = useState(false);
  const [cardSearch, setCardSearch] = useState('');

  const openCardDialog = (card: Flashcard | null) => {
    setCardToEdit(card);
    setCardDialogOpen(true);
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

      <FileImportPanel />

      <Box className="cards-heading">
        <Typography variant="h5" component="h2">Карточки</Typography>
        <Button variant="contained" onClick={() => openCardDialog(null)}>Добавить вручную</Button>
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
        <EmptyState
          title="В этой колоде пока нет карточек"
          description="Добавьте первую карточку вручную или загрузите учебный материал."
        />
      ) : filteredCards.length === 0 ? (
        <EmptyState title="Совпадений нет" description="Попробуйте изменить поисковый запрос." />
      ) : (
        <Box className="flashcard-list">
          {filteredCards.map((card, index) => (
            <Card key={card.id} variant="outlined" className="appear">
              <CardContent className="flashcard-content">
                <Typography className="flashcard-number">{String(index + 1).padStart(2, '0')}</Typography>
                <Box className="flashcard-copy">
                  <Typography variant="subtitle2" color="text.secondary">Вопрос</Typography>
                  <Typography>{card.front}</Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1.5 }}>Ответ</Typography>
                  <Typography>{card.back}</Typography>
                </Box>
                <Box className="flashcard-actions">
                  <IconButton aria-label="Изменить карточку" onClick={() => openCardDialog(card)}><EditOutlinedIcon /></IconButton>
                  <IconButton aria-label="Удалить карточку" color="error" onClick={() => onDeleteCard(card.id)}><DeleteOutlineIcon /></IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <EditDeckDialog
        open={editDeckOpen}
        deck={{ name: deck.name, description: deck.description, isPublic: deck.isPublic }}
        onClose={() => setEditDeckOpen(false)}
        onSave={onUpdate}
      />

      <CardFormDialog
        open={cardDialogOpen}
        card={cardToEdit}
        onClose={() => setCardDialogOpen(false)}
        onSave={onSaveCard}
      />

      <Dialog open={deleteDeckOpen} onClose={() => setDeleteDeckOpen(false)}>
        <DialogTitle>Удалить колоду?</DialogTitle>
        <DialogContent>Колода «{deck.name}» и все её карточки будут удалены из этого прототипа.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDeckOpen(false)}>Отмена</Button>
          <Button color="error" variant="contained" onClick={onDeleteDeck}>Удалить</Button>
        </DialogActions>
      </Dialog>

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
