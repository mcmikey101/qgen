import React from 'react';
import type { Deck } from './types';
import DeckCard from './DeckCard';

interface DeckGridProps {
  decks: Deck[];
}

const DeckGrid: React.FC<DeckGridProps> = ({ decks }) => (
  <div className="grid">
    {decks.map((deck) => (
      <DeckCard key={deck.id} deck={deck} />
    ))}
  </div>
);

export default DeckGrid;