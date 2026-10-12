import React from 'react';
import type { Deck } from './types';
import DeckCard from './DeckCard';

interface DeckGridProps {
  decks: Deck[];
  onOpen: (deck: Deck) => void;
}

const DeckGrid: React.FC<DeckGridProps> = ({ decks, onOpen }) => (
  <div className="grid">
    {decks.map((deck) => (
      <DeckCard key={deck.id} deck={deck} onOpen={onOpen} />
    ))}
  </div>
);

export default DeckGrid;
