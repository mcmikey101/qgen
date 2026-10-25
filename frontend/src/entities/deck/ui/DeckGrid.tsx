import React from 'react';
import type { Deck } from '../model/types';
import DeckCard from './DeckCard';

interface DeckGridProps {
  decks: Deck[];
  onOpen: (deck: Deck) => void;
}

const DeckGrid: React.FC<DeckGridProps> = ({ decks, onOpen }) => (
  <div className="grid">
    {decks.map((deck, index) => (
      <div className="appear" style={{ animationDelay: `${index * 50}ms` }} key={deck.id}>
        <DeckCard deck={deck} onOpen={onOpen} />
      </div>
    ))}
  </div>
);

export default DeckGrid;
