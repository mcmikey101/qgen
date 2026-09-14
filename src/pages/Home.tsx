import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Typography,
  Chip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import './Pages.css';

const fakeDecks = [
  { id: 1, name: 'Biology Basics', tags: ['Science', 'Biology'], cardCount: 50 },
  { id: 2, name: 'Japanese Vocab', tags: ['Japanese'], cardCount: 30 },
  { id: 3, name: 'JavaScript', tags: ['Programming', 'JavaScript'], cardCount: 40 },
  { id: 4, name: 'Geography', tags: ['Geography'], cardCount: 25 },
];

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [createInAnki, setCreateInAnki] = useState(false);
  const [newDeckTags, setNewDeckTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const uniqueTags = Array.from(
    new Set(fakeDecks.flatMap((deck) => deck.tags))
  );

  const filteredDecks = fakeDecks.filter(
    (deck) =>
      deck.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterTag === '' || deck.tags.includes(filterTag))
  );

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewDeckName('');
    setNewDeckDescription('');
    setSelectedFile(null);
    setIsPublic(false);
    setCreateInAnki(false);
    setNewDeckTags([]);
    setTagInput('');
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !newDeckTags.includes(trimmed)) {
      setNewDeckTags([...newDeckTags, trimmed]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setNewDeckTags(newDeckTags.filter((tag) => tag !== tagToDelete));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreateDeck = () => {
    // todo конвертация файла
    handleCloseDialog();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 2 }}>
        <TextField
          label="Поиск"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: '1 1 200px' }}
        />
        <FormControl sx={{ minWidth: 150, flex: '0 1 auto' }}>
          <InputLabel>Фильтр по тегу</InputLabel>
          <Select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            label="Фильтр по тегу"
          >
            <MenuItem value="">Все</MenuItem>
            {uniqueTags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          Создать колоду
        </Button>
      </Box>

      <div className="grid">
        {filteredDecks.map((deck) => (
          <div className="card" key={deck.id}>
            <div className="card-title">{deck.name}</div>
            <div className="card-tags">
              {deck.tags.map((tag) => (
                <span className="tag-badge" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="card-text">Количество карт: {deck.cardCount}</div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Создание колоды</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
            <TextField
              label="Название колоды"
              variant="outlined"
              fullWidth
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
            />

            <TextField
              label="Описание колоды"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={newDeckDescription}
              onChange={(e) => setNewDeckDescription(e.target.value)}
            />

            <Box>
              <TextField
                label="Добавить тег"
                variant="outlined"
                fullWidth
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                helperText="Нажмите Enter, чтобы добавить тег"
              />
              {newDeckTags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 1 }}>
                  {newDeckTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            </Box>

            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              {selectedFile ? selectedFile.name : 'Выбрать файл (pdf, md, txt)'}
              <input
                type="file"
                hidden
                accept=".pdf,.md,.txt"
                onChange={handleFileChange}
              />
            </Button>

            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              }
              label="Публичная колода"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={createInAnki}
                  onChange={(e) => setCreateInAnki(e.target.checked)}
                />
              }
              label="Создать колоду в Anki"
            />

            {!selectedFile && (
              <Typography variant="caption" color="text.secondary">
                Карточки будут сгенерированы автоматически из содержимого файла.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button
            variant="contained"
            onClick={handleCreateDeck}
            disabled={!newDeckName || !selectedFile}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
