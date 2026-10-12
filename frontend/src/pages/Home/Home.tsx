import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { fakeDecks } from './Home_components/fakeDecks';
import type { Deck, Flashcard, NewDeckValues } from './Home_components/types';
import DeckFilters from './Home_components/DeckFilters';
import DeckGrid from './Home_components/DeckGrid';
import CreateDeckDialog from './Home_components/CreateDeckDialog';
import DeckDetails from './Home_components/DeckDetails';

const Home: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>(fakeDecks);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [nextDeckId, setNextDeckId] = useState(Math.max(...fakeDecks.map((deck) => deck.id)) + 1);
  const [nextCardId, setNextCardId] = useState(Math.max(0, ...fakeDecks.flatMap((deck) => deck.cards.map((card) => card.id))) + 1);

  const uniqueTags = useMemo(
    () => Array.from(new Set(decks.flatMap((deck) => deck.tags))),
    [decks]
  );

  const filteredDecks = useMemo(
    () => decks.filter((deck) =>
      deck.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterTag === '' || deck.tags.includes(filterTag))
    ),
    [decks, search, filterTag]
  );

  const selectedDeck = decks.find((deck) => deck.id === selectedDeckId);

  const handleCreateDeck = (values: NewDeckValues) => {
    const deck: Deck = {
      id: nextDeckId,
      name: values.name.trim(),
      description: values.description.trim(),
      tags: values.tags,
      isPublic: values.isPublic,
      cards: [],
      cardCount: 0,
    };
    setDecks((current) => [deck, ...current]);
    setNextDeckId((id) => id + 1);
    setSelectedDeckId(deck.id);
  };

  const updateDeck = (updates: Partial<Pick<Deck, 'name' | 'description' | 'isPublic'>>) => {
    setDecks((current) => current.map((deck) =>
      deck.id === selectedDeckId ? { ...deck, ...updates } : deck
    ));
  };

  const saveCard = (card: Omit<Flashcard, 'id'>, id?: number) => {
    setDecks((current) => current.map((deck) => {
      if (deck.id !== selectedDeckId) return deck;
      const cards = id
        ? deck.cards.map((existing) => existing.id === id ? { ...existing, ...card } : existing)
        : [...deck.cards, { ...card, id: nextCardId }];
      return { ...deck, cards, cardCount: cards.length };
    }));
    if (!id) setNextCardId((current) => current + 1);
  };

  const deleteCard = (id: number) => {
    setDecks((current) => current.map((deck) => {
      if (deck.id !== selectedDeckId) return deck;
      const cards = deck.cards.filter((card) => card.id !== id);
      return { ...deck, cards, cardCount: cards.length };
    }));
  };

  const deleteDeck = () => {
    setDecks((current) => current.filter((deck) => deck.id !== selectedDeckId));
    setSelectedDeckId(null);
  };

  return (
    <Box className="home-page">
      {selectedDeck ? (
        <DeckDetails
          deck={selectedDeck}
          onBack={() => setSelectedDeckId(null)}
          onUpdate={updateDeck}
          onDeleteDeck={deleteDeck}
          onSaveCard={saveCard}
          onDeleteCard={deleteCard}
        />
      ) : (
        <>
          <Box className="home-heading">
            <Typography variant="h4" component="h1">Мои колоды</Typography>
            <Typography color="text.secondary">Создавайте колоды и добавляйте карточки</Typography>
          </Box>
          <DeckFilters
            search={search}
            onSearchChange={setSearch}
            filterTag={filterTag}
            onFilterTagChange={setFilterTag}
            tags={uniqueTags}
            onCreateClick={() => setIsDialogOpen(true)}
          />
          {filteredDecks.length > 0 ? (
            <DeckGrid decks={filteredDecks} onOpen={(deck) => setSelectedDeckId(deck.id)} />
          ) : (
            <Box className="empty-decks">
              <Typography variant="h6">Колоды не найдены</Typography>
              <Typography color="text.secondary">Создайте колоду или измените параметры поиска.</Typography>
            </Box>
          )}
          <CreateDeckDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onCreate={handleCreateDeck}
          />
        </>
      )}
    </Box>
  );
};

export default Home;
