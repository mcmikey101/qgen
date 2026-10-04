import React from 'react';
import type { Deck } from './types';

interface DeckCardProps {
  deck: Deck;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck }) => (
  <div className="card">
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
);

export default DeckCard;