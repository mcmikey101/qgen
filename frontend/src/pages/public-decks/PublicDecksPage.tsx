import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { fetchPublicDecks } from '../../entities/deck/api/demoDecks';
import type { PublicDeck } from '../../entities/deck/model/types';
import { useAsync } from '../../shared/lib/useAsync';
import { EmptyState, ErrorState, LoadingState } from '../../shared/ui/StateViews';

const PublicDeckList: React.FC<{ decks: PublicDeck[]; searchName: string; searchTag: string }> = ({
  decks,
  searchName,
  searchTag,
}) => {
  const filteredDecks = decks.filter((deck) => {
    const nameMatch = deck.name.toLowerCase().includes(searchName.toLowerCase());
    const tagMatch = deck.tags.some((tag) =>
      tag.toLowerCase().includes(searchTag.toLowerCase())
    );
    return nameMatch && tagMatch;
  });

  if (decks.length === 0) {
    return <EmptyState title="Публичных колод пока нет" description="Сделайте свою колоду публичной, чтобы поделиться ею." />;
  }
  if (filteredDecks.length === 0) {
    return <EmptyState title="Ничего не найдено" description="Попробуйте изменить название или тег в поиске." />;
  }

  return (
    <div className="list-vertical">
      {filteredDecks.map((deck, index) => (
        <div className="card appear" style={{ animationDelay: `${index * 50}ms` }} key={deck.id}>
          <div className="card-title">{deck.name}</div>
          <div className="card-tags">
            {deck.tags.map((tag) => (
              <span className="tag-badge" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className="card-reactions">
            <span className="reaction reaction-like">
              <ThumbUpIcon fontSize="inherit" /> {deck.likes}
            </span>
            <span className="reaction reaction-dislike">
              <ThumbDownIcon fontSize="inherit" /> {deck.dislikes}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const PublicDecksPage: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const { state, retry } = useAsync(fetchPublicDecks);

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          label="Поиск по названию"
          variant="outlined"
          fullWidth
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <TextField
          label="Поиск по тегам"
          variant="outlined"
          fullWidth
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
        />
      </Box>

      {state.status === 'loading' && <LoadingState text="Загружаем публичные колоды…" />}
      {state.status === 'error' && <ErrorState message={state.error} onRetry={retry} />}
      {state.status === 'success' && (
        <PublicDeckList decks={state.data} searchName={searchName} searchTag={searchTag} />
      )}
    </Box>
  );
};

export default PublicDecksPage;
