import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { fetchMyDecks } from '../../entities/deck/api/demoDecks';
import type { Deck, DeckSettings, FlashcardDraft } from '../../entities/deck/model/types';
import DeckGrid from '../../entities/deck/ui/DeckGrid';
import DeckFilters from '../../features/filter-decks/ui/DeckFilters';
import CreateDeckDialog from '../../features/create-deck/ui/CreateDeckDialog';
import type { NewDeckValues } from '../../features/create-deck/model/useCreateDeckForm';
import { useAsync } from '../../shared/lib/useAsync';
import { EmptyState, ErrorState, LoadingState } from '../../shared/ui/StateViews';
import DeckDetails from './ui/DeckDetails';

const HomeHeading: React.FC = () => (
  <Box className="home-heading">
    <Typography variant="h4" component="h1">Мои колоды</Typography>
    <Typography color="text.secondary">Создавайте колоды и добавляйте карточки</Typography>
  </Box>
);

const DeckWorkspace: React.FC<{ initialDecks: Deck[] }> = ({ initialDecks }) => {
  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [nextDeckId, setNextDeckId] = useState(Math.max(0, ...initialDecks.map((deck) => deck.id)) + 1);
  const [nextCardId, setNextCardId] = useState(Math.max(0, ...initialDecks.flatMap((deck) => deck.cards.map((card) => card.id))) + 1);

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
    };
    setDecks((current) => [deck, ...current]);
    setNextDeckId((id) => id + 1);
    setSelectedDeckId(deck.id);
  };

  const updateDeck = (updates: DeckSettings) => {
    setDecks((current) => current.map((deck) =>
      deck.id === selectedDeckId ? { ...deck, ...updates } : deck
    ));
  };

  const saveCard = (card: FlashcardDraft, id?: number) => {
    setDecks((current) => current.map((deck) => {
      if (deck.id !== selectedDeckId) return deck;
      const cards = id
        ? deck.cards.map((existing) => existing.id === id ? { ...existing, ...card } : existing)
        : [...deck.cards, { ...card, id: nextCardId }];
      return { ...deck, cards };
    }));
    if (!id) setNextCardId((current) => current + 1);
  };

  const deleteCard = (id: number) => {
    setDecks((current) => current.map((deck) =>
      deck.id === selectedDeckId ? { ...deck, cards: deck.cards.filter((card) => card.id !== id) } : deck
    ));
  };

  const deleteDeck = () => {
    setDecks((current) => current.filter((deck) => deck.id !== selectedDeckId));
    setSelectedDeckId(null);
  };

  return (
    <Box key={selectedDeck ? `deck-${selectedDeck.id}` : 'list'} className="page-transition">
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
          <HomeHeading />
          <DeckFilters
            search={search}
            onSearchChange={setSearch}
            filterTag={filterTag}
            onFilterTagChange={setFilterTag}
            tags={uniqueTags}
            onCreateClick={() => setIsDialogOpen(true)}
          />
          {decks.length === 0 ? (
            <EmptyState title="У вас пока нет колод" description="Нажмите «Создать колоду», чтобы начать." />
          ) : filteredDecks.length > 0 ? (
            <DeckGrid decks={filteredDecks} onOpen={(deck) => setSelectedDeckId(deck.id)} />
          ) : (
            <EmptyState title="Колоды не найдены" description="Измените параметры поиска или фильтр по тегу." />
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

const HomePage: React.FC = () => {
  const { state, retry } = useAsync(fetchMyDecks);

  return (
    <Box className="home-page">
      {state.status !== 'success' && <HomeHeading />}
      {state.status === 'loading' && <LoadingState text="Загружаем ваши колоды…" />}
      {state.status === 'error' && <ErrorState message={state.error} onRetry={retry} />}
      {state.status === 'success' && <DeckWorkspace initialDecks={state.data} />}
    </Box>
  );
};

export default HomePage;
