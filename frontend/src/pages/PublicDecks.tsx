import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import './Pages.css';

const fakePublicDecks = [
  { id: 1, name: 'World History', tags: ['History', 'Geography'], likes: 120, dislikes: 4 },
  { id: 2, name: 'Spanish Vocab', tags: ['Spanish', 'Language'], likes: 85, dislikes: 2 },
  { id: 3, name: 'React Hooks', tags: ['Programming', 'React'], likes: 200, dislikes: 10 },
  { id: 4, name: 'Chemistry Elements', tags: ['Science', 'Chemistry'], likes: 60, dislikes: 1 },
];

const PublicDecks: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [searchTag, setSearchTag] = useState('');

  const filteredDecks = fakePublicDecks.filter((deck) => {
    const nameMatch = deck.name.toLowerCase().includes(searchName.toLowerCase());
    const tagMatch = deck.tags.some((tag) =>
      tag.toLowerCase().includes(searchTag.toLowerCase())
    );
    return nameMatch && tagMatch;
  });

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

      <div className="list-vertical">
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
    </Box>
  );
};

export default PublicDecks;