import React from 'react';
import { Button } from '@mui/material';
import type { Deck } from '../model/types';

interface DeckCardProps {
  deck: Deck;
  onOpen: (deck: Deck) => void;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck, onOpen }) => (
  <div className="card">
    <div className="card-title">{deck.name}</div>
    <div className="card-text deck-description">{deck.description || 'Без описания'}</div>
    <div className="card-tags">
      {deck.tags.map((tag) => (
        <span className="tag-badge" key={tag}>
          {tag}
        </span>
      ))}
    </div>
    <div className="card-footer">
      <div className="card-text">Карточек: {deck.cards.length}</div>
      <Button size="small" variant="contained" onClick={() => onOpen(deck)}>Открыть</Button>
    </div>
  </div>
);

export default DeckCard;
